const { Client } = require('pg');
async function check() {
  const c = new Client({connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new'});
  await c.connect();
  const res = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'quote_requests' AND column_name = 'is_deleted'");
  console.log(res.rows);
  await c.end();
}
check();
