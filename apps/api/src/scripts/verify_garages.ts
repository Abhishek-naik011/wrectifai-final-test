import { query } from '../config/database';

async function verify() {
  try {
    const countRes = await query('SELECT COUNT(*) FROM garages');
    const garages = await query('SELECT id, name FROM garages');
    
    console.log('Total Garage Rows:', countRes.rows[0].count);
    const names = garages.rows.map((r: any) => r.name);
    const uniqueNames = new Set(names);
    
    if (names.length !== uniqueNames.size) {
      console.log('DUPLICATE NAMES DETECTED');
    } else {
      console.log('No duplicate names.');
    }
    
    console.log(garages.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verify();
