#!/usr/bin/env bash
set -euo pipefail
# Ensure this script runs from the repo root and export it on PYTHONPATH so
# imports like `server.app` resolve even if the process is started from a
# different working directory by the host environment (Render, etc.).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
export PYTHONPATH="$SCRIPT_DIR${PYTHONPATH:+:$PYTHONPATH}"

# Default worker count (allow override with $WEB_CONCURRENCY)
: ${WEB_CONCURRENCY:=4}

echo "Starting gunicorn with PYTHONPATH=$PYTHONPATH"
exec gunicorn -w ${WEB_CONCURRENCY} --bind 0.0.0.0:${PORT:-8000} wsgi:application
