# Dependencies

Current package.json has zero runtime/development dependencies. Node built-ins provide syntax checks, tests, build and the local static preview server. The browser uses native modules, dialogs, storage and ordinary HTTPS links; no downloaded messenger SDK, bot or remote font is needed.

On 2026-10-05 the unused framework/auth/database starter and its package payload were removed because the owner requested a standalone GitHub product using an existing messenger. The lockfile now contains only the root package. This reverses the historical starter choice; its reasons/receipts remain in decisions and changes.

Universal sharing uses native platform APIs rather than a provider SDK: [Android Sharesheet](https://developer.android.com/training/sharing/send) and [W3C Web Share](https://www.w3.org/TR/web-share/). Clipboard/selectable text is the fallback. Telegram credentials, usernames, account verification, recipient lookup and message-send APIs are unnecessary. The retired Telegram default remains only in historical receipts.

GitHub's checkout/setup-node and Pages artifact/configure/deploy actions provide CI hosting; workflow permissions remain source-read plus deployment-only pages-write/id-token-write. Workflow publication is distinct from npm dependencies. No new recurring service procedure needs a skill beyond the canonical operations guide. Review when a package, host, SDK or messenger contract changes. [Stack](stack.md), [decision](decisions.md).

Android dependencies are separate from the zero-dependency Node/browser package: JDK 17, Gradle 8.13 (distribution checksum), AGP 8.13.2, API/build-tools 36 and AndroidX WebKit 1.17.1 and Activity 1.12.4. WebKit supplies the maintained HTTPS asset loader and origin-restricted message listener. Native Android framework APIs supply the file picker, dialogs, Back and system insets. No payment/messenger SDK is installed. [Android](android.md) gives primary version/compatibility sources and upgrade/rebuild steps.
