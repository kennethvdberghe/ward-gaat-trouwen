CREATE TABLE `guest` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`invite_id` text NOT NULL,
	FOREIGN KEY (`invite_id`) REFERENCES `invites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invites` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invites_code_unique` ON `invites` (`code`);