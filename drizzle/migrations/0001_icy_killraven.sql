ALTER TABLE "usage_logs" ADD COLUMN "prompt_tokens" integer;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD COLUMN "completion_tokens" integer;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD COLUMN "total_tokens" integer;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD COLUMN "estimated_cost" double precision;