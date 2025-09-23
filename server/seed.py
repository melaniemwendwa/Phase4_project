#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, SupportGroup

if __name__ == '__main__':
   # fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
# Defining my support groups manually
        SUPPORT_GROUPS = [
    {
        "topic": "Anxiety Support",
        "description": "A safe space to discuss anxiety and coping mechanisms.",
        "meeting_times": "Every Monday at 5 PM"
    },
    {
        "topic": "Depression Support",
        "description": "Group to share experiences and strategies to manage depression.",
        "meeting_times": "Every Wednesday at 6 PM"
    },
    {
        "topic": "Stress Management",
        "description": "Learn practical ways to reduce stress in daily life.",
        "meeting_times": "Every Friday at 4 PM"
    }
]

def seed_support_groups():
    # Adding support groups to the database for easy addition of groups manually without faker
    for group_data in SUPPORT_GROUPS:
        group = SupportGroup(
            topic=group_data["topic"],
            description=group_data["description"],
            meeting_times=group_data["meeting_times"]
        )
        db.session.add(group)
    db.session.commit()
    print(f"{len(SUPPORT_GROUPS)} support groups added successfully!")

if __name__ == '__main__':
    with app.app_context():
        print("Seeding manual support groups...")
        seed_support_groups()