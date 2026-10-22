const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
let source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8');
source='window.__guideTimers=[];window.__guideSteps=0;'+source.replace('setTimeout(runGuideSlice,0)','window.__guideTimers.push(runGuideSlice)').replace('function physicsStep(balls,dt,animate=false){','function physicsStep(balls,dt,animate=false){window.__guideSteps++;').replace('window.__poolTest={',`window.__poolTest={interactiveGuide:()=>displayGuide(true),context:()=>physicsContext,`);
const frames=[],{window:w,canvas}=load({source,animationFrame:fn=>frames.push(fn)}),t=w.__poolTest;
const balls=[{n:0,x:30,y:25},{n:1,x:55,y:25},{n:9,x:85,y:35}];
t.setGuideBalls(balls,0,70,-.85);const initial=w.render_game_to_text();
const steps=w.__guideSteps,pending=t.interactiveGuide();assert(pending.pending);assert.equal(w.__guideSteps,steps,'paint must not synchronously simulate the table');
let slices=0;while(w.__guideTimers.length){w.__guideTimers.shift()();assert.equal(t.context(),null,'yield leaked physics context');assert(++slices<2000);}
const asyncResult=t.interactiveGuide();assert(!asyncResult.pending);assert.equal(initial,w.render_game_to_text(),'prediction changed live balls');
const {window:reference}=load();reference.__poolTest.setGuideBalls(balls,0,70,-.85);
assert.equal(JSON.stringify(asyncResult),JSON.stringify(reference.__poolTest.getDisplayGuide()),'chunked prediction differs from full solver');
// 80 input events before a refresh should schedule only one aim callback.
const event=x=>({pointerId:1,clientX:x,clientY:300,preventDefault(){}});
for(const fn of frames.splice(0))fn(performance.now());
canvas.handlers.pointerdown(event(200));const before=frames.length;
for(let x=201;x<=280;x++)canvas.handlers.pointermove(event(x));assert.equal(frames.length,before+1);
// A newer direction must replace, rather than inherit, the old job.
t.setGuideBalls(balls,Math.PI/2,70);let latest=t.interactiveGuide();assert(latest.pending);
t.setGuideBalls(balls,Math.PI,70);latest=t.interactiveGuide();assert(latest.shotPath.at(-1).x<30);
while(w.__guideTimers.length)w.__guideTimers.shift()();latest=t.interactiveGuide();assert(!latest.pending);assert(latest.shotPath.at(-1).x<30);
// Weak strokes cannot show a reachable distant target even in the fast preview.
t.setGuideBalls(balls,0,5);assert.equal(t.interactiveGuide().targetNumber,null);
console.log(JSON.stringify({passed:true,slices,coalescedEvents:80,exactPrediction:true,staleJobsDiscarded:true}));
