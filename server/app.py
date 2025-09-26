from flask import request, jsonify, redirect, url_for
from flask_cors import CORS

from config import app, db
from models import SupportGroup, Membership, SessionEvent, GroupMessage, Encouragement, SupportGroupPost
from models import User
from config import bcrypt

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
        anonymous=bool(data.get('anonymous', False)),
        content=data.get('content'),
        timestamp=datetime.utcnow()
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify(msg.to_dict()), 201


# --- Support group posts (feed) ---
@app.route('/groups/<int:group_id>/posts', methods=['GET'])
def get_posts(group_id):
    posts = SupportGroupPost.query.filter_by(group_id=group_id).order_by(SupportGroupPost.timestamp.desc()).all()
    return jsonify([p.to_dict() for p in posts]), 200


@app.route('/groups/<int:group_id>/posts', methods=['POST'])
def create_post(group_id):
    data = request.get_json() or {}
    import json
    from datetime import datetime
    links = data.get('links', [])
    if not isinstance(links, str):
        links = json.dumps(links)
    post = SupportGroupPost(
        group_id=group_id,
        user_id=data.get('user_id', 0),
        header=data.get('header', '') or '',
        body=data.get('body', '') or '',
        links=links,
        timestamp=datetime.utcnow()
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


# --- Authentication / Users ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "username, email and password are required"}), 400

    # unique checks
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    user = User(
        username=username,
        email=email,
        _password_hash=bcrypt.generate_password_hash(password).decode('utf-8')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'invalid credentials'}), 401
    if not user.authenticate(password):
        return jsonify({'error': 'invalid credentials'}), 401
    return jsonify(user.to_dict()), 200

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
        current_count = Membership.query.filter_by(group_id=group.id).count()
        return jsonify({
            'message': 'already a member',
            'membership_id': existing.id,
            'role': existing.role,
            'member_count': current_count
        }), 200

    membership = Membership(group_id=group.id, user_id=user_id, role=role)
    db.session.add(membership)
    db.session.commit()
    updated_count = Membership.query.filter_by(group_id=group.id).count()
    return jsonify({
        'id': membership.id,
        'group_id': group.id,
        'user_id': user_id,
        'role': role,
        'member_count': updated_count
    }), 201


@app.route('/groups/<int:group_id>/membership', methods=['GET'])
def check_membership(group_id):
    from flask import request
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'is_member': False}), 200
    existing = Membership.query.filter_by(group_id=group_id, user_id=user_id).first()
    return jsonify({'is_member': bool(existing), 'membership_id': existing.id if existing else None}), 200


@app.route('/groups/<int:group_id>/join', methods=['DELETE'])
def leave_group(group_id):
    data = request.get_json() or {}
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    membership = Membership.query.filter_by(group_id=group_id, user_id=user_id).first()
    if not membership:
        return jsonify({'message': 'not a member'}), 404
    db.session.delete(membership)
    db.session.commit()
    return jsonify({'message': 'left', 'group_id': group_id, 'user_id': user_id}), 200


if __name__ == '__main__':
    import os
    port = int(os.environ.get('FLASK_RUN_PORT', 5555))
    app.run(port=port, debug=True)