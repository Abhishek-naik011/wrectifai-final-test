const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function getSchema() {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  for (const row of tables.rows) {
    console.log('TABLE:', row.table_name);
    const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1", [row.table_name]);
    cols.rows.forEach(c => console.log('  ', c.column_name, c.data_type));
  }
  pool.end();
}
getSchema();
