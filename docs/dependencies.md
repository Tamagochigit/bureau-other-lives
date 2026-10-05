# Dependencies

Current package.json has zero runtime/development dependencies. Node built-ins provide syntax checks, tests, build and the local static preview server. The browser uses native modules, dialogs, storage and ordinary HTTPS links; no downloaded messenger SDK, bot or remote font is needed.

On 2026-10-05 the unused framework/auth/database starter and its package payload were removed because the owner requested a standalone GitHub product using an existing messenger. The lockfile now contains only the root package. This reverses the historical starter choice; its reasons/receipts remain in decisions and changes.

Telegram links use primary documentation: [public username/draft links](https://core.telegram.org/api/links#public-username-links) and [share button](https://core.telegram.org/widgets/share). A username link can target a user, group or channel; Telegram resolves it. The application does not verify identities. No Telegram API credentials, login widget or message-send API is involved.

GitHub's checkout/setup-node and Pages artifact/configure/deploy actions provide CI hosting; workflow permissions remain source-read plus deployment-only pages-write/id-token-write. Workflow publication is distinct from npm dependencies. No new recurring service procedure needs a skill beyond the canonical operations guide. Review when a package, host, SDK or messenger contract changes. [Stack](stack.md), [decision](decisions.md).
