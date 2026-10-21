-- Recreates the roles and schemas a hosted Supabase database provides, so GoTrue (auth) and
-- PostgREST (REST API) can run against a plain PostgreSQL for local end-to-end testing.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin noinherit bypassrls; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticator') then create role authenticator login password 'postgres' noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then create role supabase_auth_admin login password 'postgres' createrole noinherit; end if;
end $$;
grant anon, authenticated, service_role to authenticator;
create schema if not exists auth authorization supabase_auth_admin;
create schema if not exists extensions;
create extension if not exists pgcrypto schema extensions;
grant usage on schema extensions to anon, authenticated, service_role, supabase_auth_admin;
grant usage on schema auth to anon, authenticated, service_role;
alter role supabase_auth_admin set search_path = auth;
