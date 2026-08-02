const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function check() {
  const res = await pool.query('SELECT id, customer_id, symptom_text FROM diagnosis_requests');
  console.log(res.rows);
  pool.end();
}
check();
