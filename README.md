# Бюро других жизней

Самостоятельное веб-приложение: небольшие приключения, традиции, личный дневник и компас по твоим оценкам.

[Открыть приложение](https://tamagochigit.github.io/bureau-other-lives/) · [Проект в GitHub](https://github.com/Tamagochigit/bureau-other-lives)

На главной — «Удиви меня», без выбора времени и места. Начатую миссию можно продолжить ниже. Текст крупный и контрастный, дневник остаётся в браузере.

В «Друзьях» сохрани имя и @username Telegram. «Написать» откроет его чат в Telegram. «Предложить другу» подготовит публичную миссию в черновике; получателя и отправку выбираешь ты. История сообщений и аккаунт принадлежат Telegram. Список контактов хранится только в этом браузере, отдельно от дневника.

## Разработка

Нужен Node.js 22.13+; CI использует Node 24. Зависимостей для установки нет.

```sh
git clone https://github.com/Tamagochigit/bureau-other-lives.git
cd bureau-other-lives
npm run dev
```

Открой http://127.0.0.1:3000. Исходники — `public/`, основной экран и события — `public/app.mjs`.

```sh
npm run verify
npm run build
npm start
```

`npm run build` собирает только публичные файлы в `out/pages`; `npm start` позволяет проверить эту сборку локально. Коммит в `main` запускает проверку и публикацию на GitHub Pages. Сервер приложения, база сообщений и отдельный вход не нужны.

## Данные и история

Ключ дневника и формат v1 сохранены. В настройках можно скачать JSON-копию и восстановить её с объединением записей. Копия включает завершённые миссии, заметки, избранное и традиции; контакты Telegram в неё не входят. На другом устройстве или другом адресе свой дневник — перенеси его файлом.

Полная Git-история прежних версий сохранена. Старый сервер чатов удалён из текущего проекта; его прежние данные и публикация не удалялись. Датированные документы о прошлой архитектуре — история решений.

[Документация](docs/README.md) · [Архитектура](docs/architecture.md) · [Публикация и восстановление](docs/operations.md) · [Проверки](docs/testing.md).

## Android

[Download APK 0.4.1](https://github.com/Tamagochigit/bureau-other-lives/raw/refs/heads/main/downloads/bureau-0.4.1.apk). APK 0.4.1 is signed with the existing product key, uses the full application name and packages offline missions and local diary data. Android35 offline mission/diary/reload/Back tests passed; phone file-picker/Telegram acceptance remains separate. [RuStore assets and listing preparation](docs/rustore.md). [Android build, signing and recovery](docs/android.md); [motivation and monetisation hypotheses](docs/monetization.md). Browser records transfer through the compatible JSON backup; contacts are separate. CI produces an unsigned APK until a private product key signs it.

## Карточка RuStore

[Комплект и воспроизводимые снимки Android](docs/rustore.md). Название кандидата 0.4.1 — «Бюро других жизней»; результаты сборки/подписи фиксируются отдельно.
