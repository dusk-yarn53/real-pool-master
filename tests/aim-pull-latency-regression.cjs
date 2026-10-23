const assert=require('node:assert/strict'),fs=require('node:fs'),load=require('./load-game.cjs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../game.js'),'utf8')
 .replace('function physicsStep(balls,dt,animate=false){','function physicsStep(balls,dt,animate=false){window.__steps=(window.__steps||0)+1;')
 .replace('window.__poolTest={','window.__poolTest={changeMode:mode=>state.mode=mode,');
let cases=0;
for(const rotated of [false,true]){
 const g=load({source,mobile:true}),t=g.window.__poolTest,m=g.ids.get('cueMeter');
 if(rotated)g.ids.get('mobile-pool-preview').classList.add('is-landscape');
 t.setGuideBalls([{n:0,x:30,y:25},{n:1,x:55,y:25}],0,70,-.85);
 const before=g.window.__steps||0;
 m.handlers.pointerdown({pointerId:1,clientX:0,clientY:0,preventDefault(){}});
 assert.equal(g.window.__steps||0,before,'pointerdown ran full physics prediction');
 const frozen=JSON.stringify(t.getDisplayGuide());
 m.handlers.pointermove({pointerId:1,clientX:rotated?-150:0,clientY:rotated?0:150,preventDefault(){}});
 assert.equal(JSON.stringify(t.getDisplayGuide()),frozen,'pending guide changed during pull');
 m.handlers.pointercancel();
 t.getDisplayGuide();const steps=g.window.__steps;t.changeMode('eight');t.getDisplayGuide();
 assert(g.window.__steps>steps,'rule change reused stale prediction');
 assert.doesNotThrow(()=>t.setGuideBalls([{n:1,x:55,y:25}]),'missing cue crashed rendering');
 cases++;
}
console.log(JSON.stringify({passed:true,orientations:cases,pointerdownPhysicsSteps:0,pendingGuideFrozen:true,modeInvalidation:true,missingCueSafe:true}));
