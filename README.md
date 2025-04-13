# pricey-be

Cleaning up migrations

- Find the old .sql file(s) in `./drizzle` and copy name(s)
- In Terminal run `shasum -a 256 <file-path>`
- Remove the corresponding entry in `db/drizzle/__drizzle_migrations`
- Remove the .sql file(s)
- Remove the entries in `./drizzle/meta/_journal.json`