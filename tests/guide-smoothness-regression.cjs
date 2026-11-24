const assert=require('node:assert/strict');
const loadGame=require('./load-game.cjs');
const state=w=>JSON.parse(w.render_game_to_text());
const g=loadGame(),w=g.window,t=w.__poolTest;
const R=1.125*1.05*1.05;
const fixtures=[
  {name:'straight',balls:[{n:0,x:30,y:25},{n:1,x:52,y:25}],aim:0,power:70,spinX:0},
  {name:'cut-up',balls:[{n:0,x:30,y:25},{n:1,x:52,y:26}],aim:0,power:70,spinX:0},
  {name:'cut-down',balls:[{n:0,x:30,y:25},{n:1,x:52,y:24}],aim:0,power:70,spinX:0},
  {name:'cut-spinL',balls:[{n:0,x:30,y:25},{n:1,x:52,y:26}],aim:0,power:70,spinX:-.85},
  {name:'cut-spinR',balls:[{n:0,x:30,y:25},{n:1,x:52,y:26}],aim:0,power:70,spinX:.85},
];
for(const f of fixtures){
  t.setGuideBalls(f.balls,f.aim,f.power,0,f.spinX||0);
  const guide=t.getDisplayGuide();
  assert.equal(guide.targetNumber,1,f.name+': target number');
  const end=guide.shotPath.at(-1),obj=guide.objectCenter;
  assert(Math.abs(Math.hypot(end.x-obj.x,end.y-obj.y)-2*R)<1e-6,f.name+': ghost-ball contact');
  assert.equal(guide.cuePath.length>1&&guide.targetPath.length>1,true,f.name+': short paths');
  const cueLen=(()=>{let s=0;for(let i=1;i<guide.cuePath.length;i++)s+=Math.hypot(guide.cuePath[i].x-guide.cuePath[i-1].x,guide.cuePath[i].y-guide.cuePath[i-1].y);return s;})();
  const targetLen=(()=>{let s=0;for(let i=1;i<guide.targetPath.length;i++)s+=Math.hypot(guide.targetPath[i].x-guide.targetPath[i-1].x,guide.targetPath[i].y-guide.targetPath[i-1].y);return s;})();
  assert(Math.abs(cueLen-8)<.05,f.name+': cue path length '+cueLen);
  assert(Math.abs(targetLen-11)<.05,f.name+': target path length '+targetLen);
  t.fireTest();let actual=null;
  for(let i=0;i<5400;i++){w.advanceTime(1000/180);actual=t.getShotSummary().firstHit;if(actual!==null)break;}
  assert.equal(actual,guide.targetNumber,f.name+': first contact mismatch');
}
// A 0.001rad drag used to move the endpoint by up to 0.25in because the
// physics contact was quantized to a 1/180s step. The analytic contact must
// keep it continuous.
const cut=[{n:0,x:30,y:25},{n:1,x:52,y:26}];
let prev=null,maxJump=0;
for(let i=0;i<80;i++){
  t.setGuideBalls(cut,(i-40)*0.001,70,0,0);
  const guide=t.getDisplayGuide(),end=guide.targetNumber!==null?guide.shotPath.at(-1):null;
  if(prev&&end)maxJump=Math.max(maxJump,Math.hypot(end.x-prev.x,end.y-prev.y));
  prev=end;
}
assert(maxJump<.06,'guide endpoint jumps '+maxJump.toFixed(3)+'in per 0.001rad');
console.log(JSON.stringify({passed:true,fixtures:fixtures.length,maxEndpointJump:+maxJump.toFixed(4),analyticGhostContact:true,firstContact:true}));
