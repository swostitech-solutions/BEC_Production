# 🚀 Quick Deployment Commands

## Initial Setup (One-time)

```bash
# 1. Make build script executable (Git Bash on Windows, or Linux/Mac)
chmod +x build.sh

# 2. Commit all changes
git add .
git commit -m "Add Render deployment configuration"

# 3. Push to GitHub
git push origin main
```

## Deploy to Render

### Using Blueprint (Easiest - One Click!)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render auto-creates everything!

### After Blueprint Deploys

Add these environment variables in Render dashboard (Web Service → Environment):

```bash
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
CSRF_TRUSTED_ORIGINS=https://bec-production-backend.onrender.com
```

### Create Admin User

In Render Shell:
```bash
cd CollegeManagement
python manage.py createsuperuser
```

## Test Locally with PostgreSQL (Optional)

```bash
# Install PostgreSQL locally
# Update .env file:
DB_ENGINE=django.db.backends.postgresql
DB_NAME=college_db_local
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Run migrations
cd CollegeManagement
python manage.py migrate
python manage.py runserver
```

## Useful Commands

```bash
# Check migrations
python manage.py showmigrations

# Create new migration
python manage.py makemigrations

# Collect static files
python manage.py collectstatic

# Django shell
python manage.py shell

# Check for deployment issues
python manage.py check --deploy
```

## Render URLs

- Dashboard: https://dashboard.render.com/
- Your App: https://bec-production-backend.onrender.com
- Admin: https://bec-production-backend.onrender.com/admin/

## Common Issues

**Build fails on mysqlclient:**
```bash
# Comment out in requirements.txt:
# mysqlclient==2.2.6
```

**Static files not loading:**
```bash
# Check build logs for:
# "Collecting static files... Done"
```

**Database connection error:**
```bash
# Verify DATABASE_URL env vars in Render match your PostgreSQL service
```

## Monitoring

- **Logs**: Render Dashboard → Your Service → Logs
- **Metrics**: Render Dashboard → Your Service → Metrics
- **Database**: Render Dashboard → PostgreSQL Service → Info

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
