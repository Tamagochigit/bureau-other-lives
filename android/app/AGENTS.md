# Android application module

Follow [Android router](../AGENTS.md), [root router](../../AGENTS.md) and [runtime/recovery/signing contract](../../docs/android.md). [MainActivity](src/main/java/ru/bureau/otherlives/MainActivity.java) owns the packaged origin, narrow native actions, system file picker, modern Back dispatcher and insets. [OfflineSmokeTest](src/androidTest/java/ru/bureau/otherlives/OfflineSmokeTest.java) exercises a real WebView. Shared UI/diary source stays in public; do not fork it here.

Build from android with ./gradlew assembleRelease lintRelease after regenerating assets from the root. Use the external private key, locked/verified dependencies and a higher versionCode for updates. [Android rule](../../rules/04-android-boundary.md) guards permissions/destinations/data. No remote app content, new data upload or billing belongs in the current pilot. Record observed device checks in [testing](../../docs/testing.md).
