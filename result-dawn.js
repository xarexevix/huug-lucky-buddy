(()=>{
const hint=document.querySelector('#flip-hint');const title=document.createElement('h1');title.className='result-heading';title.textContent='너에게 닿은 오늘의 행운';hint.before(title);document.querySelector('.cards').after(hint);
document.querySelectorAll('.mystery-mark').forEach(el=>el.remove());
const silhouettes=document.createElement('div');silhouettes.className='result-silhouettes';silhouettes.setAttribute('aria-hidden','true');
[1,4,7,9].forEach((index,i)=>{const img=document.createElement('img');img.src=window.PREVIEW_DATA.characters[index%window.PREVIEW_DATA.characters.length].path;img.alt='';img.style.setProperty('--i',i);silhouettes.append(img);});document.body.append(silhouettes);
// No toggle button: other buddies always sit under the result, excluding the current one and duplicate names.
const recommendations=document.createElement('section');recommendations.className='buddy-recommendations';recommendations.innerHTML='<h2>옆자리 버디즈도 소개할게 →</h2><p>다들 저마다의 행운으로 하루를 지켜 줘 :)</p><div class="recommendation-grid"></div>';document.querySelector('#result-explore').after(recommendations);
document.querySelector('#open-ring').remove();
function fillRecommendations(){
 const current=window.PREVIEW_DATA.characters[+document.querySelector('#char').value]?.name;
 const seen=new Set([current?.normalize('NFC').trim()]);
 const items=Array.from(document.querySelectorAll('#tarot-experience .product-list > .product-item')).filter(el=>{const name=el.querySelector('h3').textContent.normalize('NFC').trim();if(seen.has(name))return false;seen.add(name);return true;});
 for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
 recommendations.querySelector('.recommendation-grid').replaceChildren(...items.slice(0,3).map(el=>el.cloneNode(true)));
}
document.querySelector('#char').addEventListener('change',fillRecommendations);fillRecommendations();
})();
(()=>{
 const frame=document.createElement('div');frame.className='result-ornament';frame.setAttribute('aria-hidden','true');
 const art=`<svg viewBox="0 0 220 240" fill="none" stroke="currentColor" stroke-width=".8"><path d="M8 175V40Q8 8 40 8H190M15 145V43Q15 15 43 15H160"/><circle cx="58" cy="58" r="19"/><circle cx="58" cy="58" r="24" stroke-dasharray="1 4"/><g id="rays">${Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return `<path d="M${58+Math.cos(a)*29} ${58+Math.sin(a)*29}L${58+Math.cos(a)*(i%2?35:41)} ${58+Math.sin(a)*(i%2?35:41)}"/>`;}).join('')}</g><path d="M24 207Q52 174 30 113M31 177Q4 166 25 152Q39 163 31 177ZM35 159Q62 139 46 130Q30 139 35 159ZM33 137Q17 118 25 108Q38 117 33 137M115 29Q137 46 160 26M129 35Q128 16 145 19Q145 32 129 35"/><path d="M112 92l3 10 10 3-10 3-3 10-3-10-10-3 10-3ZM63 211l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z"/><circle cx="96" cy="151" r="1.5"/><circle cx="176" cy="56" r="1"/><path d="M156 109a15 15 0 1 0 14 22 13 13 0 0 1-14-22Z"/></svg>`;
 for(const cls of ['top-left','top-right','bottom-left','bottom-right']){const wrap=document.createElement('div');wrap.innerHTML=art;wrap.firstChild.setAttribute('class',cls);frame.append(wrap.firstChild);}
 for(const cls of ['ornament-moon','ornament-moon right']){const wrap=document.createElement('div');wrap.innerHTML=`<svg class="${cls}" viewBox="0 0 30 100" fill="none" stroke="currentColor"><path d="M15 0v15m0 70v15M15 24l3 8 7 3-7 3-3 8-3-8-7-3 7-3ZM17 54a10 10 0 1 0 8 15 9 9 0 0 1-8-15Z"/></svg>`;frame.append(wrap.firstChild);}
 document.body.append(frame);
})();



