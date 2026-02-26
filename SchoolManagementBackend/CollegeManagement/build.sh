#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate --no-input

echo "Creating superuser..."
python create_superuser.py

echo "Build completed successfully!"
