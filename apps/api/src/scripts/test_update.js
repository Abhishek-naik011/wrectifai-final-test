const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function run() {
  await client.connect();
  try {
    const r = await client.query(`UPDATE users SET status='active', verified=true, verification_status='verified' WHERE email IS NOT NULL RETURNING id`);
    console.log('Update success', r.rowCount);
  } catch (err) {
    console.error('SQL Error:', err);
  } finally {
    await client.end();
  }
}

run();
