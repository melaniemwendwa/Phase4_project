from flask import request, jsonify, redirect, url_for
from flask_cors import CORS

from config import app, db
from models import SupportGroup, Membership

# Enable CORS for React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return redirect(url_for('get_groups'))

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

@app.route('/groups/<int:group_id>/join', methods=['POST'])
def join_group(group_id):
    group = SupportGroup.query.get_or_404(group_id)
    data = request.get_json() or {}
    user_id = data.get('user_id')
    role = data.get('role', 'member')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400

    existing = Membership.query.filter_by(group_id=group.id, user_id=user_id).first()
    if existing:
        return jsonify({'message': 'already a member', 'membership_id': existing.id, 'role': existing.role}), 200

    membership = Membership(group_id=group.id, user_id=user_id, role=role)
    db.session.add(membership)
    db.session.commit()
    return jsonify({'id': membership.id, 'group_id': group.id, 'user_id': user_id, 'role': role}), 201


if __name__ == '__main__':
    app.run(port=5555, debug=True)