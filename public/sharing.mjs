import { missionShareData, missionDraft } from './links.mjs';

// Accept only a known public catalog id; no diary, recipient, address or arbitrary text.
export function createMissionSharing({ android = null, navigator = globalThis.navigator, toast, showText }) {
  async function copy(id) {
    const text = missionDraft(id);
    if (!text) return 'invalid';
    if (typeof navigator?.clipboard?.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        toast('Миссия скопирована. Вставь её в удобный чат.');
        return 'copied';
      } catch { /* Keep a selectable public-text fallback when clipboard access is unavailable. */ }
    }
    showText(id);
    toast('Текст миссии можно выделить и скопировать.');
    return 'fallback';
  }
  async function share(id) {
    const data = missionShareData(id);
    if (!data) return 'invalid';
    if (typeof android?.shareMission === 'function') {
      android.shareMission(id);
      return 'opened';
    }
    if (typeof navigator?.share === 'function') {
      try {
        await navigator.share(data);
        return 'completed';
      } catch (error) {
        if (error?.name === 'AbortError') return 'canceled';
        showText(id);
        toast('Меню недоступно. Можно скопировать текст миссии.');
        return 'fallback';
      }
    }
    return copy(id);
  }
  return { share, copy };
}
