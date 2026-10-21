import {resultSky} from './result-sky.mjs';
import {kstDate,createContentSnapshot,restoreContentSnapshot} from './lib/dated-content.mjs';
const D=window.PREVIEW_DATA;
// Constellation centres (RA hours, Dec degrees); the result sky follows when the sign stands highest over Seoul that day.
const SIGN_COORDS={aries:[2.63,21],taurus:[4.70,15],gemini:[7.07,23],cancer:[8.65,20],leo:[10.67,13],virgo:[13.40,-4],libra:[15.20,-15],scorpio:[16.88,-27],sagittarius:[19.10,-29],capricorn:[21.05,-18],aquarius:[22.28,-11],pisces:[0.48,14]};
function transitTime(date,zodiacId){try{const A=window.Astronomy,[ra,dec]=SIGN_COORDS[zodiacId];A.DefineStar(A.Body.Star1,ra,dec,1000);return A.SearchHourAngle(A.Body.Star1,new A.Observer(37.57,126.98,0),0,new Date(Date.parse(date+'T00:00:00+09:00')),1).time.date;}catch{return null;}}
function hourLabel(time){return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'numeric',hour12:true}).format(new Date(Math.round(time.getTime()/3600000)*3600000));}
function encode(value){const bytes=new TextEncoder().encode(JSON.stringify(value));return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
function decode(value){if(value.length>14000||!/^[A-Za-z0-9_-]+$/.test(value))throw Error('결과 링크를 확인해 주세요.');return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0))));}
// Result links open behind a short waiting screen so the start screen never flashes first.
async function revealResult(){const loading=document.querySelector('.result-loading');if(!document.documentElement.classList.contains('result-pending'))return;await new Promise(r=>setTimeout(r,Math.max(0,1700-performance.now())));loading.classList.add('leaving');document.documentElement.classList.remove('result-pending');setTimeout(()=>loading.classList.remove('leaving'),700);}
async function restore(){if(!location.hash.startsWith('#result='))return;
try{
 const p=decode(location.hash.slice(8));
 const characterIndex=D.characters.findIndex(c=>c.name===p.characterName);
 if(p.v!=='night-result-v1'||characterIndex<0||!D.zodiac.some(z=>z.id===p.zodiacId)||!Number.isSafeInteger(p.completedAt))throw Error('결과 링크를 확인해 주세요.');
 const date=kstDate(p.completedAt);
 let content;
 if(p.content){content=restoreContentSnapshot(JSON.stringify(p.content));if(content.zodiacId!==p.zodiacId||content.completedAt!==p.completedAt)throw Error('결과 정보가 맞지 않아요.');}
 else{const response=await fetch('./data/horoscope-'+date.replaceAll('-','')+'/horoscope-copy.json');if(!response.ok)throw Error('오늘의 별자리 이야기를 준비하고 있어요. 잠시 후 다시 만나줘.');D.daily[date]=await response.json();content=createContentSnapshot({completedAt:p.completedAt,zodiacId:p.zodiacId,catalogByDate:D.daily});if(content.status!=='ready')throw Error(content.notice);}
 // Existing shared cards keep their saved sky; new cards use the sign's transit time over Seoul (completion time only if that fails).
 const transit=transitTime(date,p.zodiacId),skyTime=transit?transit.getTime():p.completedAt;
 const skyId=['dawn','day','sunset','night'].includes(p.skyId)?p.skyId:resultSky(skyTime);
 const backdropSkyId=['dawn','day','sunset','night'].includes(p.backdropSkyId)?p.backdropSkyId:resultSky(skyTime);
 document.body.dataset.resultSky=backdropSkyId;
 const frozen={...p,content,skyId,backdropSkyId};
 window.NIGHT_RESULT={...content,date,completedAt:p.completedAt,transitLabel:transit?hourLabel(transit):''};
 if(!D.daily[date])D.daily[date]={sourceDate:date,sourceUrl:content.sourceUrl,entries:[{id:p.zodiacId,message:content.message,hint:content.hint}]};
 const dates=document.querySelector('#content-date');if(!Array.from(dates.options).some(o=>o.value===date))dates.add(new Option(date,date));
 document.querySelector('#char').value=String(characterIndex);document.querySelector('#zodiac').value=p.zodiacId;document.querySelector('#sky').value=skyId;dates.value=date;
 history.replaceState(null,'',location.pathname+'#result='+encode(frozen));try{sessionStorage.setItem('huug-last-result','./'+location.hash);}catch{}
 window.NightExperience.showResult();
 document.querySelector('#char').dispatchEvent(new Event('change'));
 document.querySelector('.review-settings').hidden=true;
 const actions=document.querySelector('#result-explore');
 if(!document.querySelector('#night-share')){const button=document.createElement('button');button.id='night-share';button.textContent='결과 공유';button.onclick=async()=>{try{if(navigator.share)await navigator.share({title:'오늘, 어떤 행운이 너에게 닿을까?',url:location.href});else{await navigator.clipboard.writeText(location.href);button.textContent='링크 복사 완료';}}catch(e){if(e.name!=='AbortError')button.textContent='주소창 링크를 복사해 주세요';}};actions.prepend(button);}
}catch(error){window.NightExperience.showStart();document.querySelector('#ring-subtitle').textContent=error.message;}
revealResult();
}
window.addEventListener('hashchange',restore);restore();

