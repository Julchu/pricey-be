# pricey-be

Installation reminders

- `npm install <package>`: `pnpm add <package>`
- `npm install --save-dev <package>`: `pnpm add -D <package>`

Cleaning up migrations

- Find the old .sql file(s) in `./drizzle` and copy name(s)
- In Terminal run `shasum -a 256 <file-path>`
- Remove the corresponding entry in `db/drizzle/__drizzle_migrations`
- Remove the .sql file(s)
- Remove the entries in `./drizzle/meta/_journal.json`

Running Postgres with Docker locally

- ```
  docker desktop start
  docker run --name pricey-db -e POSTGRES_USER=priceyadmin -e POSTGRES_PASSWORD=priceypassword -e POSTGRES_DB=pricey_db -p 5432:5432 -d postgres
  docker ps -a
  docker start pricey-db
  docker exec -it pricey-db bash
  psql -U priceyadmin -d pricey_db
  ```

  - URL to connect to: `postgres://priceyadmin:priceypassword@localhost:5432/pricey_db`
  - `--name pricey-db`: Container name (kebab-case, env-scoped — mirrors AWS RDS identifier convention)
  - `-e POSTGRES_USER=priceyadmin`: Db master username (no hyphens/underscores — mirrors AWS RDS master username
    rules)
  - `-e POSTGRES_PASSWORD=priceypassword`: Replace with a strong password (avoid `@`, `/`, `?` — safe for connection
    strings)
  - `-e POSTGRES_DB=pricey_db`: Database name (snake_case, env-scoped — PostgreSQL identifiers cannot contain hyphens)
  - `-p 5432:5432`: Exposes PostgreSQL on port 5432
  - `-d postgres`: Runs the official PostgreSQL image in the background

- Drop and recreate DB: log into separate database (`postgres`) to modify/delete main database (`pricey_db`)
  - `-U`: user
  - `-d`: database name

```
psql -U priceyadmin -d postgres
```

- Inside psql:
  - `\l`: view all databases
  - `\du`: view all users
  - Note: don't drop `postgres`, `template0`, or `template1` databases
  - Sometimes might need to enter postgres db to delete other db: `\c postgres`

```postgresql
DROP DATABASE your_database_name;
CREATE DATABASE your_database_name;
```

Running MinIO (S3-like image storage) with Docker locally

```bash
docker run -d \
  --name pricey_images \
  -p 8003:9000 \
  -p 8004:9001 \
  -e MINIO_ROOT_USER=pricey_admin \
  -e MINIO_ROOT_PASSWORD=pricey_password \
  -v minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

- `-p 8003:9000`: S3 API on the host — presigned uploads and public image URLs (use this port in `S3_ENDPOINT`, not `9000`)
- `-p 8004:9001`: MinIO web console at `http://localhost:8004`
- `-e MINIO_ROOT_USER` / `-e MINIO_ROOT_PASSWORD`: root credentials (same values as S3 access key / secret below)

**MinIO console login:** username `pricey_admin`, password `pricey_password`

**`.env.development` (local only):** point the backend at MinIO with the host-mapped API port:

```env
S3_REGION="us-east-1"
S3_ENDPOINT="http://localhost:8003"
S3_ACCESS_KEY_ID="pricey_admin"
S3_SECRET_ACCESS_KEY="pricey_password"
```

Leave `S3_ENDPOINT` unset in staging/production so the AWS SDK uses real S3.

Restart an existing MinIO container: `docker start pricey_images`

Running Redis with Docker locally

- ```
  docker run -d --name redis-dev -p 6379:6379 redis
  docker ps -a
  ```

- Restart container/local database like local Postgres and Redis

  ```
  docker container ls -a
  docker container start pricey-db
  docker container start pricey_images
  docker container start redis-dev
  ```

- Close container
  ```
  docker stop <container_id_or_name>
  ```
