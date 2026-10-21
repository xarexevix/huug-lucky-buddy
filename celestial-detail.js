(()=>{
const root=document.getElementById('tarot-experience');
root.querySelector('.earth-labels')?.remove();
for(const selector of ['.sun','.moon']){const el=root.querySelector(selector);for(const n of [...el.childNodes])if(n.nodeType===3)n.remove();}
const moon=document.createElement('canvas'),sun=document.createElement('canvas');
moon.width=moon.height=sun.width=sun.height=256;
moon.className='moon-surface';sun.className='sun-surface';
root.querySelector('.moon-orb').replaceChildren(moon);root.querySelector('.sun-orb').replaceChildren(sun);
function drawSun(){const c=sun.getContext('2d');c.clearRect(0,0,256,256);const g=c.createRadialGradient(100,88,5,128,128,126);g.addColorStop(0,'#fff9ec');g.addColorStop(.65,'#f4e6ce');g.addColorStop(1,'#d8c4a3');c.fillStyle=g;c.beginPath();c.arc(128,128,125,0,Math.PI*2);c.fill();}
drawSun();
const texture=new Image();texture.src='vendor/moon-lroc.jpg';
let pixels;
function drawMoon(){if(!pixels)return;const date=new Date(),info=Astronomy.Illumination('Moon',date),phase=Astronomy.MoonPhase(date),angle=info.phase_angle*Math.PI/180;
const sx=Math.sin(angle)*(phase<180?1:-1),sz=Math.cos(angle),c=moon.getContext('2d'),out=c.createImageData(256,256);
for(let y=0;y<256;y++)for(let x=0;x<256;x++){const nx=(x-127.5)/126,ny=(y-127.5)/126,r=nx*nx+ny*ny;if(r>1)continue;const nz=Math.sqrt(1-r),lon=Math.atan2(nx,nz),lat=Math.asin(-ny),tx=Math.min(texture.width-1,Math.floor((lon/(2*Math.PI)+.5)*texture.width)),ty=Math.min(texture.height-1,Math.floor((.5-lat/Math.PI)*texture.height)),j=(ty*texture.width+tx)*4,i=(y*256+x)*4;const dot=nx*sx+nz*sz,light=dot>0?.24+.76*Math.pow(dot,.3):.035;
const gray=(pixels[j]+pixels[j+1]+pixels[j+2])/3;for(let k=0;k<3;k++)out.data[i+k]=Math.min(255,gray*1.85*light);out.data[i+3]=255;}
c.putImageData(out,0,0);moon.setAttribute('aria-label','오늘의 달');moon.dataset.phase=phase.toFixed(3);moon.dataset.illumination=info.phase_fraction.toFixed(5);moon.dataset.date=date.toISOString();}
texture.onload=()=>{const cv=document.createElement('canvas');cv.width=texture.width;cv.height=texture.height;const c=cv.getContext('2d');c.drawImage(texture,0,0);pixels=c.getImageData(0,0,texture.width,texture.height).data;drawMoon();};
setInterval(()=>{if(!document.hidden)drawMoon();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)drawMoon();});
const stars=document.createElement('div');stars.className='magic-stars';stars.setAttribute('aria-hidden','true');
for(let i=0;i<160;i++){const s=document.createElement('i');s.className='magic-star'+(i<110&&i%9===0?' sparkle-star':'');s.style.cssText=`left:${(i*37.73+8)%100}%;top:${(i*21.97+3)%100}%;--duration:${3+i%6}s;--delay:${-i*.73}s;--size:${i%7===0?3:1.5}px`;stars.append(s);}
for(let i=0;i<2;i++){const s=document.createElement('i');s.className='shooting-star';s.style.cssText=`left:${68+i*21}%;top:${12+i*29}%;animation-delay:${i*7+2}s;`;stars.append(s);}
document.body.prepend(stars);
document.addEventListener('visibilitychange',()=>stars.classList.toggle('paused',document.hidden));
})();
