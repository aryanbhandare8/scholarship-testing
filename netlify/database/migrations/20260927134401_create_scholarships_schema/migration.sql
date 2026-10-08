CREATE TABLE "applications" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"scholarship_id" text NOT NULL,
	"status" text DEFAULT 'Applied' NOT NULL,
	"notes" text,
	"applied_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_scholarships" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"scholarship_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scholarships" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"provider_id" text,
	"provider_name" text NOT NULL,
	"provider_logo" text,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"amount_formatted" text NOT NULL,
	"education_level" jsonb DEFAULT '[]' NOT NULL,
	"courses" jsonb DEFAULT '[]' NOT NULL,
	"states" jsonb DEFAULT '[]' NOT NULL,
	"category" text NOT NULL,
	"minimum_income" integer,
	"maximum_income" integer,
	"minimum_score" integer,
	"eligible_categories" jsonb DEFAULT '[]' NOT NULL,
	"eligible_gender" text DEFAULT 'All' NOT NULL,
	"deadline" text NOT NULL,
	"deadline_display" text NOT NULL,
	"days_left_text" text NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"application_url" text NOT NULL,
	"eligibility" text NOT NULL,
	"benefits" jsonb DEFAULT '[]' NOT NULL,
	"required_documents" jsonb DEFAULT '[]' NOT NULL,
	"selection_process" jsonb DEFAULT '[]' NOT NULL,
	"verified" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "student_form_submissions" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"age" integer,
	"state" text,
	"city" text,
	"education_level" text,
	"institution" text,
	"course" text,
	"year" text,
	"academic_score" integer,
	"annual_income" integer,
	"category" text,
	"gender" text,
	"disability_status" boolean DEFAULT false,
	"preferences" jsonb DEFAULT '{}',
	"matched_scholarships_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"education_level" text,
	"institution" text,
	"course" text,
	"year" text,
	"state" text,
	"city" text,
	"category" text,
	"gender" text,
	"annual_income" integer,
	"academic_score" integer,
	"disability_status" boolean DEFAULT false,
	"preferences" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
