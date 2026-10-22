const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8').replace('window.__poolTest={',`window.__poolTest={
 adaptResolution,resizeRenderBuffer,
 contactFixture(){const balls=[ball(0,R+2*R-.25,25),ball(1,R,25)];balls[0].vx=-60;balls[0].rollVx=-60;physicsStep(balls,STEP);return balls;},`);
const g=load({source,mobile:true,dpr:3}),t=g.window.__poolTest,R=1.125*1.05*1.05;
assert(t.contactFixture().every(b=>b.x>=R-1e-8),'contact separation pushed a ball inside cushion');
t.resizeRenderBuffer();const initial=t.getRenderInfo().ratio;
for(let i=0;i<400;i++)t.adaptResolution(20,8.333,i*20);
const low=t.getRenderInfo();assert(low.ratio<initial&&low.resolutionScale>=.65);assert.equal(low.physicsHz,180);
for(let i=400;i<1800;i++)t.adaptResolution(1,8.333,i*20);
assert.equal(t.getRenderInfo().resolutionScale,1,'quality failed to recover');
const run=count=>{const h=load({source}),u=h.window.__poolTest;u.setGuideBalls([{n:0,x:40,y:25},{n:1,x:70,y:25}]);const ev=x=>({pointerId:1,pointerType:'touch',clientX:x,clientY:300});h.canvas.handlers.pointerdown(ev(400));for(let i=1;i<=count;i++)h.canvas.handlers.pointermove(ev(400+240*i/count));h.canvas.handlers.pointerup(ev(640));return JSON.parse(h.window.render_game_to_text()).aimDegrees;};
assert.equal(run(1),run(24));assert(run(1)>6,'long swipe still too slow');
console.log(JSON.stringify({passed:true,cushionContact:true,resolutionDown:low.ratio,resolutionRestored:t.getRenderInfo().ratio,physicsHz:180,longSwipeDegrees:run(1)}));
