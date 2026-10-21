-- Minimal stand-in for the parts of Supabase the migrations depend on, so the schema and its
-- row-level security can be tested against a plain local PostgreSQL. Not used in production.
create schema if not exists extensions;
create extension if not exists pgcrypto schema extensions;

create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key,
  email text
);

-- Supabase's auth.uid() reads the JWT subject from request settings; tests set it directly.
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;

grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
grant usage on schema extensions to anon, authenticated;
