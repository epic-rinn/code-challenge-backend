CREATE TABLE `birds` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`species` text,
	`habitat` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
