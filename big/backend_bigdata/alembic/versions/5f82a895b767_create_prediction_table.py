"""create prediction table

Revision ID: 5f82a895b767
Revises: 
Create Date: 2025-12-10 23:14:40.748961

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy import Column, Integer, Float, String, DateTime

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