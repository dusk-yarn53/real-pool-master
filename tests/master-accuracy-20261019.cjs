const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8').replace('window.__poolTest={','window.__poolTest={executeAIPlan,');
(async()=>{
 const {window:w}=load({source}),t=w.__poolTest;w.setTimeout=fn=>setImmediate(fn);
 let seed=20261019;w.Math=Object.create(Math);w.Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const fixtures=[
 [{n:0,x:15,y:43},{n:1,x:70,y:7},{n:9,x:85,y:36}],
 [{n:0,x:50,y:35},{n:1,x:50,y:12},{n:9,x:80,y:36}],
 [{n:0,x:25,y:30},{n:1,x:50,y:18},{n:9,x:80,y:32}],
 [{n:0,x:25,y:25},{n:1,x:40,y:18},{n:9,x:75,y:32}],
 [{n:0,x:65,y:36},{n:1,x:55,y:15},{n:9,x:20,y:30}]
 ];
 let pots=0,total=0;const rows=[];
 for(const balls of fixtures){
  const out=await t.planAI(balls),plan=out.plan.nominalPlan;assert(plan);let count=0;
  for(let i=0;i<100;i++){const shot=t.executeAIPlan(plan);if(shot.expectedPot)count++;}
  pots+=count;total+=100;rows.push({pots:count,type:plan.type,power:plan.power,spin:[plan.spinX||0,plan.spinY||0]});
  console.log(JSON.stringify(rows.at(-1)));
 }
 console.log(JSON.stringify({pots,total,rate:pots/total,rows}));
 assert(pots/total>=.92&&pots/total<=.98,'fixture aggregate outside 95% +/- 3%; not a full match guarantee');
})().catch(e=>{console.error(e);process.exitCode=1;});
