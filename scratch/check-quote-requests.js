const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new'
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT id, customer_id, garage_id, status FROM quote_requests ORDER BY created_at DESC LIMIT 5;
    `);
    console.table(res.rows);

    const bRes = await pool.query(`
      SELECT id, customer_id, garage_id, status FROM bookings ORDER BY created_at DESC LIMIT 5;
    `);
    console.table(bRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
