CREATE TABLE `guest` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`invite_id` text,
	FOREIGN KEY (`invite_id`) REFERENCES `invites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invites` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text
);
