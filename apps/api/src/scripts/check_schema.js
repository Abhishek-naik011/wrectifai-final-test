const { Client } = require('pg');
async function check() {
  const c = new Client({connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new'});
  await c.connect();
  const res = await c.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_name IN ('bookings', 'quotes', 'quote_requests')");
  console.log(res.rows);
  await c.end();
}
check();
