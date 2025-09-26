#!/usr/bin/env python3

# Standard library imports
from random import randint, choices

# Remote library imports
from faker import Faker

# Local imports
from .app import app
from .models import db, SupportGroup, User, Membership, SessionEvent, GroupMessage, SupportGroupPost
from .config import bcrypt  # Import bcrypt to hash passwords

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Recreate schema to ensure new models/columns exist
        print("Recreating database schema (drop_all + create_all)...")
        db.drop_all()
        db.create_all()
        print("Schema recreated.")

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
            ,
            {
                "topic": "Sleep Hygiene",
                "description": "Tips and routines to improve sleep quality.",
                "meeting_times": "Tuesdays at 8 PM"
            },
            {
                "topic": "Mindfulness & Meditation",
                "description": "Guided practices and reflections to build awareness.",
                "meeting_times": "Thursdays at 7 PM"
            },
            {
                "topic": "Grief Support",
                "description": "A compassionate place to share and process loss.",
                "meeting_times": "Sundays at 3 PM"
            },
            {
                "topic": "Chronic Pain Coping",
                "description": "Strategies to live better with chronic pain.",
                "meeting_times": "Mondays at 2 PM"
            },
            {
                "topic": "Eating Habits & Wellness",
                "description": "Support around mindful eating and body acceptance.",
                "meeting_times": "Wednesdays at 5 PM"
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
                    username=fake.user_name(),
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

        # Create posts, events, and messages for each group
        print("Seeding posts, events, and messages for each group...")
        from datetime import datetime, timedelta
        import json

        all_groups = SupportGroup.query.all()
        all_users = User.query.all()

        for group in all_groups:
            # pick 2 users as authors
            authors = choices(all_users, k=2)
            # create two posts
            for i, author in enumerate(authors):
                post = SupportGroupPost(
                    group_id=group.id,
                    user_id=author.id,
                    header=f"{group.topic} update #{i+1}",
                    body=fake.paragraph(nb_sentences=4),
                    links=json.dumps([fake.url()]) if randint(0,1) else json.dumps([]),
                    timestamp=datetime.utcnow() - timedelta(days=randint(0,7), hours=randint(0,23))
                )
                db.session.add(post)

            # create one event per group
            start = datetime.utcnow() + timedelta(days=randint(1,10))
            event = SessionEvent(
                group_id=group.id,
                title=f"{group.topic} session",
                description=fake.sentence(nb_words=8),
                start_time=start,
                end_time=start + timedelta(hours=1)
            )
            db.session.add(event)

            # create some messages (fake chat)
            for m in range(randint(2,5)):
                usr = choices(all_users, k=1)[0]
                msg = GroupMessage(
                    group_id=group.id,
                    user_id=usr.id,
                    anonymous=False,
                    content=fake.sentence(nb_words=randint(3,12)),
                    timestamp=datetime.utcnow() - timedelta(minutes=randint(1,2000))
                )
                db.session.add(msg)

        db.session.commit()
        print("Posts, events and messages seeded for each group.")


if __name__ == '__main__':
    with app.app_context():
        print("Seeding manual support groups...")
        groups = seed_support_groups()
        seed_users_and_memberships(groups)
        print("Seed complete! 🌱")
