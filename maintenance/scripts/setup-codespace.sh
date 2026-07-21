#! /bin/bash

# Configures a GitHub Codespace for external sharing.
#
# Patches api/.env, apps/web/.env, and the nginx mock-auth proxy to use the
# Codespace's forwarded-port URL instead of localhost:8000, then refreshes
# the API, seeds the database, and rebuilds the frontend (API_HOST is baked
# into the JS bundle at Vite build time so a rebuild is required).
#
# Usage (run from repo root inside the Codespace terminal):
#   bash maintenance/scripts/setup-codespace.sh
#
# Or via make:
#   make codespace-setup

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# ---------------------------------------------------------------------------
# Resolve the Codespace app URL
# ---------------------------------------------------------------------------

if [ -z "${CODESPACE_NAME:-}" ]; then
  echo "Error: CODESPACE_NAME is not set."
  echo "This script must be run inside a GitHub Codespace terminal."
  exit 1
fi

FORWARDING_DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
APP_URL="https://${CODESPACE_NAME}-8000.${FORWARDING_DOMAIN}"
APP_HOST="${CODESPACE_NAME}-8000.${FORWARDING_DOMAIN}"

echo "Configuring Codespace for external access"
echo "  App URL: ${APP_URL}"
echo ""

# ---------------------------------------------------------------------------
# api/.env
# ---------------------------------------------------------------------------

API_ENV="api/.env"
if [ ! -f "${API_ENV}" ]; then
  echo "api/.env not found — copying from api/.env.example"
  cp api/.env.example "${API_ENV}"
  ${parent_path}/update_env_secrets.sh "${API_ENV}"
fi

# Generate APP_KEY if missing (e.g. freshly copied from .env.example)
if ! grep -q "^APP_KEY=.\+" "${API_ENV}"; then
  echo "Generating APP_KEY..."
  docker compose run --rm maintenance sh -c "cd /var/www/html/api && php artisan key:generate"
fi

sed -i "s|APP_URL=.*|APP_URL=\"${APP_URL}\"|" "${API_ENV}"
sed -i "s|OAUTH_REDIRECT_URI=.*|OAUTH_REDIRECT_URI=\"${APP_URL}/auth-callback\"|" "${API_ENV}"
sed -i "s|OAUTH_POST_LOGIN_REDIRECT=.*|OAUTH_POST_LOGIN_REDIRECT=\"${APP_URL}/applicant\"|" "${API_ENV}"
sed -i "s|OAUTH_POST_LOGIN_REGISTRATION_REDIRECT=.*|OAUTH_POST_LOGIN_REGISTRATION_REDIRECT=\"${APP_URL}/registration/account\"|" "${API_ENV}"
sed -i "s|OAUTH_URI=.*|OAUTH_URI=\"${APP_URL}/oxauth/authorize\"|" "${API_ENV}"

echo "✓ api/.env updated"

# ---------------------------------------------------------------------------
# apps/web/.env
# ---------------------------------------------------------------------------

WEB_ENV="apps/web/.env"
if [ ! -f "${WEB_ENV}" ]; then
  echo "apps/web/.env not found — copying from apps/web/.env.example"
  cp apps/web/.env.example "${WEB_ENV}"
fi

sed -i "s|API_HOST=.*|API_HOST=\"${APP_URL}\"|" "${WEB_ENV}"
sed -i "s|OAUTH_POST_LOGOUT_REDIRECT_EN=.*|OAUTH_POST_LOGOUT_REDIRECT_EN=\"${APP_URL}/en/logged-out\"|" "${WEB_ENV}"
sed -i "s|OAUTH_POST_LOGOUT_REDIRECT_FR=.*|OAUTH_POST_LOGOUT_REDIRECT_FR=\"${APP_URL}/fr/logged-out\"|" "${WEB_ENV}"
sed -i "s|OAUTH_LOGOUT_URI=.*|OAUTH_LOGOUT_URI=\"${APP_URL}/oxauth/endsession\"|" "${WEB_ENV}"

echo "✓ apps/web/.env updated"

# ---------------------------------------------------------------------------
# nginx mock-auth proxy headers
#
# The mock OAuth server reads X-Forwarded-Proto + Host to construct URLs in
# its OpenID Connect discovery document. Without this change the discovery
# doc returns http://localhost:8000/oxauth/... which breaks login from an
# external browser.
# ---------------------------------------------------------------------------

NGINX_CONF="infrastructure/conf/nginx-local.conf"

sed -i "s|proxy_set_header X-Forwarded-Proto http;|proxy_set_header X-Forwarded-Proto https;|" "${NGINX_CONF}"
sed -i "s|proxy_set_header Host localhost:8000;|proxy_set_header Host ${APP_HOST};|" "${NGINX_CONF}"

echo "✓ nginx mock-auth proxy updated"

# ---------------------------------------------------------------------------
# Start containers (skip rebuild if already running)
# ---------------------------------------------------------------------------

if ! docker compose ps --status running | grep -q webserver; then
  echo "Starting containers..."
  docker compose up --detach
else
  echo "✓ Containers already running"
fi

# ---------------------------------------------------------------------------
# Refresh API + seed database
#
# Runs inside the maintenance container (same as make refresh-api).
# Clears config/route/view caches, re-runs migrations, and seeds test data
# so designers can log in with admin@test.com / applicant@test.com.
# ---------------------------------------------------------------------------

echo "Refreshing API..."
docker compose run --rm maintenance bash refresh_api.sh

echo "Seeding database..."
docker compose run --rm maintenance sh -c "cd /var/www/html/api && php artisan migrate:fresh --seed"

echo "✓ API refreshed and database seeded"

# ---------------------------------------------------------------------------
# Rebuild frontend
#
# API_HOST is injected by Vite's define config at build time, so updating
# apps/web/.env alone has no effect — the bundle must be rebuilt.
# ---------------------------------------------------------------------------

echo "Rebuilding frontend (this takes a few minutes)..."
docker compose run --rm maintenance bash refresh_frontend.sh

echo "✓ Frontend rebuilt"

# ---------------------------------------------------------------------------
# Reload nginx
# ---------------------------------------------------------------------------

docker compose exec webserver nginx -s reload

echo "✓ nginx reloaded"

# ---------------------------------------------------------------------------
# Make port 8000 public (requires gh CLI, non-fatal if unavailable)
# ---------------------------------------------------------------------------

if command -v gh &>/dev/null; then
  gh codespace ports visibility 8000:public --codespace "${CODESPACE_NAME}" 2>/dev/null \
    && echo "✓ Port 8000 set to Public" \
    || echo "Note: Could not set port visibility via gh CLI — set it manually in the Ports tab"
else
  echo "Note: gh CLI not found — set port 8000 to Public manually in the Ports tab"
fi

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------

echo ""
echo "========================================================"
echo "  Codespace ready to share with designers"
echo ""
echo "  URL:  ${APP_URL}"
echo ""
echo "  Login (no password needed):"
echo "    Admin:     admin@test.com"
echo "    Applicant: applicant@test.com"
echo "========================================================"
