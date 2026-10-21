export const VERSION = 'huug-web-v1';
export function match(answers, quiz) {
  if (!Array.isArray(answers) || answers.length !== 9 || answers.some(a => !Number.isInteger(a) || a < 0 || a > 3)) throw Error('응답 9개가 필요해요.');
  const vectors = quiz.scores.map(c => answers.map((a, q) => c[q][a]));
  const totals = vectors.map(v => v.reduce((a, b) => a + b, 0));
  let candidates = totals.map((v, i) => i).filter(i => totals[i] === Math.max(...totals));
  for (const q of quiz.tieBreakQuestionOrder.map(id => Number(id.slice(1)) - 1)) {
    if (candidates.length === 1) break;
    const best = Math.max(...candidates.map(i => vectors[i][q]));
    candidates = candidates.filter(i => vectors[i][q] === best);
  }
  const start = answers.reduce((code, a) => code * 4 + a, 0) % 11;
  candidates.sort((a,b) => (a-start+11)%11 - (b-start+11)%11);
  return quiz.scoreCharacterOrder[candidates[0]];
}
export function classify(answers, rules) {
  const r = rules.baseRules;
  return { situationId: answers[7] === 3 ? 'snack' : r.situationRule.q6['ABCD'[answers[5]]], skyId: r.skyRule.mapping['ABCD'[answers[8]]] };
}
export function eligible(situationId, skyId, rules) {
  return rules.modifiers.filter(m => m.eligibleSituations.includes(situationId) && !rules.sampling.compatibilityRule.exclude.some(e => e.modifierId === m.id && e.skyId === skyId));
}
export function resolve(payload, quiz, rules) {
  if (!payload || payload.v !== VERSION || !/^[0-3]{9}$/.test(payload.a) || !/^m\d{2}$/.test(payload.m) || !Number.isSafeInteger(payload.t) || payload.t < 0 || typeof payload.id !== 'string' || !/^[a-zA-Z0-9-]{8,64}$/.test(payload.id)) throw Error('이 결과 링크를 확인할 수 없어요.');
  const answers = [...payload.a].map(Number);
  const characterId = match(answers, quiz);
  const {situationId, skyId} = classify(answers, rules);
  const modifier = eligible(situationId, skyId, rules).find(m => m.id === payload.m);
  if (!modifier) throw Error('이 결과 링크를 확인할 수 없어요.');
  return {payload, characterId, situationId, skyId, modifier};
}
export function createResult(answers, quiz, rules, random = Math.random) {
  match(answers, quiz);
  const {situationId, skyId} = classify(answers, rules);
  const pool = eligible(situationId, skyId, rules);
  const payload = {v: VERSION, a: answers.join(''), m: pool[Math.floor(random() * pool.length)].id, t: Date.now(), id: crypto.randomUUID()};
  return resolve(payload, quiz, rules);
}
export function encode(payload) { return btoa(JSON.stringify(payload)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''); }
export function decode(text) {
  if (typeof text !== 'string' || text.length > 1500 || !/^[A-Za-z0-9_-]+$/.test(text)) throw Error('이 결과 링크를 확인할 수 없어요.');
  return JSON.parse(atob(text.replaceAll('-','+').replaceAll('_','/')));
}
