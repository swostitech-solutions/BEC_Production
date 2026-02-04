#!/bin/bash
# Build command for Render.com deployment

set -o errexit

pip install -r requirements.txt

python manage.py migrate
python manage.py collectstatic --no-input
