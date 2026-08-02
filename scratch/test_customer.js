const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function test() {
  await client.connect();
  const res = await client.query("SELECT u.id, u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE r.code = 'customer' LIMIT 1");
  if (res.rows.length === 0) return console.log('no user');
  
  const user = res.rows[0];
  const token = jwt.sign({ userId: user.id, roles: ['customer'] }, process.env.JWT_SECRET || 'wrectifai-super-secret-jwt-key-2024', { expiresIn: '1h' });
  
  const statsRes = await fetch('http://127.0.0.1:3000/api/v1/users/customer/stats', {
    headers: { Authorization: 'Bearer ' + token }
  });
  
  console.log('Status:', statsRes.status);
  const data = await statsRes.json();
  console.log(JSON.stringify(data, null, 2));
  await client.end();
}
test();
