"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import Column, Integer, String, Float, DateTime

def upgrade() -> None:
    op.create_table(
        'predictions',
        Column('id', Integer, primary_key=True),
        Column('machine_id', String, nullable=False),
        Column('temperature', Float, nullable=False),
        Column('humidity', Float, nullable=False),
        Column('prediction', Float, nullable=False),
        Column('timestamp', DateTime, server_default=func.now()),
    )

def downgrade() -> None:
    op.drop_table('predictions')