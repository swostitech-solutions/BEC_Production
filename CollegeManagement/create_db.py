import os
import sys
import psycopg2
from psycopg2 import sql

# Config
SUPERUSER = os.environ.get('PG_SUPERUSER', 'postgres')
SUPERPASS = os.environ.get('PG_SUPERPASS', 'Sunandita@19')
HOST = os.environ.get('PG_HOST', 'localhost')
PORT = os.environ.get('PG_PORT', '5432')
DB_NAME = os.environ.get('TARGET_DB', 'cmsdb')
DB_USER = os.environ.get('TARGET_USER', 'cmsuser')
DB_PASS = os.environ.get('TARGET_PASS', 'cmspassword')

try:
    conn = psycopg2.connect(dbname='postgres', user=SUPERUSER, password=SUPERPASS, host=HOST, port=PORT)
    conn.autocommit = True
    cur = conn.cursor()

    # Create role if not exists
    cur.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (DB_USER,))
    if not cur.fetchone():
        cur.execute(sql.SQL("CREATE ROLE {user} WITH LOGIN PASSWORD %s").format(user=sql.Identifier(DB_USER)), [DB_PASS])
        print(f"Created role {DB_USER}")
    else:
        print(f"Role {DB_USER} already exists")

    # Create database if not exists
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
    if not cur.fetchone():
        cur.execute(sql.SQL("CREATE DATABASE {db} OWNER {owner}").format(db=sql.Identifier(DB_NAME), owner=sql.Identifier(DB_USER)))
        print(f"Created database {DB_NAME}")
    else:
        print(f"Database {DB_NAME} already exists")

    cur.close()
    conn.close()
    print('Done')
except Exception as e:
    print('Error creating DB:', e)
    sys.exit(1)
