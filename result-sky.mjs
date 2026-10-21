// KST time bands for the result's softly tinted sky.
export function resultSky(timestamp){
 const hour=new Date(timestamp+9*60*60*1000).getUTCHours();
 return hour>=5&&hour<9?'dawn':hour>=9&&hour<17?'day':hour>=17&&hour<20?'sunset':'night';
}
