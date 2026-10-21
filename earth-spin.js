(()=>{
const earth=document.querySelector('.earth'),cv=document.createElement('canvas');cv.width=cv.height=192;cv.className='earth-sphere';cv.setAttribute('aria-label','천천히 자전하는 지구');cv.setAttribute('role','img');earth.replaceChildren(cv);
const ctx=cv.getContext('2d'),out=ctx.createImageData(192,192),map=new Image();map.src='vendor/earth-map.jpg';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let data,visible=true,last=0,rotation=120*Math.PI/180;
const geometry=[];for(let y=0;y<192;y++)for(let x=0;x<192;x++){const nx=(x-95.5)/95,ny=(y-95.5)/95,r=nx*nx+ny*ny;if(r>1)continue;const z=Math.sqrt(1-r);geometry.push({i:(y*192+x)*4,lon:Math.atan2(nx,z),lat:Math.asin(-ny),light:.46+.54*Math.max(0,-nx*.65+z*.76)});}
function draw(){if(!data)return;for(const p of geometry){const u=((p.lon+rotation)/(2*Math.PI)+.5)%1,v=.5-p.lat/Math.PI,j=(Math.min(map.height-1,Math.floor(v*map.height))*map.width+Math.floor((u+1)%1*map.width))*4;const ocean=data[j+2]>data[j]*1.12 && data[j+2]>data[j+1]*.92;const color=ocean?[94,131,171]:[153,175,158];for(let k=0;k<3;k++)out.data[p.i+k]=color[k]*p.light;out.data[p.i+3]=255;}ctx.putImageData(out,0,0);cv.dataset.rotation=rotation.toFixed(4);}
map.onload=()=>{const t=document.createElement('canvas');t.width=map.width;t.height=map.height;const c=t.getContext('2d');c.drawImage(map,0,0);data=c.getImageData(0,0,map.width,map.height).data;draw();};
new IntersectionObserver(e=>{visible=e[0].isIntersecting;last=0;}).observe(earth);
function tick(t){if(!document.hidden&&visible&&!reduced.matches){if(last&&t-last>=60){rotation+=(t-last)/150000*Math.PI*2;last=t;draw();}else if(!last)last=t;}else last=0;requestAnimationFrame(tick);}requestAnimationFrame(tick);
})();
