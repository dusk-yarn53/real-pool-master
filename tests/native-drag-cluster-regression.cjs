const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8')
 .replace('const options=masterAttackOptions(targets,kind),success=[],near=[];','window.__searchedBanks=kind;const options=masterAttackOptions(targets,kind),success=[],near=[];')
 .replace('requestAnimationFrame(now=>{','window.__aimRequests=(window.__aimRequests||0)+1;requestAnimationFrame(now=>{')
 .replace('window.__poolTest={','window.__extra={clusterBreakValue,closePosition,quickGuide};window.__poolTest={');
let framesPainted=0;
for(const hz of [60,90,120]){
 const frames=[],g=load({source,mobile:true,animationFrame:f=>frames.push(f)}),w=g.window;
 w.__poolTest.setGuideBalls([{n:0,x:30,y:25},{n:1,x:55,y:26.2}],0,70);
 for(const f of frames.splice(0))f(0);
 const e=x=>({pointerId:1,clientX:x,clientY:300,pointerType:'touch',preventDefault(){}});
 g.canvas.handlers.pointerdown(e(400));g.canvas.handlers.pointermove(e(410));
 const size=w.__poolTest.getRenderInfo().width;
 for(let i=0;i<hz;i++){
  const pending=frames.splice(0),before=w.__aimRequests;
  for(const f of pending)f(i*1000/hz);
  assert.equal(w.__aimRequests,before+1,'one aim paint per display callback, including sparse input');framesPainted++;
  assert.equal(w.__poolTest.getRenderInfo().width,size,'canvas must not resize mid-drag');
  assert.strictEqual(w.__extra.quickGuide(),w.__extra.quickGuide(),'unchanged geometry should reuse the guide');
 }
 for(const x of [450,500,550,600,500,400]){
  g.canvas.handlers.pointermove(e(x));for(const f of frames.splice(0))f(2000);
  assert(Math.abs(parseFloat(g.ids.get('angleReadout').textContent)-(x-400)*.025)<.0001,'linear reversible input across old acceleration threshold');
 }
 g.canvas.handlers.pointerup(e(400));
 const before=w.__aimRequests;
 for(let i=0;i<2;i++)for(const f of frames.splice(0))f(2100+i*17);
 assert.equal(w.__aimRequests,before,'release stops active drag loop');
}
(async()=>{
 const {window:w}=load({source});w.setTimeout=f=>setImmediate(f);w.Math=Object.create(Math);w.Math.random=()=>.25;
 const out=await w.__poolTest.planAI([{n:0,x:50,y:35},{n:1,x:50,y:12},{n:2,x:70,y:32},{n:3,x:72.7,y:32},{n:9,x:85,y:40}],'nine');
 assert.equal(w.__searchedBanks,'bank','direct pots must still compete with bank attacks');
 assert(out.result.safe&&out.result.potted,'K-ball trial must pot legally');
 assert(w.__extra.clusterBreakValue(out.result)>0,'actual physics must spread the surviving pair and open a pocket lane');
 assert(w.__extra.closePosition(out.result).close,'K-ball must leave a clear close next shot');
 const blocked={...out.result,safe:false};assert.equal(w.__extra.clusterBreakValue(blocked),0);
 console.log(JSON.stringify({passed:true,nativeRefreshCallbacks:framesPainted,actualClusterOpened:w.__extra.clusterBreakValue(out.result),nearDistance:w.__extra.closePosition(out.result).distance,planningMs:out.ms}));
})().catch(e=>{console.error(e);process.exitCode=1;});
