const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function check() {
  try {
    const res = await pool.query(`
      SELECT pg_get_constraintdef(c.oid) AS constraint_def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'quotes' AND c.contype = 'c';
    `);
    console.log("quotes check:", res.rows);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
