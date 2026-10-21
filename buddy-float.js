/* Decorative layers only. The original #front keeps the full static export. */
(()=>{
  let stage,art,base,cut,shadow,toggle,version=0,visible=true,userPaused=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function sync(){
    if(!stage)return;
    stage.classList.toggle('is-paused',document.hidden||!visible||userPaused||reduced.matches);
    toggle.textContent=userPaused?'둥실둥실 켜기':'움직임 멈추기';
    toggle.setAttribute('aria-pressed',String(userPaused));
  }
  function setup(){
    if(stage)return true;
    const front=document.getElementById('front');
    if(!front)return false;
    stage=document.createElement('div');stage.className='buddy-float-stage';
    front.before(stage);stage.append(front);
    art=document.createElement('div');art.className='buddy-float-art';art.setAttribute('aria-hidden','true');
    base=document.createElement('canvas');base.width=front.width;base.height=front.height;base.className='buddy-float-base';
    shadow=document.createElement('div');shadow.className='buddy-float-shadow';
    cut=document.createElement('img');cut.className='buddy-float-character';cut.alt='';cut.draggable=false;
    art.append(base,shadow,cut);stage.append(art);
    toggle=document.createElement('button');toggle.type='button';toggle.className='buddy-float-toggle';
    toggle.addEventListener('click',()=>{userPaused=!userPaused;sync()});
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(stage);
    sync();return true;
  }
  async function update({character,skyId,renderBase}){
    if(!setup())return false;
    const seq=++version;
    stage.classList.remove('is-ready');
    if(!character?.path||typeof renderBase!=='function')return false;
    // Work offscreen so fast consecutive selections cannot mix character and sky.
    const pending=document.createElement('canvas');pending.width=base.width;pending.height=base.height;
    const image=new Image();image.src=character.path;
    try{
      await Promise.all([image.decode(),renderBase(pending)]);
      if(seq!==version)return false;
      base.getContext('2d').clearRect(0,0,base.width,base.height);
      base.getContext('2d').drawImage(pending,0,0);cut.src=character.path;
      const [x0,,x1,y1]=character.alphaBBox;
      shadow.style.left=((92+(x0+x1)*.42)/1024*100)+'%';
      shadow.style.top=((365+y1*.84-5)/1536*100)+'%';
      shadow.style.width=((x1-x0)*.84*.84/1024*100)+'%';
      shadow.style.height=(28/1536*100)+'%';
      stage.classList.toggle('is-night',skyId==='night');
      stage.classList.add('is-ready');sync();return true;
    }catch(error){
      if(seq===version)stage.classList.remove('is-ready');
      console.warn('Floating preview uses static fallback:',error);return false;
    }
  }
  window.BuddyFloat={update,pause(value=true){userPaused=value;sync()},clear(){version++;stage?.classList.remove('is-ready')}};
})();
