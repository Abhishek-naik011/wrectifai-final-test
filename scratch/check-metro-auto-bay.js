const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new'
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT id, name, owner_user_id FROM garages WHERE name ILIKE '%Metro Auto Bay%';
    `);
    console.table(res.rows);

    const usersRes = await pool.query(`
      SELECT id, email, role FROM users WHERE role = 'garage';
    `);
    console.table(usersRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
