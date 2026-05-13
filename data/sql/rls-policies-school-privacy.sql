-- Career Empire school privacy RLS hardening
-- Run this after the prototype schema and seed scripts, when moving beyond the open browser prototype.
--
-- Why this exists:
-- - Leaderboards and community boards must be school-scoped.
-- - The Global Index may compare schools/classes, but must not expose named student records.
-- - Teachers use Supabase Auth, so their school can be resolved in RLS from auth.email().
-- - Students use teacher-issued usernames, not Supabase Auth. That means student-specific
--   RLS needs RPC/session-token flows before direct anonymous table access can be fully removed.

alter table schools enable row level security;
alter table teachers enable row level security;
alter table classes enable row level security;
alter table students enable row level security;
alter table student_module_progress enable row level security;
alter table assessment_evidence enable row level security;
alter table student_response_reviews enable row level security;
alter table player_profiles enable row level security;
alter table player_assets enable row level security;
alter table community_votes enable row level security;

drop policy if exists "Prototype can manage teachers" on teachers;
drop policy if exists "Prototype can manage classes" on classes;
drop policy if exists "Prototype can manage students" on students;
drop policy if exists "Prototype can manage module progress" on student_module_progress;
drop policy if exists "Prototype can manage assessment evidence" on assessment_evidence;
drop policy if exists "Prototype can manage student response reviews" on student_response_reviews;
drop policy if exists "Prototype can manage player profiles" on player_profiles;
drop policy if exists "Prototype can manage player assets" on player_assets;
drop policy if exists "Prototype can manage community votes" on community_votes;

create or replace function public.current_teacher_school_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select school_id
  from teachers
  where lower(email) = lower(auth.email())
    and is_active = true
  limit 1
$$;

revoke all on function public.current_teacher_school_id() from public;
grant execute on function public.current_teacher_school_id() to authenticated;

drop policy if exists "Teachers can read own profile" on teachers;
create policy "Teachers can read own profile"
on teachers
for select
to authenticated
using (lower(email) = lower(auth.email()));

drop policy if exists "Teachers can update own profile" on teachers;
create policy "Teachers can update own profile"
on teachers
for update
to authenticated
using (lower(email) = lower(auth.email()))
with check (lower(email) = lower(auth.email()));

drop policy if exists "Teachers can create own profile" on teachers;
create policy "Teachers can create own profile"
on teachers
for insert
to authenticated
with check (lower(email) = lower(auth.email()));

drop policy if exists "Teachers can manage school classes" on classes;
create policy "Teachers can manage school classes"
on classes
for all
to authenticated
using (school_id = public.current_teacher_school_id())
with check (school_id = public.current_teacher_school_id());

drop policy if exists "Teachers can manage school students" on students;
create policy "Teachers can manage school students"
on students
for all
to authenticated
using (school_id = public.current_teacher_school_id())
with check (school_id = public.current_teacher_school_id());

drop policy if exists "Teachers can read school module progress" on student_module_progress;
create policy "Teachers can read school module progress"
on student_module_progress
for select
to authenticated
using (
  exists (
    select 1
    from students
    where students.id = student_module_progress.student_id
      and students.school_id = public.current_teacher_school_id()
  )
);

drop policy if exists "Teachers can read school evidence" on assessment_evidence;
create policy "Teachers can read school evidence"
on assessment_evidence
for select
to authenticated
using (
  exists (
    select 1
    from classes
    where classes.id = assessment_evidence.class_id
      and classes.school_id = public.current_teacher_school_id()
  )
);

drop policy if exists "Teachers can manage school response reviews" on student_response_reviews;
create policy "Teachers can manage school response reviews"
on student_response_reviews
for all
to authenticated
using (school_id = public.current_teacher_school_id())
with check (school_id = public.current_teacher_school_id());

drop policy if exists "Teachers can read school player profiles" on player_profiles;
create policy "Teachers can read school player profiles"
on player_profiles
for select
to authenticated
using (
  exists (
    select 1
    from students
    where students.id = player_profiles.student_id
      and students.school_id = public.current_teacher_school_id()
  )
);

drop policy if exists "Teachers can read school player assets" on player_assets;
create policy "Teachers can read school player assets"
on player_assets
for select
to authenticated
using (
  exists (
    select 1
    from students
    where students.id = player_assets.student_id
      and students.school_id = public.current_teacher_school_id()
  )
);

drop policy if exists "Teachers can read school community votes" on community_votes;
create policy "Teachers can read school community votes"
on community_votes
for select
to authenticated
using (
  exists (
    select 1
    from classes
    where classes.id = community_votes.class_id
      and classes.school_id = public.current_teacher_school_id()
  )
);

create or replace function public.global_index_school_summary()
returns table (
  school_name text,
  student_count bigint,
  earnings bigint,
  net_worth bigint,
  community_fund bigint,
  readiness integer,
  years_played bigint,
  job_security integer,
  work_life_balance integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    schools.name as school_name,
    count(player_profiles.student_id) as student_count,
    coalesce(sum(player_profiles.annual_salary), 0)::bigint as earnings,
    coalesce(sum(player_profiles.cumulative_net_worth), 0)::bigint as net_worth,
    coalesce(sum(floor(player_profiles.annual_salary * 0.1)), 0)::bigint as community_fund,
    round(avg((
      coalesce(player_profiles.tech_mastery, 0) +
      coalesce(player_profiles.climate_mastery, 0) +
      coalesce(player_profiles.demo_mastery, 0) +
      coalesce(player_profiles.economic_mastery, 0)
    ) / 4.0))::integer as readiness,
    coalesce(sum(player_profiles.years_played), 0)::bigint as years_played,
    round(avg(coalesce(player_profiles.job_security, 0)))::integer as job_security,
    round(avg(coalesce(player_profiles.work_life_balance, 0)))::integer as work_life_balance
  from player_profiles
  join students on students.id = player_profiles.student_id
  join schools on schools.id = students.school_id
  group by schools.name
$$;

revoke all on function public.global_index_school_summary() from public;
grant execute on function public.global_index_school_summary() to anon, authenticated;

create or replace function public.global_index_class_summary()
returns table (
  school_name text,
  class_code text,
  student_count bigint,
  earnings bigint,
  community_fund bigint,
  readiness integer,
  years_played bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    schools.name as school_name,
    classes.class_code,
    count(player_profiles.student_id) as student_count,
    coalesce(sum(player_profiles.annual_salary), 0)::bigint as earnings,
    coalesce(sum(floor(player_profiles.annual_salary * 0.1)), 0)::bigint as community_fund,
    round(avg((
      coalesce(player_profiles.tech_mastery, 0) +
      coalesce(player_profiles.climate_mastery, 0) +
      coalesce(player_profiles.demo_mastery, 0) +
      coalesce(player_profiles.economic_mastery, 0)
    ) / 4.0))::integer as readiness,
    coalesce(sum(player_profiles.years_played), 0)::bigint as years_played
  from player_profiles
  join students on students.id = player_profiles.student_id
  join classes on classes.id = students.class_id
  join schools on schools.id = students.school_id
  group by schools.name, classes.class_code
$$;

revoke all on function public.global_index_class_summary() from public;
grant execute on function public.global_index_class_summary() to anon, authenticated;
