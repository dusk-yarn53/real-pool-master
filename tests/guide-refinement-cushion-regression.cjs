const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8').replace('window.__poolTest={','window.__extra={quickGuide,visualGuide,ball};window.__poolTest={');
const {window:w}=load({source}),t=w.__poolTest,e=w.__extra;
// Cushion response is continuous on both sides of the removed spin threshold.
for(const threshold of [-.5,0,.5]){
 const b={...e.ball(0,50,25),vx:35,vy:-50,spin:threshold-1e-6},a=t.railTest(b,0,1),c=t.railTest({...b,spin:threshold+1e-6},0,1);
 assert(Math.hypot(a.vx-c.vx,a.vy-c.vy)<1e-4);assert(Math.abs(a.spin-c.spin)<1e-4);
 const energy=b=>b.vx*b.vx+b.vy*b.vy+.4*b.spin*b.spin;
 assert(energy(a)<=energy(b));
}
// Long approach dissipates weak draw: immediate and exact paths must agree on direction.
t.setGuideBalls([{n:0,x:20,y:25},{n:1,x:65,y:25}],0,40,-.45);
const fast=e.quickGuide(),exact=t.getDisplayGuide();
assert.equal(fast.targetNumber,exact.targetNumber);
assert(fast.cuePath.at(-1).x>fast.cuePath[0].x);assert(exact.cuePath.at(-1).x>exact.cuePath[0].x);
// Controlled-clock render transition: visible at start, smooth midway, exact after100ms.
let clock=0;w.performance={now:()=>clock};
const base={pending:true,targetNumber:1,shotPath:[{x:20,y:25},{x:60,y:25}],cuePath:[{x:60,y:25},{x:65,y:26}],targetPath:[{x:65,y:25},{x:70,y:25}]};
e.visualGuide(base);const precise={...base,pending:false,cuePath:[{x:60,y:25},{x:64,y:27}]};
const start=e.visualGuide(precise);assert.equal(start.cuePath.at(-1).x,65);
clock=50;const middle=e.visualGuide(precise);assert.equal(middle.cuePath.at(-1).x,64.5);
clock=101;const end=e.visualGuide(precise);assert.equal(end,precise);
console.log(JSON.stringify({passed:true,cushionContinuous:true,frictionEvolvedPreview:true,smoothRefinement:true}));
