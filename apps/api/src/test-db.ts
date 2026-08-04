import { query } from './config/database';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.mobile_number as phone, u.created_at as "joined", u.status,
       (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = u.id) as bookings,
       (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = u.id) as vehicles
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.code = 'user'
       ORDER BY u.created_at DESC`
    );
    console.log('Result length:', result.rows.length);
    console.log('First result:', result.rows[0]);
  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    process.exit(0);
  }
}

run();
