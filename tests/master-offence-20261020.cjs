const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8').replace('window.__poolTest={',`window.__poolTest={
 searchBanks:()=>searchMasterAttacks(aiTargets(),()=>true,"bank"),
 drawProbe(power,sy){const balls=[ball(0,40,25),ball(1,55,25)],events={firstHit:null,pocketed:[],railAfterHit:false,breakRails:new Set()};applyCueImpulse(balls[0],power,0,0,sy);let min=0,x=0;physicsContext=events;try{for(let i=0;i<350;i++){physicsStep(balls,STEP);if(events.firstHit!==null){min=Math.min(min,balls[0].vx);x=balls[0].x;}}}finally{physicsContext=null;}return {min,x};},
`);
(async()=>{
 const {window:w}=load({source}),t=w.__poolTest;w.setTimeout=fn=>setImmediate(fn);w.Math=Object.create(Math);w.Math.random=()=>.5;
 const touch=t.drawProbe(70,-.45),draw=t.drawProbe(70,-.85);
 assert(touch.min>-2&&draw.min<-12&&draw.x<touch.x-15,'draw and stun must have physically different outcomes');
 assert(t.strokeName({spinY:-.45,power:70}).includes('轻搓'));
 assert(t.strokeName({spinY:-.85,power:70}).includes('拉回'));
 assert(t.strokeName({spinY:-.85,power:25}).includes('轻搓'));
 const combinations=[];
 for(const n of [3,9]){
  const out=await t.planAI([{n:0,x:50,y:38},{n:1,x:50,y:25},{n,x:50,y:10},...(n===9?[]:[{n:9,x:85,y:35}])],'nine',null,false,'hard','combination');
  assert(out.plan&&out.plan.type==='combination');assert.equal(out.plan.target,1);assert.equal(out.plan.potTarget,n);
  assert(out.result.safe&&out.result.potted);assert.equal(out.result.firstHit,1);assert(out.result.pocketed.some(b=>b.n===n));
  assert.equal(out.result.winning,n===9);combinations.push(n);
  const illegal=t.simulateShot({...out.plan,aim:0});assert(!illegal.safe,'missing the lowest ball must remain illegal');
 }
 // A real bank into the upper middle bag: target must hit cushion first.
 t.setGuideBalls([{n:0,x:20,y:10},{n:1,x:30,y:25},{n:9,x:85,y:35}]);
 const banks=await t.searchBanks(),middle=banks.find(p=>p.pocket===1);
 assert(middle,'middle bank was starved by other pocket routes');
 const bankResult=t.simulateShot(middle);assert(bankResult.safe&&bankResult.potted);
 assert(bankResult.cushionHits.some(h=>h.n===1&&!h.jaw));
 // Fully blocked direct contact: hard must escape legally, never pick hiding.
 const out=await t.planAI([{n:0,x:15,y:25},{n:1,x:80,y:25},{n:2,x:45,y:25},{n:9,x:85,y:40}],'nine');
 assert(out.plan&&!['safety','snooker'].includes(out.plan.type));assert(out.result.legal&&!out.result.scratch);
 console.log(JSON.stringify({passed:true,draw,touch,combinations,middleBank:true,fallback:out.plan.type}));
})().catch(e=>{console.error(e);process.exitCode=1;});
