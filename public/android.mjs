// The native host injects this object only into the packaged, exact HTTPS origin.
export function connectAndroid({onImport, onStatus}) {
  const channel = globalThis.window?.BureauAndroid;
  if (!channel || typeof channel.postMessage !== 'function') return null;
  const send = request => channel.postMessage(JSON.stringify(request));
  channel.onmessage = event => {
    try {
      const response = JSON.parse(event.data);
      if (response.type === 'import' && response.ok === true && typeof response.text === 'string') onImport(response.text);
      else if (response.type === 'status' && typeof response.text === 'string') onStatus(response.text);
    } catch { onStatus('Не удалось прочитать ответ приложения. Дневник сохранён.'); }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    try {
      const url = new URL(link.href);
      if (url.protocol === 'https:' && url.hostname === 't.me') {
        event.preventDefault();
        send({type:'open-url', url:url.href});
      }
    } catch { /* Relative application navigation stays in the WebView. */ }
  }, true);
  return {
    exportDiary: text => send({type:'export', text}),
    importDiary: () => send({type:'import'}),
  };
}
