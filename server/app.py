#!/usr/bin/env python3
from flask import request, jsonify, redirect, url_for
from flask_cors import CORS

from config import app, db
from models import SupportGroup

# Enable CORS for React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Ensure database tables exist (for quick setup without running migrations)
with app.app_context():
    db.create_all()

# Home route
@app.route('/')
def home():
    # Redirect to the 'get_groups' endpoint
    return redirect(url_for('get_groups'))

# CRUD for SupportGroup
@app.route('/groups', methods=['GET'])
def get_groups():
    groups = SupportGroup.query.all()
    return jsonify([g.to_dict() for g in groups]), 200

@app.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    group = SupportGroup.query.get_or_404(group_id)
    return jsonify(group.to_dict()), 200

@app.route('/groups', methods=['POST'])
def create_group():
    data = request.get_json() or {}
    topic = data.get('topic')
    if not topic:
        return jsonify({'error': 'topic is required'}), 400
    group = SupportGroup(
        topic=topic,
        description=data.get('description'),
        meeting_times=data.get('meeting_times')
    )
    db.session.add(group)
    db.session.commit()
    return jsonify(group.to_dict()), 201

@app.route('/groups/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    group = SupportGroup.query.get_or_404(group_id)
    data = request.get_json() or {}
    if 'topic' in data:
        group.topic = data['topic']
    if 'description' in data:
        group.description = data['description']
    if 'meeting_times' in data:
        group.meeting_times = data['meeting_times']
    db.session.commit()
    return jsonify(group.to_dict()), 200

@app.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    group = SupportGroup.query.get_or_404(group_id)
    db.session.delete(group)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(port=5555, debug=True)