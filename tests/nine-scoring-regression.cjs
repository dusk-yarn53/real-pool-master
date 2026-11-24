const assert=require('node:assert/strict');
const loadGame=require('./load-game.cjs');
const state=w=>JSON.parse(w.render_game_to_text());

// Award matrix: 大金 10 / 小金 7 / 黄金九 7 / 普胜 4.
const g=loadGame(),w=g.window,a=w.__poolTest.nineAward;
const check=(info,winner,cleared,turnChanges,name,points)=>{const got=JSON.parse(JSON.stringify(a(info,winner,cleared,turnChanges)));assert.deepEqual(got,{key:{'大金':'big','小金':'small','黄金九':'golden','普胜':'normal'}[name],name,points});};
check({nine:true,potted:true,foul:false,player:0},0,false,0,'黄金九',7);
check({nine:false,potted:true,foul:false,player:0},0,true,0,'大金',10);
check({nine:false,potted:true,foul:false,player:0},0,true,1,'普胜',4);
check({nine:false,potted:true,foul:false,player:0},1,true,0,'普胜',4);
check({nine:false,potted:false,foul:false,player:0},1,true,2,'小金',7);
check({nine:false,potted:false,foul:false,player:0},0,false,0,'普胜',4);
check({nine:false,potted:true,foul:false,player:0},0,false,0,'黄金九',7);
check({nine:false,potted:true,foul:false,player:0},0,false,1,'普胜',4);
check({nine:false,potted:true,foul:true,player:0},0,true,0,'普胜',4);
check({nine:false,potted:false,foul:true,player:0},0,true,0,'普胜',4);

// Integration: dry break + 9 as the last ball => 小金 7, points survive rematch, home resets.
const game=loadGame(),c={id:id=>game.ids.get(id).handlers.click(),data:(k,v)=>game.elements.find(e=>e.dataset[k]===v).handlers.click()};
c.id('startBtn');c.data('flowMode','local');c.data('flowRules','nine');
game.window.__poolTest.setNineFinal();game.window.__poolTest.fireTest();game.window.advanceTime(15000);
let s=state(game.window);assert.equal(s.phase,'gameover');assert.deepEqual(s.points,[7,0]);assert.equal(s.lastRack.name,'小金');assert.equal(s.lastRack.points,7);
assert.equal(game.ids.get('resultWins0').textContent,7);assert.equal(game.ids.get('score0').textContent,7);assert(game.ids.get('score0').classList.contains('is-points'));
assert(game.ids.get('resultReason').textContent.includes('小金 +7 分'));
assert(game.ids.get('resultScoreLabel').textContent.includes('九球追分'));

// Finish() wiring for 大金 / 黄金九 / 普胜; the fixture puts 9 on the lip.
for(const c of [
  {info:{potted:true,nine:false,foul:false,player:0},cleared:true,turnChanges:0,name:'大金',points:10},
  {info:{potted:true,nine:false,foul:false,player:0},cleared:true,turnChanges:1,name:'普胜',points:4},
]){
  game.window.__poolTest.setNineAwardFixture(c);game.window.__poolTest.fireTest();game.window.advanceTime(15000);
  const s=state(game.window);assert.equal(s.phase,'gameover');assert.equal(s.lastRack.name,c.name);assert.equal(s.lastRack.points,c.points);assert.equal(s.points[0],c.points);
}

// Re-run the 小金 fixture for the rematch/home assertions.
game.window.__poolTest.setNineAwardFixture({info:{potted:true,nine:false,foul:false,player:0},cleared:true,turnChanges:0});game.window.__poolTest.fireTest();game.window.advanceTime(15000);
c.id('resultReplay');s=state(game.window);assert.equal(s.phase,'aim');assert.deepEqual(s.points,[10,0]);
c.id('resultHome');s=state(game.window);assert.deepEqual(s.points,[0,0]);
console.log(JSON.stringify({passed:true,awardCases:10,smallGold:7,rematchKeepsPoints:true,homeResets:true}));
