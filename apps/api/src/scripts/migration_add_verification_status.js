const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function runMigration() {
  await client.connect();
  try {
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified',
      ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
    `);
    
    // Attempt to insert into _migrations. Catch if _migrations doesn't have id unique constraint
    try {
      await client.query(`
        INSERT INTO _migrations (id, filename, applied_at) 
        VALUES (999, 'add_verification_to_users', NOW());
      `);
    } catch (e) {
      console.log('Migration record insert failed/skipped');
    }

    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
