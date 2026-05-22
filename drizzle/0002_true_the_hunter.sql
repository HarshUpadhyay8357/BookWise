ALTER TABLE "users" ALTER COLUMN "last_activity_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_activity_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_reminder_sent" SET DATA TYPE timestamp with time zone;