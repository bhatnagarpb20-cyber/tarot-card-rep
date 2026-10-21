#!/usr/bin/env bash
# Starts a minimal local Supabase-compatible stack for end-to-end tests of account mode:
# local PostgreSQL (must already run on 127.0.0.1:5432) + GoTrue + PostgREST (Docker) + a tiny gateway.
# Usage: supabase/local-stack/up.sh   (writes supabase/local-stack/.env.local-stack)
set -euo pipefail
cd "$(dirname "$0")"
DB=${DB:-arcana_e2e}
ADMIN_URL=${ADMIN_URL:-postgres://postgres:postgres@127.0.0.1:5432/postgres}
DB_URL="postgres://postgres:postgres@127.0.0.1:5432/$DB"
export JWT_SECRET=${JWT_SECRET:-local-stack-jwt-secret-at-least-32-characters}
SITE=${SITE_URL:-http://localhost:3200}

docker rm -f arcana-gotrue arcana-postgrest >/dev/null 2>&1 || true
psql "$ADMIN_URL" -q -c "drop database if exists $DB with (force)" -c "create database $DB"
psql "$DB_URL" -q -v ON_ERROR_STOP=1 -f roles.sql

docker run -d --name arcana-gotrue --network host \
  -e GOTRUE_DB_DRIVER=postgres -e GOTRUE_DB_DATABASE_URL="postgres://supabase_auth_admin:postgres@127.0.0.1:5432/$DB" \
  -e GOTRUE_API_HOST=127.0.0.1 -e PORT=9999 -e API_EXTERNAL_URL=http://localhost:54321/auth/v1 \
  -e GOTRUE_SITE_URL="$SITE" -e GOTRUE_URI_ALLOW_LIST="$SITE/**" \
  -e GOTRUE_JWT_SECRET="$JWT_SECRET" -e GOTRUE_JWT_EXP=3600 -e GOTRUE_JWT_AUD=authenticated \
  -e GOTRUE_JWT_DEFAULT_GROUP_NAME=authenticated -e GOTRUE_JWT_ADMIN_ROLES=service_role \
  -e GOTRUE_EXTERNAL_EMAIL_ENABLED=true -e GOTRUE_MAILER_AUTOCONFIRM=true -e GOTRUE_DISABLE_SIGNUP=false \
  supabase/gotrue:v2.177.0 >/dev/null
for i in $(seq 1 60); do curl -sf http://127.0.0.1:9999/health >/dev/null && break; sleep 1; done
curl -sf http://127.0.0.1:9999/health >/dev/null || { docker logs arcana-gotrue | tail -20; exit 1; }

for f in ../migrations/*.sql; do psql "$DB_URL" -q -v ON_ERROR_STOP=1 -f "$f"; done
psql "$DB_URL" -q -v ON_ERROR_STOP=1 -f ../seed.sql
# Hosted Supabase grants the service role full access; mirror that for admin operations.
psql "$DB_URL" -q -c "grant usage on schema public to service_role; grant all on all tables in schema public to service_role;"

docker run -d --name arcana-postgrest --network host \
  -e PGRST_DB_URI="postgres://authenticator:postgres@127.0.0.1:5432/$DB" -e PGRST_DB_SCHEMAS=public \
  -e PGRST_DB_ANON_ROLE=anon -e PGRST_JWT_SECRET="$JWT_SECRET" -e PGRST_SERVER_PORT=3001 \
  postgrest/postgrest:v12.2.12 >/dev/null
for i in $(seq 1 30); do curl -sf http://127.0.0.1:3001/ >/dev/null && break; sleep 1; done

eval "$(node keys.mjs)"
cat > .env.local-stack <<ENV
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=$SITE
ENV
echo "Stack ready. Start the gateway with: node supabase/local-stack/gateway.mjs"
