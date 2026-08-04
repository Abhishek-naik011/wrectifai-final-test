const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wrectifai',
  password: 'admin',
  port: 5432,
});

async function main() {
  const result = await pool.query("SELECT id, name, approval_status, deleted_at FROM garages WHERE name ILIKE '%Metro Auto Bay%';");
  console.log('Result:', result.rows);
  process.exit(0);
}

main().catch(console.error);
