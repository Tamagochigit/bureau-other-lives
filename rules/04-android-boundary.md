# Android runtime and recovery boundary

Owner request: standalone APK, 2026-10-05. Keep the authored application inside the APK at one HTTPS asset origin; expose only explicit backup/restore and fixed Telegram link actions. Preserve the existing diary schema and make backup success truthful. Never publish the signing key/passwords.

## Enforcement

MainActivity uses WebViewAssetLoader, blocks network/file/content access, has no runtime permissions, checks exact origin and main frame for the WebMessageListener, bounds file bytes and delegates only validated HTTPS t.me destinations. Browser bridge imports through existing core validation. .gitignore excludes signing materials; the signing helper uses password files and verifies signatures. Build/version declarations live in `android/app/build.gradle`. Executable checks: `tests/android.test.mjs`, `android/app/src/androidTest/java/ru/bureau/otherlives/OfflineSmokeTest.java`, `scripts/sign-android.mjs` and `.github/workflows/android.yml`.

Verification: Node bridge/diary tests and real WebView OfflineSmokeTest; Android lint/build and apksigner verification. Actual runs and remaining device limits belong to docs/testing.md. Review when a native capability, provider, origin, package/key or permission changes. A configured billing service requires a new contract; this release contains no payment implementation.
