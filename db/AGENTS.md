# Database schema

Follow [root](../AGENTS.md) and [operations](../docs/operations.md).

schema.ts is the chat schema. Generate new immutable schema-only Drizzle migrations, inspect them and commit the journal/snapshot with SQL. Keep the browser diary independent. Sites owns applying hosted migrations; requests do not create tables.
