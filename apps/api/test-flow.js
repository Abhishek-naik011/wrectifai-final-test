const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function run() {
  const adminRes = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@wrectifai.com']);
  const adminId = adminRes.rows[0].id;
  const adminToken = require('jsonwebtoken').sign({ userId: adminId, roles: ['admin'] }, '780da1f6bc164c25989f776d4b1531275ee0075c844841b2a8915cc558fe1d93');
  console.log('Admin login:', !!adminToken);

  const regRes = await fetch('http://localhost:3000/api/v1/admin/onboarding/garages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ name: 'Metro Auto Bay', phone: '9876543210', email: 'metro@garage.com', address: 'Demo Address' })
  });
  const regData = await regRes.json();
  console.log('Register Metro Auto Bay:', regRes.status, regData);

  const cntRes = await pool.query('SELECT count(*) FROM garages');
  console.log('Garage count:', cntRes.rows[0].count);

  const gRes = await pool.query("SELECT owner_user_id FROM garages WHERE name='Metro Auto Bay'");
  console.log('Metro Auto Bay Owner:', gRes.rows[0].owner_user_id);

  // Login as Metro Auto Bay
  const metroRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber: '9876543210', otp: '123456' })
  });
  const metroData = await metroRes.json();
  console.log('Metro Auto Bay Login:', metroRes.status, metroData);
  console.log('Garage Name in Token:', metroData.data?.user?.garageName);
  console.log('User roles:', metroData.data?.user?.roles);
  
  process.exit(0);
}
run().catch(console.error);
