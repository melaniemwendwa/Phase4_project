# Standard library imports

# Remote library imports
import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
# Respect environment DATABASE_URL (typical for managed Postgres on Render/Heroku).
# If DATABASE_URL is not provided, fall back to a project-relative SQLite file
# at server/instance/app.db so existing local data is preserved by default.
default_sqlite_path = os.path.join(os.path.dirname(__file__), 'instance', 'app.db')

# Read DATABASE_URL and normalize/validate it. Some hosts (Render) provide
# a URL using the `postgres://` scheme while SQLAlchemy expects
# `postgresql://` (or a driver-prefixed URL). Also guard against empty
# environment variables which would cause SQLAlchemy to throw.
raw_db = os.environ.get('DATABASE_URL') or ''
raw_db = raw_db.strip()
if raw_db:
    # Normalize the common postgres scheme
    if raw_db.startswith('postgres://'):
        raw_db = raw_db.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = raw_db
else:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{default_sqlite_path}"

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

# If we're using the project-relative SQLite file, ensure the parent directory
# exists so SQLite can create/open the file on startup (useful on hosts
# where the checkout directory might not include the instance folder yet).
if SQLALCHEMY_DATABASE_URI.startswith('sqlite:'):
    try:
        parent_dir = os.path.dirname(default_sqlite_path)
        os.makedirs(parent_dir, exist_ok=True)
    except Exception:
        # If we cannot create the directory, let SQLAlchemy raise the original
        # error; don't mask permission issues silently.
        pass
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Application secret (use env var in production)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret')
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# NOTE: CORS is configured in `app.py` with project-specific origins.
# Avoid initializing CORS twice to prevent inconsistent behavior.

# Warning: `server/seed.py` drops and recreates the database schema. Do NOT run
# the seed script in production if you want to preserve existing data.
