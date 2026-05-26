"""initial schema

Revision ID: 9a7befed844a
Revises:
Create Date: 2026-05-25

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "9a7befed844a"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enums
    meetingstatus = postgresql.ENUM(
        "scheduled", "completed", "cancelled", name="meetingstatus"
    )
    participantrole = postgresql.ENUM("organizer", "peserta", name="participantrole")
    attendancestatus = postgresql.ENUM(
        "pending", "hadir", "tidak_hadir", name="attendancestatus"
    )
    attendancemethod = postgresql.ENUM("manual", "link", name="attendancemethod")
    processingstatus = postgresql.ENUM(
        "queued", "transcribing", "diarizing", "extracting",
        "sending_email", "completed", "failed",
        name="processingstatus",
    )
    actionitemstatus = postgresql.ENUM("open", "done", name="actionitemstatus")
    emailtype = postgresql.ENUM("invitation", "distribution", name="emailtype")
    emailstatus = postgresql.ENUM("sent", "failed", name="emailstatus")

    for enum in [
        meetingstatus, participantrole, attendancestatus, attendancemethod,
        processingstatus, actionitemstatus, emailtype, emailstatus,
    ]:
        enum.create(op.get_bind(), checkfirst=True)

    # users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])

    # meetings
    op.create_table(
        "meetings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("organizer_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("agenda_text", sa.Text, nullable=True),
        sa.Column("tags", postgresql.ARRAY(sa.String), nullable=True),
        sa.Column(
            "status",
            sa.Enum("scheduled", "completed", "cancelled", name="meetingstatus"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["organizer_id"], ["users.id"], ondelete="CASCADE"),
    )

    # meeting_participants
    op.create_table(
        "meeting_participants",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column(
            "role",
            sa.Enum("organizer", "peserta", name="participantrole"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )

    # invitations
    op.create_table(
        "invitations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("participant_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token", sa.String(255), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["participant_id"], ["meeting_participants.id"], ondelete="CASCADE"
        ),
    )
    op.create_index("ix_invitations_token", "invitations", ["token"])

    # attendances
    op.create_table(
        "attendances",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("participant_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column(
            "status",
            sa.Enum("pending", "hadir", "tidak_hadir", name="attendancestatus"),
            nullable=False,
        ),
        sa.Column("checked_in_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "method",
            sa.Enum("manual", "link", name="attendancemethod"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["participant_id"], ["meeting_participants.id"], ondelete="CASCADE"
        ),
    )

    # recordings
    op.create_table(
        "recordings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column("file_url", sa.String(1000), nullable=False),
        sa.Column("duration", sa.Float, nullable=True),
        sa.Column("size", sa.BigInteger, nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "processing_status",
            sa.Enum(
                "queued", "transcribing", "diarizing", "extracting",
                "sending_email", "completed", "failed",
                name="processingstatus",
            ),
            nullable=False,
        ),
        sa.Column("processing_steps", postgresql.JSONB, nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
    )

    # transcripts
    op.create_table(
        "transcripts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column("segments", postgresql.JSONB, nullable=False),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
    )

    # summaries
    op.create_table(
        "summaries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False, unique=True),
        sa.Column("tldr", sa.Text, nullable=False),
        sa.Column("decisions", postgresql.JSONB, nullable=False),
        sa.Column("topics", postgresql.JSONB, nullable=False),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
    )

    # action_items
    op.create_table(
        "action_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("task", sa.Text, nullable=False),
        sa.Column("assignee_participant_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("due_date", sa.Date, nullable=True),
        sa.Column(
            "status",
            sa.Enum("open", "done", name="actionitemstatus"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["assignee_participant_id"],
            ["meeting_participants.id"],
            ondelete="SET NULL",
        ),
    )

    # email_logs
    op.create_table(
        "email_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("recipient", sa.String(255), nullable=False),
        sa.Column(
            "type",
            sa.Enum("invitation", "distribution", name="emailtype"),
            nullable=False,
        ),
        sa.Column("meeting_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "status",
            sa.Enum("sent", "failed", name="emailstatus"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["meeting_id"], ["meetings.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("email_logs")
    op.drop_table("action_items")
    op.drop_table("summaries")
    op.drop_table("transcripts")
    op.drop_table("recordings")
    op.drop_table("attendances")
    op.drop_table("invitations")
    op.drop_table("meeting_participants")
    op.drop_table("meetings")
    op.drop_table("users")

    for name in [
        "emailstatus", "emailtype", "actionitemstatus", "processingstatus",
        "attendancemethod", "attendancestatus", "participantrole", "meetingstatus",
    ]:
        sa.Enum(name=name).drop(op.get_bind(), checkfirst=True)
