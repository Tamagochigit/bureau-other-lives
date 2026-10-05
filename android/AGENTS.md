# Android module

Read the [root router](../AGENTS.md), [Android runtime/build/data contract](../docs/android.md), [UX](../docs/ux.md) and [Android boundary rule](../rules/04-android-boundary.md). Browser source is shared; never add a second diary schema or remote app loader.

The exact appassets origin and main-frame check guard the native file/Telegram protocol. No Internet/storage/contact permission, JavaScript interface or arbitrary URL/command. JSON import still uses core validation. Keep keys/passwords and local.properties out of Git; versionCode must increase for compatible updates. Rebuild assets before Gradle; an unsigned CI artifact is not installable.

Verification: node scripts/verify.mjs; node scripts/build-android-assets.mjs; ./gradlew assembleRelease lintRelease from this directory; device/emulator smoke as described in testing. Record actual result and limits. Store publishing/billing is separate from producing this direct-install pilot.

Use [application module router](app/AGENTS.md) for host/test entry points.
