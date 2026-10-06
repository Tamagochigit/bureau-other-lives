# RuStore preparation

Owner request, 2026-10-06: screenshots, icon, name, short/full description for later RuStore publication. This authorises preparation; it is not a store submission. No account was opened, listing published or payment configured.

## Listing and actual functions

Chosen name: **Бюро других жизней** (18 characters). Candidate Android 0.4.1/code 5 uses the same full application label; earlier 0.4.0 was only Бюро. Keep the package/private key for compatible updates. RuStore name uniqueness is not yet verified.

Short description: **Маленькие приключения, новые роли и личный дневник открытий**.

The planned owner-facing pack will contain complete Russian copy, metadata, an opaque icon and five numbered phone PNGs: home, catalog, a mission, diary and compass. Copy covers authored missions/traditions, ratings/notes, favourites, optional Telegram links, local records and file backup. No AI, automatic messages, cloud sync, paid catalog, subscription, rewards, health benefit or demand claim is added. Future revenue remains in [monetization](monetization.md).

Suggested category: Образ жизни, based on the store hobby category. The current catalog has no violence, swearing, sexual content, drugs or alcohol; 0+ is a proposed content rating, not a child-targeting claim. Owner confirms rating/uniqueness in the console. Existing public website can fill the developer-contact website field; no email/legal identity is invented.

## Media and provenance

Official guidance checked 2026-10-06: title/short/full limits 30/80/4000 characters; icon 512×512 PNG/JPG, at most 3 MB and opaque edges; at least three phone images, consistent portrait orientation, PNG/JPG at most 3 MB, maximum 2160×3840. Five captures are 1080×1920 (9:16). The publication guide takes precedence over an ASO article that currently says 50 title characters.

[StoreScreenshotsTest](../android/app/src/androidTest/java/ru/bureau/otherlives/StoreScreenshotsTest.java) captures actual Android window pixels with PixelCopy. The real emulator display is resized until its app viewport is 1080×1920: system bars excluded without repainting/stretching UI. Android exports the actual launcher foreground onto its opaque background; no new logo or invented screenshot.

The separate debug package is checked before its storage is reset. Three notes explicitly marked Пример are created through mission/step/reflection handlers; compass values derive from them. No owner diary, contact or real recipient is used. No messages are sent. Debug/provider differences and its separate signature are not release-signature proof.

Run the Android workflow with capture_store_assets=true, or a commit tagged [store-assets]. It assembles/lints release, builds tests, starts KVM Android 35, requires all three instrumentation tests/five PNGs, and uploads bureau-rustore-capture with unsigned candidate and source SHA. [Capture script](../scripts/capture-android-store.sh), [Android procedure](android.md). Download/inspect each image, verify dimensions and sign locally with the recovered private key. Never send the key to CI or include it in the media pack. System file-picker acceptance is separate.

Actual results live in [testing](testing.md) and [changes](changes.md). A declared test or draft is not a passed capture or approved moderation. Review when catalog/copy, icon/label, package/version/key, capture method, store rules or data practices change.

References: [publication](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/app-publication), [moderation](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/requirement-apps), [categories](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/app-publication/new-version-app/category), [content rating](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/app-publication/new-version-app/age-restrictions).

## Before submission

The store data/privacy fields must reflect local diary/ratings/contacts and explicit file/Telegram actions, not a blanket no-data claim. The prepared kit includes an explicitly labelled policy draft, but developer identity/contact and a published policy accessible from the listing and app remain owner/release work. Official moderation section 5.1 applies when personal data are collected or processed; local operation alone is not asserted as an exemption. No legal identity, contact or compliance approval is invented.

Capture location is explicit ANDROID_AVD_HOME plus create --path; the script checks INI/list discovery before launch. Run 37495734206 built/linted candidate and tests but emulator could not find the default AVD, so capture/runtime proof is absent for that run. Retry success is recorded separately.

Run 37497094011/source e8eaecb launched Android35 and installed both APKs. Origin/destination test passed; mission dialog assertion and 1920-vs-1776 viewport setup failed, so no captures/native acceptance were claimed. Artifact11428770892 (ZIP SHA25632dbefcb522eaf84c3d0ac8d4dcacd86b8f423590b0c2431ca590898f64c45c9) retains unsigned build/diagnostics. Follow-up knowledge delta: these three docs, failure ledger/index and generated brief/wiki; code delta only instrumentation setup and diagnostic script. Await a new-document marker after reload and derive actual display adjustment from wm override, preserving every existing behaviour/pixel assertion. No production runtime/schema/permission/key/version change; retry must confirm the diagnosis.

Run37498592979/2def6e5 remained red: fresh-document fix advanced through mission start; logcat proved invalid unquoted numeric rating selector. Exact capture still measured1776px; physical AVD default320×640 and actual override1080×1920 show resize requests did not create the intended display. Diagnosticartifact11427854986/ZIPd6e927242be28c151fccea1e6497ab8fb6ebb9e07c9f5064499a6fe5269620cd. Fourth setup delta: quote selectors in both native tests and configure physical LCD1080×2064/density480 before boot, reset wm overrides; no production runtime change and no relaxed assertion. Knowledge delta: these three docs and recurring failure/index/brief/wiki. Signed0.4.1 candidate verified v2/v3, full label/package/code5/min26/target36 and old certificate; native/SAF acceptance still pending. Initial asset check expected .mjs, but Android build intentionally emits .js; corrected inspection compares generated Pages bytes. Unsigned SHA7d68fab8cad78fd5bb9ad4665faf37a86150a2a675a4e9d65ca93d4d26c4f677 is identical across e8eaecb/2def6e5.

The fixture also awaits the rendered #page-label after changing views, not merely the URL fragment; this prevents capture actions from racing the hash handler. The recurring-failure decision retains the existing native gate/procedure without adding a duplicate rule or skill.
