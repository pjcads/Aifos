Controller standard
Service standard
Query helper usage
Response helper usage
Search/paging/sorting conventions
API response format
One migration per feature or milestone, not per table.
Separate schema and seed data into different migration files.
Never modify an executed migration. Create a new migration for changes.
Name migrations by feature, not by implementation detail.
Keep migrations idempotent when practical, especially seed scripts (e.g., INSERT ... ON DUPLICATE KEY UPDATE or existence checks) so reruns during development don't create duplicate data.