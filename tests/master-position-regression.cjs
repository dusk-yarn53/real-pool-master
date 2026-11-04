const assert=require('node:assert/strict');
const {window:w}=require('./load-game.cjs')();
const t=w.__poolTest,stroke={power:40,spinX:0,spinY:0};
t.setGuideBalls([{n:0,x:50,y:36},{n:1,x:50,y:12},{n:9,x:85,y:35}]);
function score(x,y,obstacles=[]){return t.masterStrokeCost(stroke,{safe:true,potted:false,winning:false,pocketed:[],balls:[{n:0,x,y},{n:1,x:50,y:12},...obstacles]});}
const straight=score(50,36),thin=score(35,18),blocked=score(50,36,[{n:2,x:50,y:25},{n:3,x:47,y:25},{n:4,x:53,y:25}]),frozen=score(50,49);
assert(straight<thin,'near thin cut outranked a comfortable straight continuation');
assert(straight<blocked,'blocked next ball outranked an open continuation');
assert(straight<frozen,'frozen rail leave outranked the open table');
const win=t.masterStrokeCost(stroke,{winning:true,safe:true,potted:true,balls:[{n:0,x:50,y:25}],pocketed:[{n:9}]});
assert(win<straight,'winning shot penalized for having no continuation');
console.log(JSON.stringify({passed:true,straight,thin,blocked,frozen,win}));
