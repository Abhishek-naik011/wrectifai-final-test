const fs = require('fs');
const path = require('path');

const adminRoutesPath = path.join(__dirname, '../src/modules/admin/admin.routes.ts');
let content = fs.readFileSync(adminRoutesPath, 'utf8');

// Add endpoints for Garage (reject, suspend)
const garageActions = `
adminRouter.post('/onboarding/garages/:id/:action', async (req, res) => {
  try {
    const { action } = req.params;
    if (!['approve', 'reject', 'suspend'].includes(action)) {
      return error(res, 'Invalid action', 'INVALID_ACTION', 400);
    }
    const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'suspended';
    const is_approved = action === 'approve';
    
    const result = await query(
      \`UPDATE garages SET approval_status = $1, is_approved = $2 WHERE id = $3 RETURNING id\`,
      [status, is_approved, req.params.id]
    );
    if (result.rows.length === 0) return error(res, 'Garage not found', 'NOT_FOUND', 404);
    
    return success(res, {
      garageId: req.params.id,
      approvalStatus: status,
      reviewedBy: req.user?.userId,
      reviewedAt: new Date().toISOString(),
    });
  } catch (err) {
    return error(res, 'Failed to update garage', 'DATABASE_ERROR', 500);
  }
});
`;

if (!content.includes('/onboarding/garages/:id/:action')) {
  // Replace the existing approve route with the generic action route
  content = content.replace(/adminRouter\.post\('\/onboarding\/garages\/:id\/approve'[\s\S]*?}\);/, garageActions);
}

// Add endpoints for Users (add, verify, reject, suspend, delete)
const userActions = `
// Add a customer manually
adminRouter.post('/users', async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    // Basic validation
    if (!name || !email) return error(res, 'Name and email are required', 'BAD_REQUEST', 400);
    
    // Create the user in the database with customer role
    const result = await query(
      \`INSERT INTO users (name, email, phone, city, roles, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *\`,
      [name, email, phone || null, location || null, JSON.stringify(["customer"]), 'active']
    );
    
    // In a real app we would create an auth provider entry, send welcome email etc.
    return success(res, result.rows[0]);
  } catch (err) {
    return error(res, 'Failed to add customer', 'DATABASE_ERROR', 500);
  }
});

// Update customer status (verify, reject, suspend, activate)
adminRouter.post('/users/:id/:action', async (req, res) => {
  try {
    const { action } = req.params;
    if (!['verify', 'reject', 'suspend', 'activate'].includes(action)) {
      return error(res, 'Invalid action', 'INVALID_ACTION', 400);
    }
    
    const status = action === 'verify' || action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'rejected';
    
    const result = await query(
      \`UPDATE users SET status = $1 WHERE id = $2 RETURNING id\`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) return error(res, 'User not found', 'NOT_FOUND', 404);
    
    return success(res, { success: true, status });
  } catch (err) {
    return error(res, 'Failed to update customer status', 'DATABASE_ERROR', 500);
  }
});

// Delete customer
adminRouter.delete('/users/:id', async (req, res) => {
  try {
    // Hard delete for demo purposes. Note: Might fail if there are FK constraints not CASCADE.
    // So we first attempt to delete dependent records, or just soft delete. The prompt asks to "permanently removes".
    // For safety, we will delete from bookings, vehicles, and users.
    const userId = req.params.id;
    await query('DELETE FROM bookings WHERE customer_id = $1', [userId]);
    await query('DELETE FROM vehicles WHERE owner_id = $1', [userId]);
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rows.length === 0) return error(res, 'User not found', 'NOT_FOUND', 404);
    
    return success(res, { success: true });
  } catch (err) {
    return error(res, 'Failed to delete customer', 'DATABASE_ERROR', 500);
  }
});
`;

if (!content.includes('adminRouter.post(\'/users\'')) {
  content += '\n' + userActions;
}

fs.writeFileSync(adminRoutesPath, content, 'utf8');
console.log('Admin routes updated.');
