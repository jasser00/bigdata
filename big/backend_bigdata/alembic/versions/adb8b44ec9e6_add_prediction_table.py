# filepath: /home/jasser/Desktop/big/backend_bigdata/alembic/versions/adb8b44ec9e6_add_prediction_table.py
"""add prediction table

Revision ID: adb8b44ec9e6
Revises: fdcd5fd0c717
Create Date: 2025-12-10 23:47:08.992207

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('machine_id', sa.String(length=50), nullable=False),
        sa.Column('features', sa.JSON, nullable=False),
        sa.Column('prediction', sa.Float, nullable=False),
        sa.Column('model_version', sa.String(length=50), nullable=False),
        sa.Column('timestamp', sa.DateTime, server_default=sa.func.now()),
    )

def downgrade() -> None:
    op.drop_table('predictions')