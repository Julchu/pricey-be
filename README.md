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
  docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
  docker ps -a
  docker exec -it my-postgres bash
  psql -U myuser -d mydb
  ```
    - URL to connect to: `postgres://myuser:mypassword@localhost:5432/mydb`
    - `--name my-postgres`: Names the container
    - `-e POSTGRES_USER=myuser`: Sets the database username
    - `-e POSTGRES_PASSWORD=mypassword`: Sets the password
    - `-e POSTGRES_DB=mydb`: Creates a database
    - `-p 5432:5432`: Exposes PostgreSQL on port 5432
    - `-d postgres`: Runs the official PostgreSQL image in the background

- Drop DB:
  ```
  psql -U postgres -d postgres
  -- Inside psql:
  DROP DATABASE your_database_name;
  CREATE DATABASE your_database_name;
  ```

Running Redis with Docker locally

- ```aiignore
  docker run -d --name redis-dev -p 6379:6379 redis
  docker ps -a
  ```

- Restart container/local database like local Postgres and Redis
  ```
  docker container ls -a
  docker container start my-postgres
  docker container start redis-dev
  ```

- Close container
  ```aiignore
  docker stop <container_id_or_name>
  ```