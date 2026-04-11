const INDEXNOW_KEY = '22288b2612d346dba480afdee80f5ca0';
const HOST = 'xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
const BASE_URL = `https://${HOST}`;

/**
 * Notify Yandex & Bing that specific URLs changed.
 * Fire-and-forget — never blocks the main request.
 */
export function pingIndexNow(paths: string[]): void {
  const urlList = paths.map((p) => `${BASE_URL}${p}`);

  const body = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  });

  const headers = { 'Content-Type': 'application/json; charset=utf-8' };

  // Fire-and-forget — don't await
  fetch('https://yandex.com/indexnow', { method: 'POST', headers, body }).catch(() => {});
  fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers, body }).catch(() => {});
}
