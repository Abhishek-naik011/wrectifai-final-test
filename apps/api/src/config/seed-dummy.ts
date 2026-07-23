import { query, getDbPool } from './database';

async function seed() {
  console.log('Seeding dummy user and garages...');
  try {
    let ownerId: string;

    // Check if any user exists
    const usersResult = await query('SELECT id FROM users LIMIT 1');
    if (usersResult.rows.length > 0) {
      ownerId = usersResult.rows[0].id;
      console.log(`Using existing user ID as owner: ${ownerId}`);
    } else {
      // If no users exist, create one
      ownerId = '00000000-0000-0000-0000-000000000001';
      await query(
        `INSERT INTO users (id, mobile_number, name, status)
         VALUES ($1, '9999999999', 'Seed Owner', 'active')`,
        [ownerId]
      );
      console.log(`Created new owner user: ${ownerId}`);
    }


    const dummyServices = [
      { name: 'Basic Oil Change', description: 'Engine oil and filter replacement', price: 1500.00, duration_mins: 45, category: 'Maintenance', is_active: true },
      { name: 'Brake Pad Replacement', description: 'Front and rear brake pad replacement', price: 2500.00, duration_mins: 90, category: 'Repairs', is_active: true },
      { name: 'Comprehensive Checkup', description: 'Full 50-point vehicle inspection', price: 999.00, duration_mins: 60, category: 'Inspection', is_active: true }
    ];

    const allGaragesResult = await query('SELECT id, name FROM garages');
    for (const g of allGaragesResult.rows) {
      await query(`DELETE FROM services WHERE garage_id = $1`, [g.id]);
      for (const s of dummyServices) {
        await query(
          `INSERT INTO services (garage_id, name, description, price, duration_mins, category, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [g.id, s.name, s.description, s.price, s.duration_mins, s.category, s.is_active]
        );
      }
      console.log(`Seeded services for garage: ${g.name}`);
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    const pool = getDbPool();
    await pool.end();
  }
}

seed();
