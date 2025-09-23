from flask import Blueprint, jsonify
from models import SupportGroup

groups_bp = Blueprint("groups", __name__)

# Route to list all support groups
@groups_bp.route("/groups", methods=["GET"])
def list_groups():
    groups = SupportGroup.query.all()
    # Converting each group into a dictionary
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
