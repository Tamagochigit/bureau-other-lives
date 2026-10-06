# Android application

Version 0.4.1/code 5 is the current signed direct-install candidate for Android 8+ (API 26); target/compile API 36. It uses the same authored catalog and diary schema as the website. The package is `ru.bureau.otherlives`; the debug package has `.debug`. The owner requested an APK and suitable design on 2026-10-05. The optional audience/distribution questions had no answer: adults seeking new experiences and direct-install testing are documented defaults, not owner answers. No store release was requested or submitted.

## Runtime and data

[MainActivity](../android/app/src/main/java/ru/bureau/otherlives/MainActivity.java) displays the packaged static build through AndroidX WebKit 1.17.1 `WebViewAssetLoader` at the exact origin `https://appassets.androidplatform.net/assets/`. It never downloads the application from the website. No Internet, location, contacts, camera or broad storage permission is requested. AndroidX adds a signature-only internal dynamic-receiver permission in the merged manifest; it has no user prompt or data-access capability. File/content access, network loads, cleartext and mixed content are blocked. Only main-frame messages from the exact packaged origin reach the narrowly scoped file/Telegram bridge; no JavaScript interface or arbitrary native command is exposed.

Diary/contacts stay in this app's WebView data. Browser and APK storage are separate. Transfer an existing diary: website settings → save JSON → APK settings → restore that file. Contacts are separate and are not in the diary backup. Android automatic application backup is disabled; JSON recovery is explicit. Uninstalling/clearing application data removes local records, so export before doing either. Ordinary signed updates preserve application data.

[Browser bridge](../public/android.mjs) uses the native channel only when present. Export uses `ACTION_CREATE_DOCUMENT`; import uses `ACTION_OPEN_DOCUMENT`. File work happens outside the UI thread; the native and browser limits are 32 MB. Core validation/merge still decides which records can enter the diary. Cancellation does not change records; success is reported after writing completes. Process death during the picker requires restarting the operation. Telegram destinations are fixed HTTPS `t.me` links, opened via the installed messenger/browser after a click; no conversation or recipient lookup occurs inside the product.

Android Back closes the current dialog, returns another view to home, then leaves the activity. AndroidX Back dispatch covers older button navigation and modern predictive gestures. System-bar/keyboard insets keep controls visible. Font scale increases text zoom (100–200%); system zoom and actual devices remain acceptance surfaces. The installed Android System WebView must support WebMessageListener; an explicit update notice replaces a broken bridge on unsupported old providers.

## Install and update

Download [the signed APK](https://github.com/Tamagochigit/bureau-other-lives/raw/refs/heads/main/downloads/bureau-0.4.1.apk) on the phone and open it from Downloads. If Android asks, permit installation for the specific browser/file-manager used to open this file, then install «Бюро других жизней». No account is required. The source-specific installation permission can be disabled afterward. Keep Android System WebView current.

An update installs over the existing product package; use the same signing key and increase versionCode. The debug package is separate. Do not uninstall to update; export the diary before uninstalling or clearing data. The release is a direct-install pilot, not a store submission or a promise that every supported device was tested.

## Build and signing

Install Node 24, JDK 17, Android SDK `platforms;android-36` and `build-tools;36.0.0`. Set `ANDROID_HOME` or create ignored `android/local.properties` with `sdk.dir=...`.

```bash
node scripts/build-android-assets.mjs
cd android
./gradlew assembleRelease lintRelease --no-daemon
```

Gradle 8.13 is checked by its distribution SHA-256; AGP is pinned to 8.13.2. Resolved dependencies are locked in app/gradle.lockfile and verified by gradle/verification-metadata.xml; updates require reviewing regenerated inputs. AndroidX Activity supplies the modern Back dispatcher. The assets directory is generated; rebuild it after every browser change. CI builds the unsigned release and does not hold a private key. Its unsigned artifact cannot be installed until signed. The debug build is a separate package for tests, not an update to the pilot.

SDK setup explicitly requests only `platform-tools`; the action supplies command-line tools separately. Do not restore its old implicit `tools` package, which Google no longer serves. The first CI attempt failed in SDK setup before compiling; the narrow workflow correction changes no APK bytes. [Action documentation](https://github.com/android-actions/setup-android/blob/main/README.md), [testing evidence](testing.md).

Keep the product signing key and its passwords outside Git. The private recovery archive created for this pilot is necessary for compatible future updates; never publish it. Release signing accepts passwords from files, not shell arguments:

```bash
node scripts/sign-android.mjs --input android/app/build/outputs/apk/release/app-release-unsigned.apk --output /absolute/path/bureau-0.4.1.apk --sdk /absolute/path/android-sdk --keystore /private/path/bureau.jks --store-pass-file /private/path/store.password --key-pass-file /private/path/key.password
```

The helper aligns first, signs and verifies the result. Key alias is `bureau`. Increase `versionCode` for the next release and use the same package/key. [Operations](operations.md) owns publication; [testing](testing.md) owns observed evidence. No paid service, billing credential or store account was configured.

## Verification

```bash
node scripts/verify.mjs
node scripts/build-android-assets.mjs
cd android
./gradlew assembleDebug assembleDebugAndroidTest connectedDebugAndroidTest
```

[OfflineSmokeTest](../android/app/src/androidTest/java/ru/bureau/otherlives/OfflineSmokeTest.java) exercises the real WebView: offline start, mission → reflection → diary, reload persistence, native settings, back behaviour and destination/origin boundaries. Node tests cover the bridge protocol and browser fallback. The system file picker requires additional export/import acceptance. Review [testing](testing.md) for which checks ran, rather than assuming a declared test passed.

References: [packaged local content](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content), [document storage](https://developer.android.com/training/data-storage/shared/documents-files), [WebKit release](https://developer.android.com/jetpack/androidx/releases/webkit), [AGP compatibility](https://developer.android.com/build/releases/agp-8-13-0-release-notes), [APK signing](https://developer.android.com/tools/apksigner). Review when Android APIs, package/key, data origin, runtime permissions or distribution changes.

Current signed candidate: 0.4.1/code 5, full app label Бюро других жизней for [RuStore preparation](rustore.md). Verified v2/v3 signature and unchanged certificate/package; unsigned release bytes match across e8eaecb, 2def6e5 and b9e5a7e builds. All three Android35 instrumentation cases passed in run37500968161. This covers offline mission/diary/reload/Back and origin/destination boundaries; physical-phone system picker/Telegram and store moderation are still separate. The previous0.4.0 remains available for history. Package/key/schema/offline boundaries are unchanged.
