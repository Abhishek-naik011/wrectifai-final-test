const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

const garagesData = [
  { name: 'Metro Auto Bay', email: 'metro@wrectifai.com', password: 'Metro@123' },
  { name: 'QuickPit Service Center', email: 'quickpit@wrectifai.com', password: 'QuickPit@123' },
  { name: 'SpeedFix Auto Care', email: 'speedfix@wrectifai.com', password: 'SpeedFix@123' },
  { name: 'AutoWorks Garage', email: 'autoworks@wrectifai.com', password: 'AutoWorks@123' },
  { name: 'Five Star Automotive', email: 'five@wrectifai.com', password: 'Five@123' },
  { name: 'Royal Motor Service', email: 'royal@wrectifai.com', password: 'Royal@123' },
  { name: 'PitStop Car Care', email: 'pitstop@wrectifai.com', password: 'PitStop@123' },
  { name: 'Prime Service Point', email: 'prime@wrectifai.com', password: 'Prime@123' },
  { name: 'TorquePlus Service Hub', email: 'torqueplus@wrectifai.com', password: 'TorquePlus@123' },
  { name: 'CarNest Workshop', email: 'carnest@wrectifai.com', password: 'CarNest@123' },
  { name: 'Urban Garage Works', email: 'urban@wrectifai.com', password: 'Urban@123' },
  { name: 'Galaxy Auto Garage', email: 'galaxy@wrectifai.com', password: 'Galaxy@123' }
];

async function updateLogins() {
  try {
    for (const garage of garagesData) {
      // Find the garage in the DB to get its owner_user_id
      const res = await pool.query('SELECT owner_user_id FROM garages WHERE name = $1', [garage.name]);
      if (res.rows.length === 0) {
        console.log(`❌ Garage not found: ${garage.name}`);
        continue;
      }
      
      const ownerId = res.rows[0].owner_user_id;
      if (!ownerId) {
         console.log(`❌ No owner associated with: ${garage.name}`);
         continue;
      }

      // Generate password hash
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(garage.password, salt);

      // Update the user
      await pool.query(
        'UPDATE users SET email = $1, password_hash = $2 WHERE id = $3',
        [garage.email, passwordHash, ownerId]
      );
      
      console.log(`✅ Updated ${garage.name} -> Email: ${garage.email}`);
    }
    console.log('🎉 Update complete!');
  } catch (err) {
    console.error('Error updating logins:', err);
  } finally {
    await pool.end();
  }
}

updateLogins();
