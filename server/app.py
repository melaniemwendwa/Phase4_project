#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_restful import Resource
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
from config import app, db, api
from models import SupportGroup

# Home route
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# Route to list all support groups
@app.route('/groups', methods=['GET'])
def list_groups():
    groups = SupportGroup.query.all()
    groups_list = [
        {
            "id": group.id,
            "topic": group.topic,
            "description": group.description,
            "meeting_times": group.meeting_times
        }
        for group in groups
    ]
    return jsonify(groups_list)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
