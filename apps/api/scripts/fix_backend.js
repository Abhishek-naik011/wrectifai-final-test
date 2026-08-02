const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/modules/admin/admin.routes.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the buggy GET /users route
const oldGetUsers = /adminRouter\.get\('\/users', async \(req, res\) => \{[\s\S]*?\}\);/m;
const newGetUsers = `adminRouter.get('/users', async (req, res) => {
  try {
    const result = await query(
      \`SELECT u.id, u.name, u.email, u.mobile_number as phone, p.city as location, u.created_at as "joined", u.status,
       (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = u.id) as bookings,
       (SELECT COUNT(*) FROM vehicles v WHERE v.customer_id = u.id) as vehicles
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE r.code = 'customer'
       ORDER BY u.created_at DESC\`
    );
    return success(res, result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    return error(res, 'Failed to fetch users', 'DATABASE_ERROR', 500);
  }
});`;

// Replace the POST /users route to properly insert into users, profiles, and vehicles
const oldPostUsers = /adminRouter\.post\('\/users', async \(req, res\) => \{[\s\S]*?\}\);/m;
const newPostUsers = `adminRouter.post('/users', async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode, vehicleNumber, vehicleModel, vehicleBrand, vehicleType, status } = req.body;
    if (!name || !email) return error(res, 'Name and email are required', 'BAD_REQUEST', 400);
    
    // 1. Insert user
    const userRes = await query(
      \`INSERT INTO users (name, email, mobile_number, status)
       VALUES ($1, $2, $3, $4) RETURNING *\`,
      [name, email, phone || null, status || 'active']
    );
    const user = userRes.rows[0];

    // 2. Get customer role id
    const roleRes = await query(\`SELECT id FROM roles WHERE code = 'customer'\`);
    if (roleRes.rows.length > 0) {
      await query(\`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)\`, [user.id, roleRes.rows[0].id]);
    }

    // 3. Insert profile
    await query(
      \`INSERT INTO profiles (user_id, address_line, city, state, postal_code)
       VALUES ($1, $2, $3, $4, $5)\`,
      [user.id, address || null, city || null, state || null, pincode || null]
    );

    // 4. Insert vehicle if provided
    if (vehicleNumber || vehicleModel || vehicleBrand) {
      await query(
        \`INSERT INTO vehicles (customer_id, plate_number, model, make, trim, fuel_type)
         VALUES ($1, $2, $3, $4, $5, $6)\`,
        [user.id, vehicleNumber || null, vehicleModel || null, vehicleBrand || null, vehicleType || null, 'Petrol'] // default fuel
      );
    }
    
    return success(res, user);
  } catch (err) {
    console.error('Add customer error:', err);
    return error(res, 'Failed to add customer', 'DATABASE_ERROR', 500);
  }
});`;

// Replace the POST /service-requests route or append it
const newPostServiceRequest = `
adminRouter.post('/service-requests', async (req, res) => {
  try {
    const { customerId, vehicleId, serviceType, priority, description, preferredDate, status } = req.body;
    
    const result = await query(
      \`INSERT INTO diagnosis_requests (customer_id, vehicle_id, symptom_text, status)
       VALUES ($1, $2, $3, $4) RETURNING *\`,
      [customerId || null, vehicleId || null, description || null, status || 'pending']
    );
    
    return success(res, result.rows[0]);
  } catch (err) {
    console.error('Add service request error:', err);
    return error(res, 'Failed to create service request', 'DATABASE_ERROR', 500);
  }
});

adminRouter.get('/service-requests', async (req, res) => {
  try {
    const result = await query(
      \`SELECT d.id, u.name as "customerName", g.name as "garageName", d.symptom_text as details, d.status
       FROM diagnosis_requests d
       LEFT JOIN users u ON d.customer_id = u.id
       LEFT JOIN garages g ON g.id = null -- Needs explicit garage link if exists, diagnosis_requests doesn't have garage_id.
       ORDER BY d.created_at DESC\`
    );
    return success(res, result.rows);
  } catch (err) {
    return error(res, 'Failed to fetch service requests', 'DATABASE_ERROR', 500);
  }
});
`;

content = content.replace(oldGetUsers, newGetUsers);
content = content.replace(oldPostUsers, newPostUsers);
if (!content.includes('/service-requests')) {
  content += newPostServiceRequest;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed admin.routes.ts');
