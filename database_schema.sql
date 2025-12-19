-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
                               id uuid NOT NULL DEFAULT gen_random_uuid(),
                               user_id uuid NOT NULL UNIQUE,
                               created_at timestamp with time zone DEFAULT now(),
                               CONSTRAINT admins_pkey PRIMARY KEY (id),
                               CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.b2b_clients (
                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                    company_name text NOT NULL,
                                    full_name text NOT NULL,
                                    email text NOT NULL UNIQUE,
                                    created_at timestamp with time zone DEFAULT now(),
                                    updated_at timestamp with time zone DEFAULT now(),
                                    CONSTRAINT b2b_clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.jobs (
                             id uuid NOT NULL DEFAULT gen_random_uuid(),
                             client_id uuid,
                             title text NOT NULL,
                             description text NOT NULL,
                             property_address text NOT NULL,
                             property_postcode text,
                             property_latitude numeric,
                             property_longitude numeric,
                             urgency text NOT NULL,
                             preferred_date date,
                             status text DEFAULT 'pending'::text,
                             assigned_worker_id uuid,
                             assigned_at timestamp with time zone,
                             completed_at timestamp with time zone,
                             created_at timestamp with time zone DEFAULT now(),
                             updated_at timestamp with time zone DEFAULT now(),
                             CONSTRAINT jobs_pkey PRIMARY KEY (id),
                             CONSTRAINT jobs_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.b2b_clients(id),
                             CONSTRAINT jobs_assigned_worker_id_fkey FOREIGN KEY (assigned_worker_id) REFERENCES public.workers(id)
);
CREATE TABLE public.worker_ai_profiles (
                                           id uuid NOT NULL DEFAULT gen_random_uuid(),
                                           worker_id uuid UNIQUE,
                                           interview_completed boolean DEFAULT false,
                                           interview_transcript jsonb,
                                           common_jobs jsonb,
                                           pricing_factors jsonb,
                                           training_examples jsonb,
                                           preferred_job_types ARRAY,
                                           avoided_job_types ARRAY,
                                           working_hours jsonb,
                                           last_updated timestamp with time zone DEFAULT now(),
                                           created_at timestamp with time zone DEFAULT now(),
                                           CONSTRAINT worker_ai_profiles_pkey PRIMARY KEY (id),
                                           CONSTRAINT worker_ai_profiles_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id)
);
CREATE TABLE public.worker_matches (
                                       id uuid NOT NULL DEFAULT gen_random_uuid(),
                                       job_id uuid,
                                       worker_id uuid,
                                       match_score numeric,
                                       reasoning text,
                                       estimated_hours numeric,
                                       estimated_days numeric,
                                       pricing_method text,
                                       base_cost numeric,
                                       travel_cost numeric,
                                       total_cost numeric,
                                       cost_breakdown jsonb,
                                       status text DEFAULT 'suggested'::text,
                                       created_at timestamp with time zone DEFAULT now(),
                                       CONSTRAINT worker_matches_pkey PRIMARY KEY (id),
                                       CONSTRAINT worker_matches_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id),
                                       CONSTRAINT worker_matches_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.workers(id)
);
CREATE TABLE public.worker_waitlist (
                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                        full_name text NOT NULL,
                                        email text NOT NULL UNIQUE,
                                        phone text,
                                        trade_type text NOT NULL,
                                        postcode text NOT NULL,
                                        referral_source text,
                                        created_at timestamp without time zone DEFAULT now(),
                                        status text DEFAULT 'waitlist'::text,
                                        notes text,
                                        CONSTRAINT worker_waitlist_pkey PRIMARY KEY (id)
);
CREATE TABLE public.workers (
                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                full_name text NOT NULL,
                                email text NOT NULL UNIQUE,
                                phone text,
                                trade_type text NOT NULL,
                                day_rate numeric,
                                hourly_rate numeric,
                                base_postcode text,
                                base_latitude numeric,
                                base_longitude numeric,
                                service_radius_miles numeric,
                                travel_fee_per_mile numeric,
                                certifications jsonb,
                                status text DEFAULT 'pending'::text,
                                user_id uuid UNIQUE,
                                created_at timestamp with time zone DEFAULT now(),
                                updated_at timestamp with time zone DEFAULT now(),
                                CONSTRAINT workers_pkey PRIMARY KEY (id)
);