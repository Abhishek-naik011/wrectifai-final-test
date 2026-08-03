const { Client } = require('pg');

async function migrateStatuses() {
  const c = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });
  await c.connect();
  
  try {
    await c.query('BEGIN');
    
    // Drop checks if they exist
    await c.query('ALTER TABLE quote_requests DROP CONSTRAINT IF EXISTS quote_requests_status_check');
    await c.query('ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check');
    await c.query('ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check');

    console.log('Creating audit_logs table...');
    await c.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        old_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        user_id UUID,
        role VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Standardizing quote_requests status...');
    const statusMap = {
      'open': 'REQUESTED',
      'pending': 'REQUESTED',
      'selected': 'REQUESTED', 
      'quoted': 'QUOTE_SENT',
      'accepted': 'BOOKED', 
      'booked': 'BOOKED',
      'inspection': 'INSPECTION',
      'repair': 'REPAIR',
      'repairing': 'REPAIR',
      'ready': 'READY_FOR_DELIVERY',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED',
      'rejected': 'REJECTED'
    };

    for (const [oldStatus, newStatus] of Object.entries(statusMap)) {
      await c.query(`UPDATE quote_requests SET status = $1 WHERE LOWER(status) = $2`, [newStatus, oldStatus]);
      await c.query(`UPDATE bookings SET status = $1 WHERE LOWER(status) = $2`, [newStatus, oldStatus]);
      await c.query(`UPDATE quotes SET status = $1 WHERE LOWER(status) = $2`, [newStatus, oldStatus]);
    }
    
    // Convert any that didn't match perfectly to uppercase just in case they were already correct but lowercase
    await c.query(`UPDATE quote_requests SET status = UPPER(status)`);
    await c.query(`UPDATE bookings SET status = UPPER(status)`);
    await c.query(`UPDATE quotes SET status = UPPER(status)`);

    await c.query('COMMIT');
    console.log('Migration successful.');
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    await c.end();
  }
}

migrateStatuses();
