import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

export const socialUsers = sqliteTable('social_users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
});
export const socialInvites = sqliteTable('social_invites', {
  tokenHash: text('token_hash').primaryKey(),
  createdBy: text('created_by').notNull().references(() => socialUsers.id),
  createdAt: integer('created_at').notNull(),
  expiresAt: integer('expires_at').notNull(),
  claimedBy: text('claimed_by').references(() => socialUsers.id),
  claimedAt: integer('claimed_at'),
}, t => [index('social_invites_owner_time').on(t.createdBy, t.createdAt)]);
export const socialFriendships = sqliteTable('social_friendships', {
  id: text('id').primaryKey(),
  leftId: text('left_id').notNull().references(() => socialUsers.id),
  rightId: text('right_id').notNull().references(() => socialUsers.id),
  createdAt: integer('created_at').notNull(),
  leftRead: integer('left_read').notNull().default(0),
  rightRead: integer('right_read').notNull().default(0),
  blockedBy: text('blocked_by').references(() => socialUsers.id),
}, t => [uniqueIndex('social_friendships_pair').on(t.leftId, t.rightId), index('social_friendships_left').on(t.leftId), index('social_friendships_right').on(t.rightId)]);
export const socialMessages = sqliteTable('social_messages', {
  seq: integer('seq').primaryKey({autoIncrement:true}),
  friendshipId: text('friendship_id').notNull().references(() => socialFriendships.id),
  senderId: text('sender_id').notNull().references(() => socialUsers.id),
  clientId: text('client_id').notNull(),
  body: text('body').notNull(),
  missionId: text('mission_id'),
  missionTitle: text('mission_title'),
  createdAt: integer('created_at').notNull(),
}, t => [uniqueIndex('social_message_retry').on(t.friendshipId, t.senderId, t.clientId), index('social_message_thread').on(t.friendshipId, t.seq), index('social_message_sender_time').on(t.senderId, t.createdAt)]);
