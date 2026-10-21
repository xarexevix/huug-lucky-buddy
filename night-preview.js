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
