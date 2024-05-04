CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(30) NOT NULL,
	"firstname" varchar(30),
	"lastname" varchar(30),
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "website" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"url" varchar(256) NOT NULL,
	"workspace_name" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"name" varchar(30) PRIMARY KEY NOT NULL,
	"access_code" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_name" varchar NOT NULL,
	"username" varchar NOT NULL,
	"role" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "website" ADD CONSTRAINT "website_workspace_name_workspaces_name_fk" FOREIGN KEY ("workspace_name") REFERENCES "workspaces"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "website" ADD CONSTRAINT "website_created_by_users_username_fk" FOREIGN KEY ("created_by") REFERENCES "users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_workspace_name_workspaces_name_fk" FOREIGN KEY ("workspace_name") REFERENCES "workspaces"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces_users" ADD CONSTRAINT "workspaces_users_username_users_username_fk" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
