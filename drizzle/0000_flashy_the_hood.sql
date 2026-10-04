CREATE TABLE `social_friendships` (
	`id` text PRIMARY KEY NOT NULL,
	`left_id` text NOT NULL,
	`right_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`left_read` integer DEFAULT 0 NOT NULL,
	`right_read` integer DEFAULT 0 NOT NULL,
	`blocked_by` text,
	FOREIGN KEY (`left_id`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`right_id`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`blocked_by`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_friendships_pair` ON `social_friendships` (`left_id`,`right_id`);--> statement-breakpoint
CREATE INDEX `social_friendships_left` ON `social_friendships` (`left_id`);--> statement-breakpoint
CREATE INDEX `social_friendships_right` ON `social_friendships` (`right_id`);--> statement-breakpoint
CREATE TABLE `social_invites` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`claimed_by` text,
	`claimed_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`claimed_by`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `social_invites_owner_time` ON `social_invites` (`created_by`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_messages` (
	`seq` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`friendship_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`client_id` text NOT NULL,
	`body` text NOT NULL,
	`mission_id` text,
	`mission_title` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`friendship_id`) REFERENCES `social_friendships`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `social_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `social_message_retry` ON `social_messages` (`friendship_id`,`sender_id`,`client_id`);--> statement-breakpoint
CREATE INDEX `social_message_thread` ON `social_messages` (`friendship_id`,`seq`);--> statement-breakpoint
CREATE INDEX `social_message_sender_time` ON `social_messages` (`sender_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `social_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
