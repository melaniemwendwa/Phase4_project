from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
#support group model
class SupportGroup(db.Model, SerializerMixin):
    __tablename__ = "support_groups"

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(120), nullable=False)
    description= db.Column(db.Text, nullable=True)
    meeting_times = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "description": self.description,
            "meeting_times": self.meeting_times
        }

class Membership(db.Model, SerializerMixin):
    __tablename__ = "memberships"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("support_groups.id"), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)  # placeholder for now
    role = db.Column(db.String(50), nullable=False, default="member")

# --- Session/Event Model ---
class SessionEvent(db.Model, SerializerMixin):
    __tablename__ = "session_events"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("support_groups.id"), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "title": self.title,
            "description": self.description,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
        }

# --- Message/Discussion Model ---
class GroupMessage(db.Model, SerializerMixin):
    __tablename__ = "group_messages"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("support_groups.id"), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)  # placeholder for now
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "user_id": self.user_id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }

# --- Feedback/Encouragement Model ---
class Encouragement(db.Model, SerializerMixin):
    __tablename__ = "encouragements"

    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey("group_messages.id"), nullable=False)
    user_id = db.Column(db.Integer, nullable=False)  # placeholder for now
    type = db.Column(db.String(50), nullable=False, default="upvote")  # upvote, heart, etc.

    def to_dict(self):
        return {
            "id": self.id,
            "message_id": self.message_id,
            "user_id": self.user_id,
            "type": self.type,
        }