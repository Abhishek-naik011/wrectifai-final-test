const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' 
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    const tables = {};
    res.rows.forEach(r => {
      if(!tables[r.table_name]) tables[r.table_name] = [];
      tables[r.table_name].push(r.column_name);
    });
    console.log(tables);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

checkSchema();
