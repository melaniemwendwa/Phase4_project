"""Server package marker.

This file makes the `server` directory a Python package so imports like
`from server.app import app` work when the project root is on PYTHONPATH.
"""

# re-export the Flask app if someone imports the package directly
try:
    from .app import app  # noqa: F401
except Exception:
    # If import fails during tooling or static analysis, ignore.
    app = None
