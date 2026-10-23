// Deterministic comparison of full-table work during actual pointer gestures.
const fs=require('node:fs'),load=require('./load-game.cjs');
let source='window.__guideTimers=[];window.__guideSteps=0;window.__fullUI=0;'+fs.readFileSync(process.argv[2]||require('node:path').join(__dirname,'../game.js'),'utf8')
 .replace('setTimeout(runGuideSlice,0)','window.__guideTimers.push(runGuideSlice)')
 .replace('function physicsStep(balls,dt,animate=false){','function physicsStep(balls,dt,animate=false){window.__guideSteps++;')
 .replace('function updateUI() {','function updateUI() {window.__fullUI++;');
const frames=[],g=load({source,mobile:true,animationFrame:f=>frames.push(f)}),w=g.window,t=w.__poolTest;
const flush=()=>{for(const f of frames.splice(0))f(performance.now());};
const drain=()=>{let n=0;while(w.__guideTimers.length){w.__guideTimers.shift()();if(++n>5000)throw Error('timer loop');}};
t.setGuideBalls([{n:0,x:30,y:25},{n:1,x:55,y:26.2},{n:9,x:85,y:40}],0,70,.6,.3);drain();flush();
const event=x=>({pointerId:1,clientX:x,clientY:300,preventDefault(){}});g.canvas.handlers.pointerdown(event(400));
const steps=w.__guideSteps,ui=w.__fullUI,start=performance.now();
for(let i=0;i<48;i++){g.canvas.handlers.pointermove(event(404+i*.8));flush();drain();}
console.log(JSON.stringify({dragFrames:48,worldPhysicsSteps:w.__guideSteps-steps,fullUIUpdates:w.__fullUI-ui,cpuMs:Number((performance.now()-start).toFixed(2)),note:'mock canvas CPU cost, not phone FPS'}));
