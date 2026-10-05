export const HISTORY_BOATS=['You','Skilled','Weekend Warrior','Rookie'];
const KEY='regatta-finish-history-v1';
export function createRaceHistory(storage){
 let persistent=Boolean(storage);let counts=Object.fromEntries(HISTORY_BOATS.map(name=>[name,[0,0,0,0]]));
 try{const saved=JSON.parse(storage?.getItem(KEY)||'null');if(saved&&HISTORY_BOATS.every(name=>Array.isArray(saved[name])&&saved[name].length===4&&saved[name].every(n=>Number.isSafeInteger(n)&&n>=0)))counts=saved}catch{persistent=false}
 const save=()=>{try{storage?.setItem(KEY,JSON.stringify(counts))}catch{persistent=false}};
 return {get persistent(){return persistent},get counts(){return counts},get races(){return counts.You.reduce((sum,n)=>sum+n,0)},record(boats){if(boats.length!==4||new Set(boats.map(b=>b.name)).size!==4||new Set(boats.map(b=>b.place)).size!==4||boats.some(b=>!HISTORY_BOATS.includes(b.name)||!Number.isInteger(b.place)||b.place<1||b.place>4))return false;for(const boat of boats)counts[boat.name][boat.place-1]++;save();return true},reset(){counts=Object.fromEntries(HISTORY_BOATS.map(name=>[name,[0,0,0,0]]));save()}};
}
