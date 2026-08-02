const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function run() {
  try {
    const r1 = await pool.query("SELECT DISTINCT status FROM quote_requests");
    console.log('quote_requests:', r1.rows.map(r => r.status));
    const r2 = await pool.query("SELECT DISTINCT status FROM quotes");
    console.log('quotes:', r2.rows.map(r => r.status));
    const r3 = await pool.query("SELECT DISTINCT status FROM bookings");
    console.log('bookings:', r3.rows.map(r => r.status));
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
