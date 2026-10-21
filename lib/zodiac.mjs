export const signs=[
['capricorn','염소자리',1222,'차곡차곡 쌓아온 마음을 믿어봐.\n오늘은 작은 쉼도 네 편이야.'],
['aquarius','물병자리',120,'조금 다른 생각이어도 괜찮아.\n네가 고른 길에 즐거움을 놓아두자.'],
['pisces','물고기자리',219,'마음에 떠오른 작은 바람을\n오늘은 다정하게 들어줘.'],
['aries','양자리',321,'작은 한 걸음부터 시작해봐.\n버디즈가 네 곁에서 응원할게.'],
['taurus','황소자리',420,'서두르지 않아도 좋아.\n기다리는 동안의 기쁨도 네 것이야.'],
['gemini','쌍둥이자리',521,'떠오른 이야기를 건네볼까.\n짧은 안부에도 마음은 담기니까.'],
['cancer','게자리',621,'마음을 편히 놓을 자리를 찾아봐.\n너에게도 다정한 쉼이 필요해.'],
['leo','사자자리',723,'오늘 마음에 드는 너의 모습을\n작게라도 칭찬해주면 좋겠어.'],
['virgo','처녀자리',823,'모든 걸 채우지 않아도 괜찮아.\n작은 빈틈에 여유를 남겨두자.'],
['libra','천칭자리',923,'누군가를 챙긴 만큼\n오늘은 네 마음도 살펴줘.'],
['scorpio','전갈자리',1023,'소중한 마음은 천천히 꺼내도 돼.\n네 속도로 이야기를 들려줘.'],
['sagittarius','사수자리',1122,'익숙한 길에서 잠깐 고개를 들어봐.\n작은 풍경도 여행이 될 수 있어.']
].map(([id,name,start,message])=>({id,name,start,message}));
export function zodiac(month,day){
 const days=[31,29,31,30,31,30,31,31,30,31,30,31];
 if(!Number.isInteger(month)||!Number.isInteger(day)||month<1||month>12||day<1||day>days[month-1])throw Error('양력 생일의 월과 일을 확인해줘.');
 const md=month*100+day;return [...signs].sort((a,b)=>a.start-b.start).filter(s=>s.start<=md).at(-1)||signs[0];
}
