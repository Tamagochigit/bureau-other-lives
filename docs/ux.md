# UX

A quiet notebook: warm paper, dark ink and one dark orange primary action. The owner reported small, pale text and too much noise on 2026-10-04; on 2026-10-05 they restored «Удиви меня» and rejected the home time selection.

Home has one full-width surprise button and a short description. Active progress is visible below, with «Продолжить»; «Выбрать самому» opens the catalog. No home time/place fields, decorative introduction, sample statistics or promoted cards. Catalog controls remain in a native disclosure. Five primary actions: home, missions, friends, compass and diary; traditions are reachable from missions.

Body/buttons use 1.125rem (18px at the browser default); secondary copy is 1rem and compact navigation .875rem. Narrow breakpoints do not shrink text. Controls remain at least 48px with visible focus. The existing opaque colours and readable dialog instructions are preserved.

Friends looks like a simple contact list: chosen name, @username and «Написать». Add/edit uses two labelled fields; secondary contact actions sit in a disclosure. A selected mission shows a clear Telegram draft/chooser action. Outgoing links open another tab so the website remains available. Copy explicitly says the conversation opens in Telegram; no imitation inbox or fabricated unread counts. Errors retain typed input; failed storage reports that contacts last only for the visit.

Desktop uses a left rail; narrow screens use five bottom items with safe-area spacing and one-column cards. Native dialogs manage modal focus; reduced-motion rules and browser zoom remain available. Responsive CSS and event tests are not proof of actual browser/device layout. See [testing](testing.md) for observed evidence.

Review when core flow, contrast, layout or accessibility changes. [HTML](../public/index.html), [styles](../public/style.css), [events](../public/app.mjs).

Android 0.4.0 keeps the existing readable palette and font sizes, rounds cards/controls and uses a single open-door mark. Navigation icons use a consistent 2px stroke. The primary surprise button is at least 64px; the mobile header carries the small product mark. No extra promotional home panels are added. The diary count includes distinct roles calculated from real completed entries. Native text follows increased Android font scale; system/keyboard insets are handled by the host. Back dismisses dialogs, then returns home, then exits. Browser/app storage wording and installation help depend on the actual native bridge. [Android contract](android.md).
