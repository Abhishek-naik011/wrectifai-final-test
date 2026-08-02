const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new',
});

async function run() {
  await client.connect();
  const hash = bcrypt.hashSync('Garage@123', 10);
  console.log('New hash:', hash);
  const oldHash = '$2b$10$Ts4mFbOYBqelIgnQWdc2cOFXAExrH2iTcr9kl2zhupGzx0SaCQ8ZW';
  const res = await client.query('UPDATE users SET password_hash = $1 WHERE password_hash = $2 RETURNING id, email', [hash, oldHash]);
  console.log('Updated users:', res.rows.length);
  res.rows.forEach(r => console.log('Fixed:', r.email));
  await client.end();
}
run().catch(console.error);
