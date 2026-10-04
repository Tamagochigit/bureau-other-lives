# Social API

Follow [root](../AGENTS.md), [chat access](../rules/02-chat-access.md) and [operations](../docs/operations.md).

social.mjs owns request identity, body limits, invites, friends, messages and read/block state. Keep all SQL bound; authorise against the stored friendship. Add meaningful access/race/retry tests in tests/social.test.mjs when changing that boundary. Do not import diary state or persist visitor email.
