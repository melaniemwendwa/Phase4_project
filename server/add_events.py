#!/usr/bin/env python3
"""Add a few imaginary events across existing support groups.

Run with: python3 server/add_events.py
"""
from datetime import datetime, timedelta
from random import choice, randint

from app import app
from models import db, SupportGroup, SessionEvent

EVENT_TEMPLATES = [
    ("Guided Breathwork", "A short guided breathwork practice to help ground and center."),
    ("Evening Reflection", "Small-group reflection and coping strategies for the week."),
    ("Sleep Prep Routine", "Techniques and routine suggestions to improve sleep quality."),
    ("Mindful Movement", "Gentle movement and mindfulness to ease tension."),
    ("Pain Management Q&A", "An expert Q&A on practical strategies for living with chronic pain."),
]

def build_future(dt_offset_days, hour=18):
    return (datetime.utcnow() + timedelta(days=dt_offset_days)).replace(hour=hour, minute=0, second=0, microsecond=0)


def main():
    with app.app_context():
        groups = SupportGroup.query.all()
        if not groups:
            print("No groups found in DB. Run the seed first.")
            return

        created = []
        # Spread 5 events across random groups (allow repeats)
        for i, tpl in enumerate(EVENT_TEMPLATES[:5]):
            grp = choice(groups)
            title, desc = tpl
            start = build_future(randint(1, 21), hour=10 + (i % 8))
            end = start + timedelta(hours=1)
            ev = SessionEvent(
                group_id=grp.id,
                title=f"{title}",
                description=desc,
                start_time=start,
                end_time=end
            )
            db.session.add(ev)
            created.append((grp.id, grp.topic, title, start.isoformat()))

        db.session.commit()
        print(f"Created {len(created)} events:")
        for g_id, topic, title, startiso in created:
            print(f" - group {g_id} ({topic}): {title} @ {startiso}")


if __name__ == '__main__':
    main()
