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
# Respect environment DATABASE_URL (typical for managed Postgres on Render/Heroku)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
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
