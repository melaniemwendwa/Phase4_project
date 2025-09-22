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
    meeting_times = db.Collumn(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "description": self.description,
            "meeting_times": self.meeting_times
        }