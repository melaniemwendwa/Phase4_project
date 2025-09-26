"""Server package marker.

Keep this file minimal so importing the package doesn't execute application
initialization twice. Import the app explicitly with `from server.app import app`
or use the `wsgi.py` entrypoint which imports `server.app`.
"""

__all__ = []
