# 🚀 BEC Production - Render Deployment Guide

## 📋 Overview

This guide will help you deploy the BEC College Management System backend to Render.com using PostgreSQL database.

### Current Setup
- **Local**: MySQL database
- **Production (Render)**: PostgreSQL database
- **Framework**: Django 5.2.7
- **Python**: 3.13

---

## 🔄 What Changed for Render Deployment

### 1. **Database Migration: MySQL → PostgreSQL**
   - Local development continues to use MySQL
   - Production on Render uses PostgreSQL
   - Settings automatically detect environment via `RENDER` env var

### 2. **Files Modified**
   - ✅ `CollegeManagement/requirements.txt` - Added PostgreSQL, WhiteNoise, Gunicorn
   - ✅ `CollegeManagement/Swostitech_Acadix/settings.py` - Added environment detection
   - ✅ `render.yaml` - Blueprint for Render deployment
   - ✅ `build.sh` - Build script for Render

### 3. **Files Added**
   - `.env.render.example` - Example environment variables for Render

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes to Git**
   ```bash
   cd d:\BEC_Production
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Make build.sh executable** (if on Linux/Mac or deploying from GitHub)
   ```bash
   chmod +x build.sh
   ```

### Step 2: Deploy to Render

#### Option A: Using Render Blueprint (Recommended - One Click!)

1. **Push to GitHub** (if not already done)
   - Create a new GitHub repository
   - Push your code: `git push origin main`

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create:
     - PostgreSQL database: `bec-production-db`
     - Web service: `bec-production-backend`

3. **Set Manual Environment Variables**
   After blueprint deploys, go to your web service settings and add:
   
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   CSRF_TRUSTED_ORIGINS=https://your-app-name.onrender.com
   ```

#### Option B: Manual Setup

1. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Name: `bec-production-db`
   - Plan: Free
   - Region: Singapore (or your preferred region)
   - Click **"Create Database"**

2. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect your Git repository
   - Configure:
     - **Name**: `bec-production-backend`
     - **Environment**: Python 3
     - **Build Command**: `./build.sh`
     - **Start Command**: `gunicorn Swostitech_Acadix.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
     - **Plan**: Free

3. **Add Environment Variables**
   In the web service's Environment tab, add:

   ```bash
   # Auto-generate this
   SECRET_KEY=<click "Generate" button>
   
   # Database (from your PostgreSQL service)
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=<from database internal connection>
   DB_USERNAME=<from database internal connection>
   DB_PASSWORD=<from database internal connection>
   DB_HOST=<from database internal connection>
   DB_PORT=<from database internal connection>
   
   # Application
   DEBUG=False
   RENDER=True
   
   # Email (your Gmail settings)
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   
   # CSRF (add after you get your Render URL)
   CSRF_TRUSTED_ORIGINS=https://your-app-name.onrender.com
   ```

### Step 3: First Deployment

1. **Trigger Deploy**
   - Render will automatically build and deploy
   - Check logs for any errors
   - Wait for "Build successful" message

2. **Access Your App**
   - URL: `https://your-app-name.onrender.com/admin/`
   - First load may take 50-60 seconds (free tier cold start)

### Step 4: Create Superuser

After deployment, create an admin user:

```bash
# In Render dashboard, go to your web service
# Click "Shell" tab
python CollegeManagement/manage.py createsuperuser
```

Or use Render's "Run Command" feature.

---

## ⚠️ Important Notes

### Database Migration Differences

**MySQL vs PostgreSQL Considerations:**

1. **Auto-increment Fields**
   - MySQL: `AUTO_INCREMENT`
   - PostgreSQL: `SERIAL` or `SEQUENCE`
   - Django ORM handles this automatically ✅

2. **SQL Mode Setting**
   - MySQL has: `SET sql_mode='STRICT_TRANS_TABLES'`
   - PostgreSQL doesn't need this (removed for Render)

3. **Boolean Fields**
   - MySQL: `TINYINT(1)`
   - PostgreSQL: `BOOLEAN`
   - Django ORM handles this automatically ✅

4. **String Comparison**
   - MySQL: Case-insensitive by default
   - PostgreSQL: Case-sensitive by default
   - Use `.iexact`, `.icontains` in Django queries for case-insensitive

