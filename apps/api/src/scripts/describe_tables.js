import { query } from '../config/database.js';

async function describe() {
  try {
    const res = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'quote_requests';
    `);
    console.log('quote_requests:', res.rows);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
describe();
