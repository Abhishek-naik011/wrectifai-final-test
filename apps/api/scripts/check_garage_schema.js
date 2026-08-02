const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function getColumns() {
  try {
    const res1 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'garages'
    `);
    console.log("Garages:", res1.rows);
    
    const res2 = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log("Users:", res2.rows);

    const res3 = await pool.query('SELECT * FROM garages LIMIT 5');
    console.log("Garage rows:", res3.rows);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
getColumns();
