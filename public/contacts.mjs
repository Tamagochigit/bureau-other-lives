export const CONTACTS_KEY = 'other-lives:contacts:v1';
export const MAX_CONTACTS = 100;
const reserved = new Set(['addemoji','addlist','addstickers','addstyle','addtheme','auction','auth','boost','call','confirmphone','contact','giftcode','invoice','joinchat','login','proxy','setlanguage','share','socks','web','resolve']);

export function telegramUsername(value) {
  let username = String(value || '').trim();
  if (username.startsWith('https://')) {
    const url = new URL(username);
    if (url.hostname !== 't.me' || url.port || url.username || url.password || url.search || url.hash || !/^\/[a-z0-9_]+\/?$/i.test(url.pathname)) throw new Error('Укажи @username друга или ссылку https://t.me/username.');
    username = url.pathname.replace(/^\/|\/$/g, '');
  }
  username = username.replace(/^@/, '').toLowerCase();
  if (!/^[a-z][a-z0-9_]{3,31}$/.test(username) || reserved.has(username)) throw new Error('Проверь @username: только латинские буквы, цифры и знак _.');
  return username;
}

export function contact(value) {
  const username = telegramUsername(value?.username);
  const name = String(value?.name || '').trim().replace(/\s+/g, ' ');
  if (!name || name.length > 60) throw new Error('Укажи имя друга — до 60 символов.');
  return { name, username };
}

export function decodeContacts(raw) {
  const data = JSON.parse(raw);
  if (data?.version !== 1 || !Array.isArray(data.contacts) || data.contacts.length > MAX_CONTACTS) throw new Error('Не удалось прочитать сохранённый список друзей.');
  const contacts = data.contacts.map(contact);
  if (new Set(contacts.map(item => item.username)).size !== contacts.length) throw new Error('В списке есть повторяющиеся имена Telegram.');
  return contacts;
}

export function saveContact(contacts, value, previousUsername = '') {
  const next = contact(value);
  const existing = contacts.find(item => item.username === next.username);
  if (previousUsername && previousUsername !== next.username && existing) throw new Error('Этот Telegram уже есть в списке.');
  const result = contacts.filter(item => item.username !== previousUsername && item.username !== next.username);
  if (result.length >= MAX_CONTACTS) throw new Error('В списке уже 100 друзей. Убери ненужный контакт, чтобы добавить новый.');
  return [...result, next];
}
