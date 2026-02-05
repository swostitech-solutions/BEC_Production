# Production settings for Render.com
# This is a template for production settings.py

SECRET_KEY = 'your-super-secret-key-change-this-in-production'
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com', '*.onrender.com']

# Database configuration for production
# Use PostgreSQL instead of SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'college_management',
        'USER': 'postgres',
        'PASSWORD': 'Sunandita@19',
        # 'HOST': 'your_db_host.postgres.render.com',
        'HOST': 'localhost',

        'PORT': '5432',
    }
}

# Security settings for production
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
