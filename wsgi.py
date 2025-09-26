"""
WSGI entrypoint for gunicorn/hosts that import from repo root.

Usage:
  gunicorn -w 4 --bind 0.0.0.0:$PORT wsgi:application

This simply re-exports the Flask `app` defined in `server/app.py` as
`application`, which is the conventional WSGI callable name.
"""
from server.app import app as application
