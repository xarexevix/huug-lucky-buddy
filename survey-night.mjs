const cleanQuestion=text=>text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').trim();
// A deterministic, non-tiling sky: independent positions prevent visible rows.
const sky=document.querySelector('.starfield');
let skySeed=71837;
const skyRandom=()=>{skySeed=(Math.imul(1664525,skySeed)+1013904223)>>>0;return skySeed/4294967296;};
for(let i=0;i<105;i++){
 const star=document.createElement('i');
 star.className='sky-star'+(i%19===0?' glint':'');
 const x=skyRandom()*100,y=skyRandom()*100;
 star.style.left=x+'%';star.style.top=y+'%';
 star.style.setProperty('--size',(.65+skyRandom()*1.2)+'px');
 // Keep the reading column quieter without creating a hard rectangular cutout.
 const quiet=.45+.55*Math.min(1,Math.abs(x-50)/35);
 star.style.setProperty('--alpha',(.12+skyRandom()*.48)*quiet);
 star.style.setProperty('--duration',(4+skyRandom()*5)+'s');
 star.style.setProperty('--delay',(-skyRandom()*9)+'s');
 sky.append(star);
}
// Sky layers for the sunrise; p runs 0 (first question) to 1 (birthday step).
for(const cls of ['sky-predawn','sky-dawn','sky-morning','sky-horizon','sunrise'])document.body.prepend(Object.assign(document.createElement('div'),{className:(cls==='sunrise'?'':'sky-layer ')+cls,ariaHidden:'true'}));
const clamp01=v=>Math.max(0,Math.min(1,v));
function setSky(p){const st=document.body.style;st.setProperty('--predawn',clamp01((p-.05)/.35));st.setProperty('--dawnlight',clamp01((p-.4)/.45));st.setProperty('--horizon',clamp01((p-.3)/.5));st.setProperty('--morning',clamp01((p-.9)/.1));st.setProperty('--rise',clamp01((p-.62)/.38));st.setProperty('--starlight',clamp01(1-p*1.05));document.body.classList.toggle('morning',p>=1);}
import {match} from './lib/core.mjs';
import {zodiac} from './lib/zodiac.mjs';
const app=document.querySelector('#survey'),error=document.querySelector('#survey-error');
let quiz,step=0,answers=Array(9).fill(null),month='',day='',submitting=false;
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
function nav(birthday=false){const n=node('nav',undefined,'quiz-nav');n.setAttribute('aria-label','설문 진행');const back=node('button','← 이전','back');back.type='button';back.disabled=step===0&&!birthday;back.onclick=()=>{if(birthday)step=8;else step--;question();};n.append(back,node('span',birthday?'마지막 별을 찾아서':`${String(step+1).padStart(2,'0')} / 09`));return n;}
function constellation(birthday=false){const line=node('div',undefined,'constellation');line.setAttribute('role','img');line.setAttribute('aria-label',birthday?'9개의 질문 완료':`${step+1}번째 질문, 전체 9개`);for(let i=0;i<9;i++){const dot=node('span',undefined,`star ${birthday||i<step?'passed':''} ${!birthday&&i===step?'current':''}`);dot.style.setProperty('--rise',[0,-7,4,-10,3,8,-4,6,0][i]+'px');line.append(dot);}return line;}
function show(section,title){app.replaceChildren(section);error.textContent='';window.scrollTo({top:0,behavior:'instant'});title.tabIndex=-1;title.focus({preventScroll:true});}
function question(){setSky(step/9);const q=quiz.questions[step],section=node('section');section.append(nav(),constellation(),node('p','FOLLOW YOUR LITTLE STAR','eyebrow'));const title=node('h1',cleanQuestion(q.text));section.append(title,node('p','마음이 가는 쪽을 천천히 골라줘.','helper'));const opts=node('div',undefined,'options');opts.setAttribute('role','radiogroup');opts.setAttribute('aria-label',q.text);const next=node('button',step===8?'나의 별자리 만나기':'다음 별로','primary next');next.type='button';next.disabled=answers[step]===null;
q.options.forEach((o,i)=>{const b=node('button',undefined,'option');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-checked',String(answers[step]===i));b.append(node('span',o.id,'letter'),node('span',cleanQuestion(o.text),'option-text'));b.onclick=()=>{answers[step]=i;Array.from(opts.children).forEach((el,j)=>el.setAttribute('aria-checked',String(j===i)));next.disabled=false;};b.onkeydown=e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const j=(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:3))%4;opts.children[j].focus();opts.children[j].click();}};opts.append(b);});
next.onclick=()=>{if(answers[step]===null)return;if(step<8){step++;question();}else birthday();};section.append(opts,next);show(section,title);}
function birthday(){setSky(1);const section=node('section');section.append(nav(true),constellation(true),node('div','✧','birthday-symbol'),node('p','YOUR BIRTHDAY, YOUR STAR','eyebrow'));const title=node('h1','너의 별은 언제 찾아왔을까?');section.append(title,node('p','생일을 알려주면 너의 별자리를 찾아줄게.','helper'));const form=node('form'),fields=node('div',undefined,'birthday-fields'),ml=node('label','태어난 달'),dl=node('label','태어난 날'),ms=node('select'),ds=node('select');ms.name='birth-month';ms.autocomplete='bday-month';ms.required=true;ds.name='birth-day';ds.autocomplete='bday-day';ds.required=true;ms.append(new Option('월 선택',''));for(let m=1;m<=12;m++)ms.append(new Option(m+'월',String(m)));ms.value=month;ml.append(ms);dl.append(ds);fields.append(ml,dl);const validation=node('p','','birthday-error');validation.setAttribute('role','alert');const submit=node('button','나의 행운 만나기','primary next');submit.type='submit';
function days(){const previous=day;ds.replaceChildren(new Option('일 선택',''));const max=month?[31,29,31,30,31,30,31,31,30,31,30,31][+month-1]:31;for(let d=1;d<=max;d++)ds.append(new Option(d+'일',String(d)));day=+previous<=max?previous:'';ds.value=day;submit.disabled=!month||!day;validation.textContent='';}
ms.onchange=()=>{month=ms.value;days();};ds.onchange=()=>{day=ds.value;submit.disabled=!month||!day;validation.textContent='';};days();form.append(fields,validation,submit);form.onsubmit=e=>{e.preventDefault();if(submitting)return;try{const sign=zodiac(Number(month),Number(day));const characterId=match(answers,quiz),character=quiz.characters.find(c=>c.id===characterId);if(!character)throw Error('버디즈를 찾지 못했어요. 다시 시도해 주세요.');const payload={v:'night-result-v1',characterName:character.name,zodiacId:sign.id,completedAt:Date.now()};const bytes=new TextEncoder().encode(JSON.stringify(payload));const encoded=btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');try{sessionStorage.setItem('huug-last-result','./#result='+encoded);}catch{}submitting=true;submit.disabled=true;submit.textContent='너의 행운이 다가오는 중…';location.href='./#result='+encoded;}catch(err){validation.textContent=err.message;submit.disabled=false;submitting=false;}};section.append(form);show(section,title);}
async function load(){try{const response=await fetch('./data/quiz.json');if(!response.ok)throw Error();quiz=await response.json();if(quiz.questions?.length!==9||quiz.questionCount!==9)throw Error();question();}catch{app.replaceChildren(node('p','별빛을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.','loading'));const retry=node('button','다시 불러오기','retry');retry.onclick=load;app.append(retry);}}
load();
// Coming back from the result: offer the same result link again, and never keep a frozen submit button from bfcache.
addEventListener('pageshow',e=>{if(e.persisted)location.reload();});
try{const last=sessionStorage.getItem('huug-last-result');if(last?.startsWith('./#result=')){const again=node('a','방금 만난 행운 다시 보기 →','again-link');again.href=last;document.querySelector('header').after(again);}}catch{}
