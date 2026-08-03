const jwt = require('jsonwebtoken');
const { Client } = require('pg');

async function testApi() {
  const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });
  await client.connect();
  const res = await client.query('SELECT id FROM users LIMIT 1');
  const userId = res.rows[0].id;
  await client.end();

  const token = jwt.sign(
    { userId: userId, roles: ['admin'] },
    '780da1f6bc164c25989f776d4b1531275ee0075c844841b2a8915cc558fe1d93',
    { expiresIn: '1h' }
  );

  const response = await fetch(`http://localhost:3000/api/v1/admin/users/${userId}/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const json = await response.json();
  console.log(json);
}

testApi();
