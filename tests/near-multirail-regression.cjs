const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8').replace('window.__poolTest={','window.__near={closePosition,aiPositionScore,ball,state};window.__poolTest={');
const {window:w}=load({source}),t=w.__near;t.state.mode='nine';t.state.turn=1;t.state.groups=[null,null];
const layout=(x,y,extras=[])=>({winning:false,pocketed:[],balls:[t.ball(0,x,y),t.ball(2,50,12),t.ball(9,85,35),...extras.map(b=>t.ball(b.n,b.x,b.y))]});
const near=layout(50,25),far=layout(50,44),crowded=layout(50,15),blocked=layout(50,25,[{n:3,x:50,y:20}]);
assert(t.closePosition(near).close);
assert(!t.closePosition(far).close);
assert(!t.closePosition(crowded).close,'crowding is not playable near position');
assert(!t.closePosition(blocked).close,'blocked next ball cannot qualify');
assert(t.aiPositionScore(near)<t.aiPositionScore(far),'good near leave should score better than a long leave');
assert(t.aiPositionScore(near)<t.aiPositionScore(blocked),'blocked near leave should not score as playable');
(async()=>{
 w.setTimeout=fn=>setImmediate(fn);w.Math=Object.create(Math);w.Math.random=()=>.5;
 const out=await w.__poolTest.planAI([{n:0,x:50,y:35},{n:1,x:50,y:12},{n:9,x:80,y:36}],'nine');
 assert(out.result.safe&&out.result.potted,'master must complete a legal pot');
 assert(out.plan.positionPlanned&&out.plan.robustness>=.75,'master must retain a stable next shot');
 const pos=t.closePosition(out.result);
 console.log(JSON.stringify({passed:true,actualNearDistance:pos.distance,actualCueRails:out.result.cushionHits.filter(h=>h.n===0&&!h.beforeFirstHit&&!h.jaw).length,power:out.plan.power,spinY:out.plan.spinY,planningMs:out.ms}));
})().catch(e=>{console.error(e);process.exitCode=1;});
