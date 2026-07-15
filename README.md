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

```docker
docker run -d \
  --name pricey_images \
  -p 8003:9000 \
  -p 8004:9001 \
  -e MINIO_ROOT_USER=pricey_admin \
  -e MINIO_ROOT_PASSWORD=pricey_password \
  -v minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

Running Redis with Docker locally

- ```
  docker run -d --name redis-dev -p 6379:6379 redis
  docker ps -a
  ```

- Restart container/local database like local Postgres and Redis
  ```
  docker container ls -a
  docker container start pricey-db
  docker container start redis-dev
  ```

- Close container
  ```
  docker stop <container_id_or_name>
  ```