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
# Fake migrations for columns that already exist in production DB
echo "Faking problematic migrations..."
python manage.py migrate ACADEMIC_DOCUMENTS 0003_add_document_fields --fake --no-input || true
python manage.py migrate Acadix 0003_attendance_lecture_lecture_academic_year_and_more --fake --no-input || true
python manage.py migrate Acadix 0004_studentfeereceiptheader_receipt_amount_and_more --fake --no-input || true

echo "Running remaining migrations..."
python manage.py migrate --no-input

echo "Creating superuser..."
python create_superuser.py

echo "Build completed successfully!"
