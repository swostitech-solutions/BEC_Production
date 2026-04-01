# BEC Hostinger Parallel Deployment

- Public URL: `http://31.97.63.174:3006`
- Frontend via nginx: `3006`
- Backend via gunicorn: `127.0.0.1:8001`
- Database: PostgreSQL on the same VPS with a separate DB/user
- App path: `/var/www/bec-production`
- Frontend publish path: `/var/www/bec-production-frontend/build`
