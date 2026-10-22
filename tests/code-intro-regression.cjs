const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),play=fs.readFileSync(path.join(root,'play/index.html'),'utf8'),startup=fs.readFileSync(path.join(root,'startup.js'),'utf8').trim();
assert.equal(html,play);assert.equal((html.match(/id="boot"/g)||[]).length,1);assert.equal((html.match(/id="codeIntro"/g)||[]).length,1);
assert(html.includes('<!-- CODE_INTRO_STYLE_START -->'));assert(html.includes('<!-- CODE_INTRO_END -->'));
assert(html.split('<!-- STARTUP_SCRIPT_START -->')[1].split('<!-- STARTUP_SCRIPT_END -->')[0].includes(startup));assert(startup.includes('window.PoolIntro?.active'));
const code=html.split('<!-- CODE_INTRO_START -->')[1].split('<!-- CODE_INTRO_END -->')[0].match(/<script>([\s\S]*?)<\/script>/)[1];
function run(reduced=false,compact=false,query='',lowPower=false){
 let removed=false;const timers=[],events={},classes=new Set(),skip={};
 const panel={remove(){removed=true},classList:{add:x=>classes.add(x)}};
 const document={hidden:false,getElementById:id=>id==='codeIntro'?panel:id==='codeIntroSkip'?skip:null,addEventListener:(k,fn,options)=>events[k]=()=>{if(options?.once)delete events[k];fn();}};
 const window={matchMedia:q=>({matches:q.includes('reduced')?reduced:compact}),setTimeout:(fn,ms)=>timers.push({fn,ms}),addEventListener:(k,fn)=>events[k]=fn,dispatchEvent:e=>events[e.type]?.(e)};
 skip.addEventListener=(k,fn)=>skip[k]=fn;
 vm.runInNewContext(code,{window,document,navigator:lowPower?{deviceMemory:2}:{hardwareConcurrency:8},location:{search:query},URLSearchParams,Event:class{constructor(type){this.type=type}}});
 return {window,document,timers,events,classes,skip,get removed(){return removed}};
}
let f=run();assert(f.window.PoolIntro.active);assert(f.classes.has('active'));f.timers.find(t=>t.ms===3600).fn();assert(f.classes.has('leaving'));f.timers.find(t=>t.ms===380).fn();assert(f.removed);assert(!f.window.PoolIntro.active);
f=run(false,true);assert(f.timers.some(t=>t.ms===2800));f.skip.click();f.timers.find(t=>t.ms===380).fn();assert(f.removed);
assert(run(true).removed);assert(run(false,false,'?test=loading').removed);
f=run();f.timers.find(t=>t.ms===5200).fn();assert(f.removed);
f=run();f.document.hidden=false;f.events.visibilitychange();assert(!f.removed,'visible event must not consume hidden-page guard');f.document.hidden=true;f.events.visibilitychange();assert(f.removed);
f=run(false,false,'',true);assert(f.classes.has('low-power'));assert(f.timers.some(t=>t.ms===1400));f.timers.find(t=>t.ms===1400).fn();f.timers.find(t=>t.ms===380).fn();assert(f.removed);
console.log(JSON.stringify({passed:true,originalLoader:true,mobile:true,skip:true,reducedMotion:true,loadingPreview:true,timeout:true,hiddenPage:true,visibleThenHidden:true,lowPower:true}));
