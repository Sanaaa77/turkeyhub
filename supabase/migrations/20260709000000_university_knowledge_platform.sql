-- Production-grade University Knowledge Platform schema extension.
-- All university content is normalized, sourceable, verifiable, and incrementally syncable.

create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- Shared enums are modeled as constrained text to remain compatible with existing seed data.

alter table public.universities
  add column if not exists legal_name text,
  add column if not exists overview text,
  add column if not exists history text,
  add column if not exists video_url text,
  add column if not exists transportation text,
  add column if not exists international_students text,
  add column if not exists student_life text,
  add column if not exists application_process text,
  add column if not exists publication_status text default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  add column if not exists verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  add column if not exists data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  add column if not exists source_id uuid,
  add column if not exists last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

create unique index if not exists universities_slug_unique_idx on public.universities (lower(slug));
create unique index if not exists universities_name_city_unique_idx on public.universities (lower(name), coalesce(city_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists universities_search_trgm_idx on public.universities using gin ((name || ' ' || coalesce(legal_name, '') || ' ' || coalesce(slug, '')) gin_trgm_ops);
create index if not exists universities_quality_idx on public.universities (publication_status, verification_status, data_completeness_score);

alter table public.programs
  add column if not exists slug text,
  add column if not exists degree_id uuid,
  add column if not exists faculty_id uuid,
  add column if not exists credits integer,
  add column if not exists curriculum jsonb default '[]'::jsonb,
  add column if not exists required_gpa numeric(4,2),
  add column if not exists required_ielts numeric(3,1),
  add column if not exists required_toefl integer,
  add column if not exists required_tomer text,
  add column if not exists portfolio_required boolean default false,
  add column if not exists interview_required boolean default false,
  add column if not exists scholarship_available boolean default false,
  add column if not exists career_opportunities text[],
  add column if not exists application_status text default 'open' check (application_status in ('open', 'closed', 'opening_soon', 'rolling', 'unknown')),
  add column if not exists verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  add column if not exists data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  add column if not exists source_id uuid,
  add column if not exists last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

create unique index if not exists programs_university_slug_unique_idx on public.programs (university_id, lower(coalesce(slug, name)));
create index if not exists programs_filter_idx on public.programs (university_id, degree_level, language, tuition_fee, application_status);
create index if not exists programs_requirements_idx on public.programs (required_gpa, required_ielts, required_toefl);
create index if not exists programs_search_trgm_idx on public.programs using gin ((name || ' ' || coalesce(faculty, '') || ' ' || coalesce(degree_level, '')) gin_trgm_ops);

create table if not exists public.source_metadata (
  id uuid default uuid_generate_v4() primary key,
  source_type text not null check (source_type in ('official_api', 'csv', 'json', 'excel', 'admin_upload', 'website', 'manual')),
  name text not null,
  url text,
  api_endpoint text,
  file_url text,
  license text,
  reliability_score numeric(5,2) default 0 check (reliability_score >= 0 and reliability_score <= 100),
  checksum text,
  imported_by uuid references public.profiles(id) on delete set null,
  imported_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_checked_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.universities add constraint universities_source_fk foreign key (source_id) references public.source_metadata(id) on delete set null;
alter table public.programs add constraint programs_source_fk foreign key (source_id) references public.source_metadata(id) on delete set null;

create table if not exists public.degrees (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  level text not null,
  sort_order integer default 0,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.campuses (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  city_id uuid references public.cities(id) on delete set null,
  name text not null,
  slug text not null,
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  description text,
  image_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, slug)
);

create table if not exists public.faculties (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  website_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, slug)
);

alter table public.programs add constraint programs_degree_fk foreign key (degree_id) references public.degrees(id) on delete set null;
alter table public.programs add constraint programs_faculty_fk foreign key (faculty_id) references public.faculties(id) on delete set null;

create table if not exists public.tuition_fees (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  academic_year text not null,
  student_category text default 'international',
  amount numeric not null check (amount >= 0),
  currency text default 'USD',
  fee_type text default 'annual' check (fee_type in ('annual', 'semester', 'total', 'credit')),
  notes text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, program_id, academic_year, student_category, fee_type)
);

create table if not exists public.admission_requirements (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  degree_id uuid references public.degrees(id) on delete set null,
  requirement_type text not null,
  description text not null,
  minimum_value text,
  mandatory boolean default true,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.required_documents (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  name text not null,
  description text,
  mandatory boolean default true,
  applies_to text default 'international',
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (university_id is not null or program_id is not null)
);

create table if not exists public.language_requirements (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  language text not null,
  test_name text not null,
  minimum_score text not null,
  waiver_rules text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (university_id is not null or program_id is not null)
);

create table if not exists public.intakes (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  name text not null,
  starts_on date,
  academic_year text,
  application_status text default 'unknown' check (application_status in ('open', 'closed', 'opening_soon', 'rolling', 'unknown')),
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, program_id, name, academic_year)
);

create table if not exists public.application_deadlines (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  intake_id uuid references public.intakes(id) on delete cascade,
  deadline_type text not null,
  deadline_at timestamp with time zone not null,
  timezone text default 'Europe/Istanbul',
  status text default 'open' check (status in ('open', 'closed', 'opening_soon', 'rolling', 'unknown')),
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.dormitories (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  name text not null,
  type text,
  monthly_cost_min numeric,
  monthly_cost_max numeric,
  currency text default 'TRY',
  capacity integer,
  description text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.living_costs (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references public.cities(id) on delete cascade,
  university_id uuid references public.universities(id) on delete cascade,
  category text not null,
  amount_min numeric,
  amount_max numeric,
  currency text default 'TRY',
  period text default 'monthly' check (period in ('monthly', 'annual', 'one_time')),
  notes text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (city_id is not null or university_id is not null)
);

create table if not exists public.rankings (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  ranking_body text not null,
  ranking_scope text,
  rank_value integer,
  rank_band text,
  subject text,
  year integer not null,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, ranking_body, coalesce(subject, ''), year)
);

create table if not exists public.exchange_programs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  name text not null,
  partner_university text,
  partner_country text,
  description text,
  website_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.career_outcomes (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  outcome_type text not null,
  description text,
  employment_rate numeric(5,2),
  average_salary numeric,
  currency text,
  top_employers text[],
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.international_offices (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  website_url text,
  contact_person text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.contact_information (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete cascade,
  office_id uuid references public.international_offices(id) on delete cascade,
  contact_type text not null,
  label text,
  value text not null,
  is_primary boolean default false,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (university_id is not null or campus_id is not null or office_id is not null)
);

create table if not exists public.university_faqs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (university_id is not null or program_id is not null)
);

create table if not exists public.university_media (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  media_type text not null check (media_type in ('logo', 'brochure', 'campus_image', 'gallery_image', 'video')),
  title text,
  url text not null,
  alt_text text,
  sort_order integer default 0,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.student_clubs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  name text not null,
  description text,
  website_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, name)
);

create table if not exists public.research_centers (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid not null references public.universities(id) on delete cascade,
  name text not null,
  description text,
  website_url text,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  source_id uuid references public.source_metadata(id) on delete set null,
  last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (university_id, name)
);

-- Reuse scholarships table while adding quality fields required by the knowledge platform.
alter table public.scholarships
  add column if not exists program_id uuid references public.programs(id) on delete cascade,
  add column if not exists amount numeric,
  add column if not exists currency text,
  add column if not exists scholarship_type text,
  add column if not exists verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  add column if not exists data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  add column if not exists source_id uuid references public.source_metadata(id) on delete set null,
  add column if not exists last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- City quality fields for living cost and location data.
alter table public.cities
  add column if not exists verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'stale')),
  add column if not exists data_completeness_score numeric(5,2) default 0 check (data_completeness_score >= 0 and data_completeness_score <= 100),
  add column if not exists source_id uuid references public.source_metadata(id) on delete set null,
  add column if not exists last_updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

