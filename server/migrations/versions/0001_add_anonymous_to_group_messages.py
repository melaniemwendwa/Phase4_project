"""add anonymous column to group_messages

Revision ID: 0001_add_anonymous_to_group_messages
Revises: 
Create Date: 2025-09-26 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_add_anonymous_to_group_messages'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN in older versions,
    # so guard by checking for the column via pragma. Use a safe SQL statement that will
    # add the column with a default value of 0 (False).
    conn = op.get_bind()
    result = conn.execute(sa.text("PRAGMA table_info('group_messages')")).fetchall()
    cols = [r[1] for r in result]
    if 'anonymous' not in cols:
        op.add_column('group_messages', sa.Column('anonymous', sa.Boolean(), nullable=False, server_default=sa.text('0')))


def downgrade():
    conn = op.get_bind()
    result = conn.execute(sa.text("PRAGMA table_info('group_messages')")).fetchall()
    cols = [r[1] for r in result]
    if 'anonymous' in cols:
        # SQLite cannot drop columns directly; for downgrade we'll attempt to recreate the table
        # without the anonymous column. This is a best-effort downgrade for development only.
        op.execute("CREATE TABLE IF NOT EXISTS _tmp_group_messages AS SELECT id, group_id, user_id, content, timestamp FROM group_messages;")
        op.execute("DROP TABLE group_messages;")
        op.execute("CREATE TABLE group_messages (id INTEGER PRIMARY KEY, group_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, timestamp DATETIME NOT NULL);")
        op.execute("INSERT INTO group_messages (id, group_id, user_id, content, timestamp) SELECT id, group_id, user_id, content, timestamp FROM _tmp_group_messages;")
        op.execute("DROP TABLE _tmp_group_messages;")