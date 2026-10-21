// Integration draft; not connected to public app/dist.
export const SNAPSHOT_VERSION = 'huug-dated-content-v1';
export function kstDate(completedAt) {
  if (!Number.isSafeInteger(completedAt) || !Number.isFinite(new Date(completedAt).getTime())) throw new Error('Invalid completion timestamp');
  const parts = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(completedAt);
  const get = key => parts.find(p => p.type === key).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function createContentSnapshot({completedAt, zodiacId, catalogByDate}) {
  const generatedDate = kstDate(completedAt);
  const catalog = catalogByDate[generatedDate];
  if (!catalog) return {status:'unavailable', generatedDate, notice:`${generatedDate} 기준 콘텐츠가 아직 준비되지 않았어요.`};
  if (catalog.sourceDate !== generatedDate || typeof catalog.version !== 'string') throw new Error('Catalog date/version mismatch');
  const entry = catalog.entries.find(e => e.id === zodiacId);
  if (!entry || typeof entry.message !== 'string' || typeof (entry.compactHint ?? entry.hint) !== 'string') throw new Error('Missing zodiac content');
  return {status:'ready', schemaVersion:SNAPSHOT_VERSION, completedAt, generatedDate,
    contentDate:catalog.sourceDate, contentVersion:catalog.version, zodiacId,
    message:entry.message, hint:entry.compactHint ?? entry.hint,
    sourceUrl:catalog.sourceUrl, copyDisclosure:catalog.copyDisclosure,
    astrologySystemNote:catalog.astrologySystemNote ?? null,
    hintProvenance:entry.hintProvenance ?? null};
}
// Restore a frozen snapshot, never consult current date or rerun content selection.
export function restoreContentSnapshot(serialized) {
  const s = JSON.parse(serialized);
  if (s.status !== 'ready' || s.schemaVersion !== SNAPSHOT_VERSION ||
      kstDate(s.completedAt) !== s.generatedDate || s.contentDate !== s.generatedDate ||
      ['contentVersion','zodiacId','message','hint','sourceUrl','copyDisclosure'].some(k => typeof s[k] !== 'string')) throw new Error('Invalid content snapshot');
  return s;
}
