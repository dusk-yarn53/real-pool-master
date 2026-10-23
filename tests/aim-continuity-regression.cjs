const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const file=process.argv[2]||require('node:path').join(__dirname,'../game.js');
const source='window.__guideTimers=[];window.__guideSteps=0;'+fs.readFileSync(file,'utf8')
 .replace('setTimeout(runGuideSlice,0)','window.__guideTimers.push(runGuideSlice)')
 .replace('function physicsStep(balls,dt,animate=false){','function physicsStep(balls,dt,animate=false){window.__guideSteps++;')
 .replace('window.__poolTest={','window.__poolTest={interactiveGuide:()=>displayGuide(true),');
let dragFrames=0,shortLines=0;
for(const rotated of [false,true])for(const control of ['cloth','ruler']){
 const frames=[],g=load({source,mobile:true,animationFrame:fn=>frames.push(fn)}),w=g.window,t=w.__poolTest;
 if(rotated)g.ids.get('mobile-pool-preview').classList.add('is-landscape');
 const flush=()=>{for(const fn of frames.splice(0))fn(performance.now());};
 const drain=()=>{let n=0;while(w.__guideTimers.length){w.__guideTimers.shift()();assert(++n<3000);}};
 t.setGuideBalls([{n:0,x:30,y:25},{n:1,x:55,y:26.2},{n:9,x:85,y:40}],0,70,.6,.3);drain();flush();
 const original=w.render_game_to_text();const el=control==='cloth'?g.canvas:g.ids.get('angleRuler');
 const event=(x,y)=>({pointerId:1,clientX:rotated?-y:x,clientY:rotated?x:y,preventDefault(){}});
 el.handlers.pointerdown(event(400,300));
 for(let i=1;i<=48;i++){
  el.handlers.pointermove(event(400+i*.8,300));flush();const p=t.interactiveGuide();
  assert(p&&p.shotPath.length>=2,'main guide vanished during input');
  if(p.targetNumber===1){assert(p.targetPath.length>=2,'object-ball guide disappears while dragging');shortLines++;}
  const before=w.__guideSteps;drain();assert.equal(w.__guideSteps,before,'obsolete full-table jobs consumed input time');dragFrames++;
 }
 const after=JSON.parse(w.render_game_to_text());assert.deepEqual(after.balls,JSON.parse(original).balls,'preview changed real balls');
 el.handlers.pointerup(event(438.4,300));flush();drain();assert(!t.interactiveGuide().pending,'precise prediction did not resume after release');
}
// Sweep the immediate main ray through the full circle at several strengths.
const sweep=load({source,mobile:true}),st=sweep.window.__poolTest;
let directionSamples=0;
for(const power of [5,35,70,100])for(let degree=-180;degree<180;degree+=5){
 st.setGuideBalls([{n:0,x:50,y:25}],degree*Math.PI/180,power);
 const guide=st.interactiveGuide(),first=guide.shotPath[0],last=guide.shotPath.at(-1);
 assert(guide.shotPath.length>=2&&Math.hypot(last.x-first.x,last.y-first.y)>.01,'empty main guide');
 assert(guide.shotPath.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)),'invalid guide point');directionSamples++;
}
console.log(JSON.stringify({passed:true,dragFrames,shortLines,directionSamples,rotatedAndRuler:true,idlePhysicsResumed:true}));
