from flask import request, jsonify, redirect, url_for
from flask_cors import CORS

from config import app, db
from models import SupportGroup, Membership, User, SessionEvent, GroupMessage, Encouragement

# Enable CORS for React frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# --- Session/Event Routes ---
from datetime import datetime

@app.route('/groups/<int:group_id>/events', methods=['GET'])
def get_events(group_id):
    events = SessionEvent.query.filter_by(group_id=group_id).all()
    return jsonify([e.to_dict() for e in events]), 200

@app.route('/groups/<int:group_id>/events', methods=['POST'])
def create_event(group_id):
    data = request.get_json() or {}
    event = SessionEvent(
        group_id=group_id,
        title=data.get('title'),
        description=data.get('description'),
        start_time=datetime.fromisoformat(data.get('start_time')),
        end_time=datetime.fromisoformat(data.get('end_time')) if data.get('end_time') else None
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201

@app.route('/groups/<int:group_id>/events/<int:event_id>', methods=['PUT'])
def update_event(group_id, event_id):
    event = SessionEvent.query.filter_by(group_id=group_id, id=event_id).first_or_404()
    data = request.get_json() or {}
    if 'title' in data:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'start_time' in data:
        event.start_time = datetime.fromisoformat(data['start_time'])
    if 'end_time' in data:
        event.end_time = datetime.fromisoformat(data['end_time'])
    db.session.commit()
    return jsonify(event.to_dict()), 200

@app.route('/groups/<int:group_id>/events/<int:event_id>', methods=['DELETE'])
def delete_event(group_id, event_id):
    event = SessionEvent.query.filter_by(group_id=group_id, id=event_id).first_or_404()
    db.session.delete(event)
    db.session.commit()
    return '', 204

# --- Group Messages/Discussion Board ---
@app.route('/groups/<int:group_id>/messages', methods=['GET'])
def get_messages(group_id):
    messages = GroupMessage.query.filter_by(group_id=group_id).order_by(GroupMessage.timestamp.desc()).all()
    return jsonify([m.to_dict() for m in messages]), 200

@app.route('/groups/<int:group_id>/messages', methods=['POST'])
def create_message(group_id):
    data = request.get_json() or {}
    msg = GroupMessage(
        group_id=group_id,
        user_id=data.get('user_id', 0),
        content=data.get('content'),
        timestamp=datetime.utcnow()
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201

# --- Feedback/Encouragement System ---
@app.route('/messages/<int:message_id>/encouragements', methods=['GET'])
def get_encouragements(message_id):
    encouragements = Encouragement.query.filter_by(message_id=message_id).all()
    return jsonify([e.to_dict() for e in encouragements]), 200

@app.route('/messages/<int:message_id>/encouragements', methods=['POST'])
def create_encouragement(message_id):
    data = request.get_json() or {}
    encouragement = Encouragement(
        message_id=message_id,
        user_id=data.get('user_id', 0),
        type=data.get('type', 'upvote')
    )
    db.session.add(encouragement)
    db.session.commit()
    return jsonify(encouragement.to_dict()), 201

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return redirect(url_for('get_groups'))

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter(User.email == email).first()

    if not email or not password:
        return jsonify({"error": 'Email and password are required'}), 400
    
    if user:
        return jsonify({"error": 'An account with this email already exists'}), 400
    
    new_user = User(email=email)
    new_user.password_hash = password

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created succesfully', 'user_id': new_user.id}), 201

@app.route('/signin', methods=["POST"])
def signin():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter(User.email == email).first()

    if user and user.authenticate(password):
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"error": 'Invalid email or password'}), 401

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