### Data Migration

If you have existing data in MySQL and need to move it to PostgreSQL:

```bash
# 1. Dump data from MySQL (local)
python manage.py dumpdata --natural-foreign --natural-primary \
    --exclude contenttypes --exclude auth.Permission \
    --indent 2 > data.json

# 2. Load data to PostgreSQL (on Render)
python CollegeManagement/manage.py loaddata data.json
```

### Media Files

⚠️ **Important**: Render's free tier has ephemeral storage. Media files uploaded by users will be lost on restart.

**Solutions:**
1. Use cloud storage (AWS S3, Cloudinary, etc.) - Recommended
2. Upgrade to Render paid plan with persistent disks
3. Store only reference data, not user uploads

Current media directory: `SWOSTITECH_CMS/`

---

## 🐛 Troubleshooting

### Build Failures

**Error: `mysqlclient` installation fails**
- Solution: Comment out `mysqlclient==2.2.6` in requirements.txt for Render (PostgreSQL only)

**Error: `permission denied: build.sh`**
```bash
chmod +x build.sh
git add build.sh
git commit -m "Make build.sh executable"
git push
```

### Runtime Errors

**Error: `DisallowedHost`**
- Add your Render URL to `ALLOWED_HOSTS` or use `ALLOWED_HOSTS = ['*']` (current setting)

**Error: Database connection refused**
- Check database environment variables match Render's internal connection string
- Verify database is in same region as web service

**Error: Static files not loading**
- Check `collectstatic` ran in build logs
- Verify WhiteNoise is in MIDDLEWARE

### Performance Issues

**Slow first request (50-60s)**
- This is normal on free tier (cold start)
- Upgrade to paid plan for always-on instances

**Database queries slow**
- Free PostgreSQL has limited resources
- Consider upgrading database plan
- Optimize queries with `select_related()` and `prefetch_related()`

---

## 🔒 Security Checklist

Before going live:

- [ ] `DEBUG = False` in production (✅ already set in render.yaml)
- [ ] Strong `SECRET_KEY` (✅ auto-generated by Render)
- [ ] `ALLOWED_HOSTS` configured
- [ ] HTTPS enabled (✅ automatic on Render)
- [ ] Environment variables secured (✅ Render keeps them secret)
- [ ] CSRF origins set correctly
- [ ] Database backups enabled (Render provides automatic backups)

---

## 📊 Monitoring

### Render Dashboard
- Real-time logs
- Metrics (CPU, Memory, Requests)
- Deployment history

### Django Admin
- Access at: `https://your-app.onrender.com/admin/`
- Monitor database records
- Manage users

---

## 💰 Cost Estimation

**Free Tier:**
- Web Service: Free (750 hours/month, sleeps after inactivity)
- PostgreSQL: Free (90 days, then $7/month)
- Bandwidth: 100 GB/month free

**Recommended for Production:**
- Web Service: $7/month (Starter plan)
- PostgreSQL: $7/month
- Total: ~$14/month

---

## 🔄 Local Development

Your local setup remains unchanged:
- Uses MySQL (as configured in your .env)
- Settings automatically detect local vs Render
- No changes needed to your workflow!

---

## 📞 Support

If you encounter issues:
1. Check Render logs in dashboard
2. Review Django error pages (set `DEBUG=True` temporarily)
3. Check database connection in Render shell
4. Verify all environment variables are set

---

## ✅ Deployment Checklist

Pre-deployment:
- [ ] All changes committed to Git
- [ ] `build.sh` is executable
- [ ] `.env` file NOT committed (it's gitignored ✅)
- [ ] GitHub repository created and pushed

Post-deployment:
- [ ] Database migrated successfully
- [ ] Static files serving correctly
- [ ] Admin panel accessible
- [ ] Superuser created
- [ ] Email configuration tested
- [ ] CSRF origins updated with actual Render URL

---

## 🎉 Success!

Once deployed, your application will be live at:
- **Backend API**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin/`

**Next Steps:**
1. Test all API endpoints
2. Configure your frontend to point to the new backend URL
3. Set up monitoring and alerts
4. Plan for regular database backups

---

**Questions?** Review the Render documentation: https://render.com/docs
