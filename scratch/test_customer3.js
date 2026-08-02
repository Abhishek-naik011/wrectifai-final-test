const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function test() {
  await client.connect();
  const res = await client.query("SELECT id FROM users LIMIT 1");
  const user = res.rows[0];
  const token = jwt.sign({ userId: user.id, roles: ['customer'] }, '780da1f6bc164c25989f776d4b1531275ee0075c844841b2a8915cc558fe1d93', { expiresIn: '1h' });
  const statsRes = await fetch('http://127.0.0.1:3000/api/v1/users/customer/stats', {
    headers: { Authorization: 'Bearer ' + token }
  });
  console.log('Status:', statsRes.status);
  const data = await statsRes.json();
  console.log(JSON.stringify(data, null, 2));
  await client.end();
}
test();
