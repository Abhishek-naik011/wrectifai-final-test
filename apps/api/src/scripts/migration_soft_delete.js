const { Client } = require('pg');

async function migrate() {
  const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });
  await client.connect();
  
  try {
    await client.query('ALTER TABLE quote_requests ADD COLUMN is_deleted BOOLEAN DEFAULT false');
    await client.query('ALTER TABLE quote_requests ADD COLUMN deleted_at TIMESTAMP');
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await client.end();
  }
}

migrate();
