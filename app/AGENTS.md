# Server routes

Follow [root](../AGENTS.md), [architecture](../docs/architecture.md) and [chat access](../rules/02-chat-access.md).

The root route serves the existing browser shell; the social catch-all delegates to server/social.mjs with Cloudflare bindings. Preserve same-origin/no-store responses and Sites identity. Framework/hosting integration belongs to the supported Sites starter, not ad-hoc route glue.
