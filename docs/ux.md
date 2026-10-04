# UX

Direction: a quiet notebook, warm paper, dark ink and one dark orange primary action. The owner reported small, pale text and too much noise on 2026-10-04. Readability takes precedence over decoration; illustrations, slogans, duplicate headers and home statistics were removed rather than enlarged.

The home view offers time and place using the existing mission filters, then one primary action. If a mission is active, continuing it takes priority. Catalog filters sit in a native disclosure; selected filters remain visible on render. All five sections stay reachable, with shorter navigation labels. No recommendation learning, multi-part journeys or new compass measures belong to this change.

Body text and main buttons use 1.125rem (18 px at the default 16 px browser base), secondary text uses 1rem, and the narrow navigation uses .875rem. Font sizes never shrink at narrower breakpoints. Controls are 48–56 px high, with visible keyboard focus. Text uses opaque dark colours, including placeholders and completed steps. Numeric contrast checks are evidence about declared colours, not a full accessibility certification.

Each mission has a visible time, place, small result and three steps. Completing an adapted or partial experience is allowed. Empty diary and compass views explicitly show that no experience has been recorded; sample ratings would misrepresent the user.

Desktop navigation stays in the left rail. On narrow screens the same five views move to a fixed bottom bar, with safe-area padding. Cards use one column on narrow screens; dialogs present the instructions without a large illustration. Native dialogs manage modal focus; motion reduces when the user requests reduced motion. Search/filter fields have labels and rating options use a required radio group. Browser zoom remains available.

No layout screenshots were available in this environment. Responsive CSS exists but visual and device acceptance must be distinguished from event tests.

Review when core flow, layout, contrast or accessibility behaviour changes. Code: [HTML](../dist/index.html), [styles](../dist/style.css), [events](../dist/app.mjs).
