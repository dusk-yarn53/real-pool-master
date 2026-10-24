const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),html=read('index.html');
assert.equal(html,read('play/index.html'));
assert(read('startup.js').includes('window.PoolIntro?.active'));
const code=html.split('<!-- CODE_INTRO_START -->')[1].split('<!-- CODE_INTRO_END -->')[0].match(/<script>([\s\S]*?)<\/script>/)[1];
function run(reduced=false,search=''){
 let removed=0,done=0,id=0;const timers=new Map(),events={},frameEvents={},skip={};
 const panel={remove(){removed++}};
 const frame={contentWindow:{},dataset:{src:'./startup-animation/index.html?embedded=1'},addEventListener:(k,f)=>frameEvents[k]=f};
 skip.addEventListener=(k,f)=>skip[k]=f;
 const document={getElementById:k=>({codeIntro:panel,originalIntro:frame,codeIntroSkip:skip})[k]};
 const window={matchMedia:()=>({matches:reduced}),setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id},clearTimeout:k=>timers.delete(k),addEventListener:(k,f)=>events[k]=f,removeEventListener:k=>delete events[k],dispatchEvent:e=>{if(e.type==='poolintro:done')done++}};
 vm.runInNewContext(code,{document,window,location:{origin:'https://pool.test',search},URLSearchParams,Event:class{constructor(type){this.type=type}}});
 return {window,frame,timers,events,frameEvents,skip,get removed(){return removed},get done(){return done},message(action,extra={}){events.message?.({source:frame.contentWindow,origin:'https://pool.test',data:{type:'aemeath-boot',action},...extra})}};
}
function released(f){assert.equal(f.removed,1);assert.equal(f.done,1);assert.equal(f.window.PoolIntro.active,false);assert.equal(f.timers.size,0)}
let f=run();assert(f.window.PoolIntro.active);assert.equal(f.frame.src,f.frame.dataset.src);assert.equal([...f.timers.values()][0].ms,25000);
f.message('complete',{origin:'https://other.test'});f.message('complete',{source:{}});f.message('complete',{data:{type:'other',action:'complete'}});assert.equal(f.removed,0);
f.message('ready');assert.equal(f.timers.size,1);assert.equal([...f.timers.values()][0].ms,16000);
f.message('reveal');assert.equal(f.removed,0);f.message('complete');released(f);f.skip.click();released(f);
for(const action of ['skip','assetError','error','timeout','pagehide']){f=run();if(action==='skip')f.skip.click();else if(action==='assetError')f.message(action);else if(action==='error')f.frameEvents.error();else if(action==='timeout')[...f.timers.values()][0].fn();else f.events.pagehide();released(f)}
for(const args of [[true],[false,'?test=loading']]){f=run(...args);released(f);assert.equal(f.frame.src,undefined)}
function checkMirror(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())checkMirror(p);else assert.deepEqual(fs.readFileSync(path.join(root,p)),fs.readFileSync(path.join(root,'play',p)),p)}}
checkMirror('startup-animation');
assert.match(read('startup-animation/animation.js'),/duration\s*=\s*12000/);
assert(read('startup-animation/assets/config.js').includes('欢迎回来，击打'));
console.log('PASS: original animation, mirror parity, trusted messages, completion, skip, failure, timeout and reduced-motion lifecycle');
