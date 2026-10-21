(()=>{
const root=document.querySelector('#tarot-experience'),stage=root.querySelector('.orbit-stage');
root.querySelector('#ring-title').innerHTML='오늘, 어떤 행운이<br>너에게 닿을까?';
root.querySelector('#ring-subtitle').innerHTML='별빛 사이에 숨어 있는<br>너만의 작은 행운을 만나봐.';
for(const cls of ['astro-outer','astro-inner','astro-ellipse']){const el=document.createElement('div');el.className='astro-orbit '+cls;stage.prepend(el);}
const hint=document.createElement('p');hint.className='drag-hint';hint.textContent='천천히 돌려봐, 너의 행운이 숨어 있어';stage.after(hint);
const time=document.createElement('p');time.className='time-hint';time.textContent='9개의 작은 질문 · 약 1분';root.querySelector('.ring-actions').after(time);
stage.setAttribute('tabindex','0');stage.setAttribute('role','group');stage.setAttribute('aria-label','천체 모형. 드래그하거나 좌우 방향키로 돌려보세요.');
root.querySelectorAll('.orbit-card').forEach((card,i)=>{const im=document.createElement('img');im.src=D.characters[i%D.characters.length].path;im.className='mystery-buddy';im.alt='';im.draggable=false;const q=document.createElement('span');q.className='mystery-mark';q.textContent='?';q.setAttribute('aria-hidden','true');card.append(im,q);});
let rotation=0,drag=null,lastFrame=0,inView=true;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;lastFrame=0;}).observe(stage);
function orbitTick(now){
 if(!drag&&!document.hidden&&inView&&!reduceMotion.matches){
  if(lastFrame){rotation=(rotation+Math.min(now-lastFrame,100)/150000*360)%360;update();}
  lastFrame=now;
 }else lastFrame=0;
 requestAnimationFrame(orbitTick);
}
requestAnimationFrame(orbitTick);
function angle(e){const r=stage.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI;}
function update(){stage.style.setProperty('--spin',rotation+'deg');}
stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,angle:angle(e),x:e.clientX,y:e.clientY,moved:false};stage.classList.add('dragging');});
stage.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;if(!drag.moved){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;drag.moved=true;stage.setPointerCapture(e.pointerId);}const a=angle(e);let delta=a-drag.angle;if(delta>180)delta-=360;if(delta< -180)delta+=360;rotation+=delta;drag.angle=a;update();});
function release(){drag=null;stage.classList.remove('dragging');}stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotation+=e.key==='ArrowRight'?15:-15;update();}});
})();

// Start screen sparkle: a constellation outside each buddy and four-point stars kept off the text column.
(()=>{
const D=window.PREVIEW_DATA,root=document.querySelector('#tarot-experience'),stage=root.querySelector('.orbit-stage'),cards=[...stage.querySelectorAll('.orbit-card')];
const colors=['#ffffff','#ffd1ec','#e7d6ff','#fff0c9'];
function build(){
 root.querySelectorAll('.start-const,.start-spark').forEach(el=>el.remove());
 const mobile=innerWidth<600,w=mobile?60:100,h=w/2,k=mobile?1.55:1.5;
 cards.forEach((card,i)=>{const z=D.zodiac[i%12],p=D.patterns[z.id];if(!p)return;const x=parseFloat(card.style.getPropertyValue('--x'))||0,y=parseFloat(card.style.getPropertyValue('--y'))||0,pt=p.points400x200;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','start-const');svg.setAttribute('viewBox','-20 -20 440 240');svg.setAttribute('width',w);svg.setAttribute('height',h);svg.setAttribute('aria-hidden','true');svg.style.transform=`translate(-50%,-50%) translate(${x*k}px,${y*k}px)`;
  svg.innerHTML=p.paths.map(path=>`<path d="M${path.map(id=>pt[id].join(' ')).join('L')}"/>`).join('');
  stage.append(svg);});
 let seed=11;const rnd=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 const rr=root.getBoundingClientRect(),sr=stage.getBoundingClientRect(),top=sr.top-rr.top-20,bottom=sr.bottom-rr.top;
 for(let i=0;i<0;i++){let x,y;do{x=rnd();y=rnd();}while((y*rr.height<top||y*rr.height>bottom)&&x>.15&&x<.85);
  const s=document.createElement('i');s.className='start-spark';s.setAttribute('aria-hidden','true');s.style.left=x*100+'%';s.style.top=y*100+'%';
  s.style.setProperty('--s',8+i*7%10+'px');s.style.setProperty('--c',colors[i%4]);s.style.setProperty('--d',1.8+rnd()*2.6+'s');s.style.setProperty('--dl',-rnd()*3+'s');root.append(s);}
}
let timer;const rebuild=()=>{clearTimeout(timer);timer=setTimeout(build,150);};
new MutationObserver(rebuild).observe(cards[0],{attributes:true,attributeFilter:['style']});
addEventListener('resize',rebuild);build();
})();
