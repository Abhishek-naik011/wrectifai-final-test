const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function restoreGarage() {
  // 1. Get Admin Token
  const adminRes = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@wrectifai.com']);
  const adminId = adminRes.rows[0].id;
  const adminToken = jwt.sign({ userId: adminId, roles: ['admin'] }, '780da1f6bc164c25989f776d4b1531275ee0075c844841b2a8915cc558fe1d93');
  
  // 2. Call API to onboard garage
  const regRes = await fetch('http://localhost:3000/api/v1/admin/onboarding/garages', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
    body: JSON.stringify({ 
      name: 'Metro Auto Bay', 
      phone: '9876543210', 
      email: 'metro@garage.com', 
      address: 'Hitech City, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081'
    })
  });
  
  const regData = await regRes.json();
  console.log('Register Response:', regRes.status, regData);
  
  if (regRes.status === 201 || regRes.status === 200) {
    const garageId = regData.data.id;
    // Update missing rich metadata using DB (since API doesn't expose these fields yet)
    await pool.query(`
      UPDATE garages SET 
        specializations = $1, 
        rating_avg = 4.7, 
        rating_count = 142, 
        distance_km = '2.8 km', 
        response_mins = 25, 
        image = '/assets/garage_4_1778071611328.png',
        starting_price = 'Starting ₹549'
      WHERE id = $2
    `, [['Free Inspection', 'Warranty Available', 'Free Pickup', 'Quick Service'], garageId]);

    // Insert Badge
    await pool.query(`
      INSERT INTO garage_badges (garage_id, badge_key, active)
      VALUES ($1, 'topRated', true)
    `, [garageId]);
    
    console.log('Metro Auto Bay completely restored.');
  }
  
  process.exit(0);
}

restoreGarage().catch(console.error);
