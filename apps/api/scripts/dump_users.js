const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function dumpUsers() {
  try {
    const res = await pool.query('SELECT id, email, name FROM users');
    console.log(res.rows);
  } finally {
    pool.end();
  }
}
dumpUsers();
