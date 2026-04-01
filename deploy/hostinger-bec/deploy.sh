#!/usr/bin/env bash

set -euo pipefail

APP_NAME="${APP_NAME:-bec-production}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/var/www/bec-production}"
BACKEND_DIR="$DEPLOY_ROOT/SchoolManagementBackend/CollegeManagement"
FRONTEND_DIR="$DEPLOY_ROOT/schoolmanagement_FrontEnd"
VENV_DIR="$BACKEND_DIR/venv"
FRONTEND_BUILD_TARGET="${FRONTEND_BUILD_TARGET:-/var/www/bec-production-frontend/build}"
BACKEND_SERVICE="${BACKEND_SERVICE:-bec-production.service}"
BACKEND_PORT="${BACKEND_PORT:-8001}"
PUBLIC_PORT="${PUBLIC_PORT:-3006}"

echo "==> Deploying $APP_NAME"

python3 -m venv "$VENV_DIR" 2>/dev/null || true
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip
pip install -r "$BACKEND_DIR/requirements.txt"

cd "$BACKEND_DIR"
python manage.py collectstatic --no-input
python manage.py migrate --no-input

systemctl restart "$BACKEND_SERVICE"
systemctl is-active --quiet "$BACKEND_SERVICE"

cd "$FRONTEND_DIR"
export CI="${CI:-false}"
export GENERATE_SOURCEMAP="${GENERATE_SOURCEMAP:-false}"

if [[ -z "${REACT_APP_API_URL:-}" ]]; then
  echo "REACT_APP_API_URL is required" >&2
  exit 1
fi

printf 'REACT_APP_API_URL=%s\n' "$REACT_APP_API_URL" > "$FRONTEND_DIR/.env.production"

npm ci
npm run build

rm -rf "$FRONTEND_BUILD_TARGET"
mkdir -p "$FRONTEND_BUILD_TARGET"
cp -R "$FRONTEND_DIR/build/." "$FRONTEND_BUILD_TARGET/"

nginx -t
systemctl reload nginx

curl -fsSI "http://127.0.0.1:${BACKEND_PORT}/admin/" >/dev/null
curl -fsSI "http://127.0.0.1:${PUBLIC_PORT}/" >/dev/null

echo "==> Deployment complete"
