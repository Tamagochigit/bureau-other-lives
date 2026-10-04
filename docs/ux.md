# UX

Direction: a quiet notebook, warm paper, dark ink and one dark orange primary action. The owner reported small, pale text and too much noise on 2026-10-04. Readability takes precedence over decoration; illustrations, slogans, duplicate headers and home statistics were removed rather than enlarged.

The home view offers time and place using the existing mission filters, then one primary action. If a mission is active, continuing it takes priority. Catalog filters sit in a native disclosure; selected filters remain visible on render. Primary navigation remains five items: home, missions, friends, compass and diary. Traditions remain reachable from the catalog. No recommendation learning, multi-part journeys or new compass measures belong to this change.

Body text and main buttons use 1.125rem (18 px at the default 16 px browser base), secondary text uses 1rem, and the narrow navigation uses .875rem. Font sizes never shrink at narrower breakpoints. Controls are 48–56 px high, with visible keyboard focus. Text uses opaque dark colours, including placeholders and completed steps. Numeric contrast checks are evidence about declared colours, not a full accessibility certification.

Each mission has a visible time, place, small result and three steps. Completing an adapted or partial experience is allowed. Empty diary and compass views explicitly show that no experience has been recorded; sample ratings would misrepresent the user.

Desktop navigation stays in the left rail. On narrow screens these five primary views move to a fixed bottom bar, with safe-area padding. Cards use one column on narrow screens; dialogs present the instructions without a large illustration. Native dialogs manage modal focus; motion reduces when the user requests reduced motion. Search/filter fields have labels and rating options use a required radio group. Browser zoom remains available.

No layout screenshots were available in this environment. Responsive CSS exists but visual and device acceptance must be distinguished from event tests.

Review when core flow, layout, contrast or accessibility behaviour changes. Code: [HTML](../public/index.html), [styles](../public/style.css), [events](../public/app.mjs).

The friends view begins with an invitation action and conversation list. Names/messages inherit large dark body text; timestamps and hints remain 16 px. A chosen conversation has a labeled message field and one send action; block options are in a native disclosure. Drafts remain per friend in tab memory and are retained after network failure; idempotent retries avoid duplicate messages. No images, feed or online-status widgets were added.

On Pages, the friends view instead has one prominent «Открыть личные чаты» action, a brief sign-in/access explanation and the selected mission when relevant. The protected chat view keeps the conversation UI and a return-to-main-site link. A forwarded mission is prepared, never sent automatically. Settings explain the old-address diary export and new-address restore; the home start and typography stay unchanged.
