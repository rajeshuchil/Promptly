CREATE TABLE "project_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"revision_number" integer NOT NULL,
	"prompt" text NOT NULL,
	"plan" jsonb NOT NULL,
	"html" text NOT NULL,
	"css" text,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"event_metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "projects_deployment_state_idx";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "deployment_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "deployment_timestamp" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_timeline_events" ADD CONSTRAINT "project_timeline_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_timeline_events" ADD CONSTRAINT "project_timeline_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "revisions_project_id_idx" ON "project_revisions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "revisions_created_at_idx" ON "project_revisions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "timeline_project_id_idx" ON "project_timeline_events" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "timeline_created_at_idx" ON "project_timeline_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "projects_deployment_state_idx" ON "projects" USING btree ("deployment_state");