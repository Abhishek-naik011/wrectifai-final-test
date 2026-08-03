const { Client } = require('pg');

async function reverseMigrateStatuses() {
  const c = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });
  await c.connect();
  
  try {
    await c.query('BEGIN');
    
    console.log('Reverting quote_requests status...');
    const qrMap = {
      'REQUESTED': 'open',
      'QUOTE_SENT': 'quoted',
      'BOOKED': 'selected',
      'ACCEPTED': 'selected',
      'INSPECTION': 'open',
      'REPAIR': 'repairing',
      'READY_FOR_DELIVERY': 'ready',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'REJECTED': 'rejected'
    };
    for (const [newStatus, oldStatus] of Object.entries(qrMap)) {
      await c.query(`UPDATE quote_requests SET status = $1 WHERE status = $2`, [oldStatus, newStatus]);
    }
    
    console.log('Reverting bookings status...');
    const bMap = {
      'REQUESTED': 'pendingPayment',
      'QUOTE_SENT': 'pendingPayment',
      'BOOKED': 'confirmed',
      'ACCEPTED': 'confirmed',
      'INSPECTION': 'inService',
      'REPAIR': 'inService',
      'READY_FOR_DELIVERY': 'inService',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'REJECTED': 'cancelled'
    };
    for (const [newStatus, oldStatus] of Object.entries(bMap)) {
      await c.query(`UPDATE bookings SET status = $1 WHERE status = $2`, [oldStatus, newStatus]);
    }

    console.log('Reverting quotes status...');
    const qMap = {
      'REQUESTED': 'open',
      'QUOTE_SENT': 'quoted',
      'BOOKED': 'selected',
      'ACCEPTED': 'selected',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'REJECTED': 'rejected'
    };
    for (const [newStatus, oldStatus] of Object.entries(qMap)) {
      await c.query(`UPDATE quotes SET status = $1 WHERE status = $2`, [oldStatus, newStatus]);
    }

    await c.query('COMMIT');
    console.log('Reverse Migration successful.');
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    await c.end();
  }
}

reverseMigrateStatuses();
