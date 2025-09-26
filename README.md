## OPENCIRCLE — Peer Support for Mental Health

OpenCircle is a small web app for moderated peer support groups, events, and discussions. It features a calm, accessible design and provides a full-stack example flow:

React UI → REST API → Database models & migrations → Seeded demo data.

## PROJECT OUTLOOK
<img src="/client/img/image.png" alt="App Screenshot" width="600">


## FEATURES

- Browse and filter community groups
- Group pages with discussion threads and calendar events
- Create events (for authenticated users)
- Simple sign-up / sign-in flow (email + password)
- Pre-seeded demo data for exploration


## TECHNOLOGY USED

- Frontend: React, plain CSS (+ Tailwind config), Vite/CRA
- Backend: Flask, SQLAlchemy, Flask-Migrate (Alembic)
- Database (dev): SQLite (server/instance/app.db)
- Auth: Session-based (simple, demo-friendly)
- Tooling: npm/yarn for client, Pipenv for Python dependencies

## PROJECT STRUCTURE
```bash

├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE.md             # Project license
├── README.md              # Project overview & setup
├── package.json           # Root-level package config (tooling/scripts)
├── Pipfile                # Python dependencies (Pipenv)
├── Pipfile.lock
│
├── client/                # React frontend
│   ├── package.json       # Frontend dependencies & scripts
│   ├── public/            # Static assets (index.html, favicon, logos, etc.)
│   └── src/               # React source code
│       ├── index.js       # App entry point
│       ├── index.css      # Global styles
│       ├── api.js         # API helper
│       ├── apiBase.js     # API base config
│       ├── apiEvents.js   # Event API wrapper
│       ├── auth.js        # Client-side auth helper
│       ├── components/    # UI components (Navbar, GroupList, etc.)
│       ├── pages/         # Page-level components (Home, Groups, Auth, etc.)
│       ├── context/       # React Context providers (e.g. AuthProvider)
│       ├── data/          # Sample/static UI data
│       └── assets/        # Images and other media
│
└── server/                # Flask backend
    ├── app.py             # Flask app entry point
    ├── config.py          # Configuration settings
    ├── models.py          # SQLAlchemy models (Users, Groups, Events, etc.)
    ├── routes.py          # REST API endpoints
    ├── seed.py            # Script: seed demo data
    ├── add_events.py      # Script: insert demo events
    ├── add_anonymous_posts.py # Script: insert demo anonymous posts
    ├── instance/          # Contains SQLite DB (app.db)
    │   └── app.db
    └── migrations/        # Alembic migrations (DB schema history)

```

## LOCAL SETUP


## 1. Clone the repo
```bash
git clone <repo-url>
cd Phase4_project
```


## 2. Backend (Flask server)
```bash
cd server
pip install pipenv
pipenv install --dev
pipenv shell  # optional
```

## 3. Set environment variables (via .env or export):
```bash
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=some-dev-secret
DATABASE_URL=sqlite:///instance/app.db
```

## 4.Run migrations & seed demo data:
```bash
pipenv run flask db upgrade
pipenv run python seed.py
```

## 5. Start the server:
```bash
python app.py
```

## 6. Frontend (React client)
```bash
cd ../client
npm install
npm start
```

## 7. Explore!

- Open browser at http://localhost:3000/
- Sign up and explore groups & events;

## UTILITY SCRIPTS
## Run from server:

- seed.py — create default groups, users, posts
- add_events.py — insert demo events
- add_anonymous_posts.py — insert demo anonymous posts
- pipenv run python seed.py

## LICENSE
- This project is under no license
