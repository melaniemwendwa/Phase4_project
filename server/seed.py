#!/usr/bin/env python3

# Standard library imports
from random import randint, choices

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, SupportGroup, User, Membership # Import User and Membership
from config import bcrypt # Import bcrypt to hash passwords

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Cleanup
        print("Clearing database...")
        SupportGroup.query.delete()
        User.query.delete()
        Membership.query.delete()
        db.session.commit()

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
            groups = []
            for group_data in SUPPORT_GROUPS:
                group = SupportGroup(
                    topic=group_data["topic"],
                    description=group_data["description"],
                    meeting_times=group_data["meeting_times"]
                )
                db.session.add(group)
                groups.append(group)
            db.session.commit()
            print(f"{len(groups)} support groups added successfully!")
            return groups

        def seed_users_and_memberships(groups):
            users = []
            print("Seeding users...")
            for i in range(10):  # Create 10 test users
                user = User(
                    email=fake.email(),
                    _password_hash=bcrypt.generate_password_hash('password').decode('utf-8')
                )
                users.append(user)
                db.session.add(user)
            db.session.commit()
            print(f"{len(users)} users added successfully!")
            
            print("Seeding memberships...")
            all_users = User.query.all()
            all_groups = SupportGroup.query.all()

            for user in all_users:
                # Give each user a random number of group memberships
                num_memberships = randint(1, 3) 
                
                # Pick a random sample of groups for the user to join
                random_groups = choices(all_groups, k=num_memberships)
                
                for group in random_groups:
                    membership = Membership(
                        user=user,
                        group=group,
                        role="member"
                    )
                    db.session.add(membership)
            db.session.commit()
            print("Memberships added successfully!")


if __name__ == '__main__':
    with app.app_context():
        print("Seeding manual support groups...")
        groups = seed_support_groups()
        seed_users_and_memberships(groups)
        print("Seed complete! 🌱")
