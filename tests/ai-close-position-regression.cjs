const assert=require('node:assert/strict');
const fs=require('node:fs');
const load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8');
// Expose evaluation only in this VM; production has no extra control surface.
const {window:w}=load({source:source.replace('window.__poolTest={','window.__positionTest={aiPositionScore,masterStrokeCost,ball,state};window.__poolTest={')});
const t=w.__positionTest;t.state.mode='nine';t.state.turn=1;t.state.groups=[null,null];t.state.aiDifficulty='hard';
const layout=(x,y,extra=[])=>({winning:false,pocketed:[],balls:[t.ball(0,x,y),t.ball(2,50,12),t.ball(9,85,35),...extra.map(b=>t.ball(b.n,b.x,b.y))]});
const near=layout(50,25),far=layout(50,44),crowded=layout(50,15),hidden=layout(50,25,[{n:3,x:50,y:20}]);
assert(t.aiPositionScore(near)<t.aiPositionScore(far),'near straight leave must beat long straight leave');
assert(t.aiPositionScore(near)<t.aiPositionScore(crowded),'do not crowd the next ball');
assert(t.aiPositionScore(near)<t.aiPositionScore(hidden),'near blocked ball is not a good leave');
assert(t.masterStrokeCost({power:20,spinX:0,spinY:0},near)<=t.masterStrokeCost({power:55,spinX:0,spinY:0},near),'do not force extra power for identical position');
(async()=>{
  w.setTimeout=fn=>setImmediate(fn);w.Math=Object.create(Math);w.Math.random=()=>.5;
  const setups=[
    [{n:0,x:50,y:35},{n:1,x:50,y:12},{n:9,x:80,y:36}],
    [{n:0,x:25,y:30},{n:1,x:50,y:18},{n:9,x:80,y:32}],
    [{n:0,x:50,y:35},{n:1,x:50,y:12},{n:9,x:60,y:25}],
    [{n:0,x:25,y:30},{n:1,x:50,y:18},{n:9,x:65,y:25}]
  ];
  const results=[];
  for(const entries of setups){
    const out=await w.__poolTest.planAI(entries,'nine');
    assert(out.result.safe&&out.result.potted,'position must retain a real legal pot');
    assert(out.plan.positionPlanned&&out.plan.robustness>=.75,'leave needs a stable attack');
    const c=out.result.balls.find(b=>b.n===0),next=out.result.balls.find(b=>b.n===9);
    const distance=Math.hypot(c.x-next.x,c.y-next.y);
    // All four reachable fixtures must now leave a close next shot.
    assert(distance<=22,'avoidable far-table leave: '+distance);
    results.push({distance,power:out.plan.power,spinY:out.plan.spinY,robustness:out.plan.robustness});
  }
  console.log(JSON.stringify({passed:true,near:t.aiPositionScore(near),far:t.aiPositionScore(far),results}));
})().catch(e=>{console.error(e);process.exitCode=1;});