create table if not exists public.import_batches (
  id uuid default uuid_generate_v4() primary key,
  source_id uuid references public.source_metadata(id) on delete set null,
  import_type text not null check (import_type in ('official_api', 'csv', 'json', 'excel', 'admin_upload')),
  status text default 'pending' check (status in ('pending', 'validating', 'importing', 'completed', 'completed_with_warnings', 'failed', 'rolled_back')),
  conflict_strategy text default 'prefer_verified' check (conflict_strategy in ('prefer_verified', 'prefer_newer', 'manual_review', 'overwrite')),
  total_records integer default 0,
  inserted_records integer default 0,
  updated_records integer default 0,
  skipped_records integer default 0,
  duplicate_records integer default 0,
  error_records integer default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  rollback_snapshot jsonb default '[]'::jsonb,
  summary jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.import_logs (
  id uuid default uuid_generate_v4() primary key,
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null check (action in ('insert', 'update', 'skip', 'duplicate', 'conflict', 'error', 'rollback')),
  severity text default 'info' check (severity in ('debug', 'info', 'warning', 'error')),
  external_id text,
  slug text,
  message text,
  diff jsonb default '{}'::jsonb,
  raw_record jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.import_conflicts (
  id uuid default uuid_generate_v4() primary key,
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  field_name text not null,
  existing_value jsonb,
  incoming_value jsonb,
  resolution text default 'unresolved' check (resolution in ('unresolved', 'keep_existing', 'use_incoming', 'merged')),
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists import_batches_status_idx on public.import_batches (status, started_at desc);
create index if not exists import_logs_batch_idx on public.import_logs (batch_id, entity_type, action);
create index if not exists import_conflicts_unresolved_idx on public.import_conflicts (batch_id, resolution);

-- High-value entity indexes for advanced search and profile pages.
create index if not exists campuses_university_idx on public.campuses (university_id, city_id);
create index if not exists faculties_university_idx on public.faculties (university_id);
create index if not exists tuition_fees_filter_idx on public.tuition_fees (university_id, program_id, amount, currency, academic_year);
create index if not exists admission_requirements_program_idx on public.admission_requirements (university_id, program_id, requirement_type);
create index if not exists language_requirements_program_idx on public.language_requirements (university_id, program_id, language, test_name);
create index if not exists deadlines_status_idx on public.application_deadlines (university_id, program_id, status, deadline_at);
create index if not exists rankings_filter_idx on public.rankings (university_id, ranking_body, year, rank_value);
create index if not exists living_costs_city_idx on public.living_costs (city_id, university_id, category);

-- Public read policies for knowledge entities. Writes are expected through service-role admin/import paths.
alter table public.source_metadata enable row level security;
alter table public.degrees enable row level security;
alter table public.campuses enable row level security;
alter table public.faculties enable row level security;
alter table public.tuition_fees enable row level security;
alter table public.admission_requirements enable row level security;
alter table public.required_documents enable row level security;
alter table public.language_requirements enable row level security;
alter table public.intakes enable row level security;
alter table public.application_deadlines enable row level security;
alter table public.dormitories enable row level security;
alter table public.living_costs enable row level security;
alter table public.rankings enable row level security;
alter table public.exchange_programs enable row level security;
alter table public.career_outcomes enable row level security;
alter table public.international_offices enable row level security;
alter table public.contact_information enable row level security;
alter table public.university_faqs enable row level security;
alter table public.university_media enable row level security;
alter table public.student_clubs enable row level security;
alter table public.research_centers enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_logs enable row level security;
alter table public.import_conflicts enable row level security;

create policy "Public can view source metadata" on public.source_metadata for select using (true);
create policy "Public can view degrees" on public.degrees for select using (true);
create policy "Public can view campuses" on public.campuses for select using (true);
create policy "Public can view faculties" on public.faculties for select using (true);
create policy "Public can view tuition fees" on public.tuition_fees for select using (true);
create policy "Public can view admission requirements" on public.admission_requirements for select using (true);
create policy "Public can view required documents" on public.required_documents for select using (true);
create policy "Public can view language requirements" on public.language_requirements for select using (true);
create policy "Public can view intakes" on public.intakes for select using (true);
create policy "Public can view application deadlines" on public.application_deadlines for select using (true);
create policy "Public can view dormitories" on public.dormitories for select using (true);
create policy "Public can view living costs" on public.living_costs for select using (true);
create policy "Public can view rankings" on public.rankings for select using (true);
create policy "Public can view exchange programs" on public.exchange_programs for select using (true);
create policy "Public can view career outcomes" on public.career_outcomes for select using (true);
create policy "Public can view international offices" on public.international_offices for select using (true);
create policy "Public can view contact information" on public.contact_information for select using (true);
create policy "Public can view university faqs" on public.university_faqs for select using (true);
create policy "Public can view university media" on public.university_media for select using (true);
create policy "Public can view student clubs" on public.student_clubs for select using (true);
create policy "Public can view research centers" on public.research_centers for select using (true);

-- Authenticated admins can inspect imports; mutations should still be controlled by application service role.
create policy "Authenticated can view import batches" on public.import_batches for select using (auth.role() = 'authenticated');
create policy "Authenticated can view import logs" on public.import_logs for select using (auth.role() = 'authenticated');
create policy "Authenticated can view import conflicts" on public.import_conflicts for select using (auth.role() = 'authenticated');
