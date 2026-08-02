const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function clearMocks() {
  await pool.query('DELETE FROM payments;');
  await pool.query('DELETE FROM payment_intents;');
  await pool.query('DELETE FROM reviews;');
  await pool.query('DELETE FROM issue_requests;');
  await pool.query('DELETE FROM quotes;');
  await pool.query('DELETE FROM quote_requests;');
  await pool.query('DELETE FROM bookings;');
  await pool.query('DELETE FROM diagnosis_results;');
  await pool.query('DELETE FROM diagnosis_media;');
  await pool.query('DELETE FROM diagnosis_sessions;');
  await pool.query('DELETE FROM diagnosis_requests;');
  console.log('Mock records cleared.');
  pool.end();
}
clearMocks();
