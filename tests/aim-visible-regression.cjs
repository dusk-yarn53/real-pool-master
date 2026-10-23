const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source='window.__guideTimers=[];'+fs.readFileSync(process.argv[2]||require('node:path').join(__dirname,'../game.js'),'utf8')
 .replace('setTimeout(runGuideSlice,0)','window.__guideTimers.push(runGuideSlice)')
 .replace('    drawAim();for(', '    if(!window.__hideAim)drawAim();for(')
 .replace('window.__poolTest={',`window.__poolTest={interactiveGuide:()=>displayGuide(true),withoutAim(){window.__hideAim=true;render();window.__hideAim=false;},`);
const frames=[],g=load({source,raster:true,mobile:true,dpr:1,animationFrame:fn=>frames.push(fn)}),t=g.window.__poolTest,w=g.window;
const flush=()=>{for(const f of frames.splice(0))f(performance.now());};
t.setGuideBalls([{n:0,x:30,y:25},{n:1,x:55,y:26.2},{n:9,x:85,y:40}],0,70,.6,.3);
while(w.__guideTimers.length)w.__guideTimers.shift()();flush();
const event=x=>({pointerId:1,clientX:x,clientY:300,preventDefault(){}});g.canvas.handlers.pointerdown(event(400));
let painted=0;
for(let frame=1;frame<=12;frame++){
 g.canvas.handlers.pointermove(event(400+frame*4));flush();const p=t.interactiveGuide(),ctx=g.canvas.getContext('2d'),ratio=t.getRenderInfo().ratio;
 const points=[p.shotPath,p.targetPath,p.cuePath].filter(path=>path.length>=2).map(path=>{const lengths=path.slice(1).map((p,i)=>Math.hypot(p.x-path[i].x,p.y-path[i].y));let remaining=lengths.reduce((a,b)=>a+b,0)*.65;for(let i=0;i<lengths.length;i++){if(remaining<=lengths[i]){const f=remaining/lengths[i];return {x:path[i].x+(path[i+1].x-path[i].x)*f,y:path[i].y+(path[i+1].y-path[i].y)*f};}remaining-=lengths[i];}return path.at(-1);});
 assert(points.length===3,'three preview lines required in this cut-ball fixture');
 const samples=points.map(q=>{const x=Math.round((60+q.x*12.8)*ratio),y=Math.round((75+q.y*12.8)*ratio);return {x,y,before:ctx.getImageData(x-2,y-2,5,5).data};});
 t.withoutAim();
 for(const q of samples){const after=ctx.getImageData(q.x-2,q.y-2,5,5).data;let delta=0;for(let i=0;i<after.length;i+=4)for(let k=0;k<3;k++)delta=Math.max(delta,Math.abs(q.before[i+k]-after[i+k]));assert(delta>15,'guide exists in data but is absent from rendered pixels');painted++;}
}
console.log(JSON.stringify({passed:true,dragFrames:12,visibleLineSamples:painted,actualCanvasPixels:true}));
