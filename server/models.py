from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
# User model
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String, nullable=False, unique=True)

    memberships = db.relationship("Membership", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
        }


# SupportGroup model
class SupportGroup(db.Model, SerializerMixin):
    __tablename__ = "support_groups"

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    meeting_times = db.Column(db.String(255), nullable=True)

    memberships = db.relationship("Membership", back_populates="support_group", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "description": self.description,
            "meeting_times": self.meeting_times,
        }


# Membership model
class Membership(db.Model, SerializerMixin):
    __tablename__ = "memberships"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String, default="member")  # "member" or "facilitator"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    support_group_id = db.Column(db.Integer, db.ForeignKey("support_groups.id"))

    user = db.relationship("User", back_populates="memberships")
    support_group = db.relationship("SupportGroup", back_populates="memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "user": {"id": self.user.id, "nickname": self.user.nickname},
            "support_group": {
                "id": self.support_group.id,
                "topic": self.support_group.topic
            }
        }