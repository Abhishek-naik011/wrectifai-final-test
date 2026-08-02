import { query } from '../config/database';

async function describe() {
  try {
    const res = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'quote_requests';
    `);
    console.log('quote_requests columns:', res.rows.map(r => r.column_name).join(', '));
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
describe();
