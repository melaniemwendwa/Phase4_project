#!/usr/bin/env python3
"""Add one long anonymous post per support group.

Run with: python3 server/add_anonymous_posts.py
"""
from faker import Faker
from datetime import datetime, timedelta

from app import app
from models import db, SupportGroup, SupportGroupPost

fake = Faker()

def make_long_body(paragraphs=6):
    return "\n\n".join(fake.paragraph(nb_sentences=8) for _ in range(paragraphs))

def main():
    with app.app_context():
        groups = SupportGroup.query.all()
        if not groups:
            print("No groups found — run seed first.")
            return

        created = []
        for group in groups:
            title = f"Anonymous Stories: {fake.sentence(nb_words=5)}"
            body = make_long_body(paragraphs=6)
            post = SupportGroupPost(
                group_id=group.id,
                user_id=0,  # anonymous
                header=title,
                body=body,
                links='[]',
                timestamp=datetime.utcnow() - timedelta(days=1)
            )
            db.session.add(post)
            created.append((group.id, group.topic, title))

        db.session.commit()
        print(f"Created {len(created)} anonymous posts:")
        for gid, topic, title in created:
            print(f" - group {gid} ({topic}): {title}")

if __name__ == '__main__':
    main()
