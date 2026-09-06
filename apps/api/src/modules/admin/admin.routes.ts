import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate, requireRole } from '../../middleware/auth';
import { query } from '../../config/database';

export const adminRouter = Router();

// Apply auth and admin role requirements to all routes in this sub-router
adminRouter.use(authenticate);
adminRouter.use(requireRole(['admin']));

adminRouter.get('/stats', async (req, res) => {
  try {
    const customersCount = await query(`SELECT COUNT(*) FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE r.code = 'user'`);
    const totalGaragesCount = await query(`SELECT COUNT(*) FROM garages WHERE approval_status != 'deleted' OR approval_status IS NULL`);
    const approvedGaragesCount = await query(`SELECT COUNT(*) FROM garages WHERE (approval_status = 'approved' OR is_approved = true) AND approval_status != 'deleted'`);
    const pendingCount = await query(`SELECT COUNT(*) FROM garages WHERE (approval_status = 'pending' OR (approval_status != 'approved' AND (is_approved = false OR is_approved IS NULL))) AND (approval_status != 'deleted' AND approval_status != 'rejected' AND approval_status != 'suspended' OR approval_status IS NULL)`);
    const suspendedCount = await query(`SELECT COUNT(*) FROM garages WHERE approval_status = 'suspended'`);
    const bookingsCount = await query(`SELECT COUNT(*) FROM bookings WHERE status IN ('confirmed', 'inService')`);
    const quotesCount = await query(`SELECT COUNT(*) FROM quotes`);
    const serviceRequestsCount = await query(`SELECT COUNT(*) FROM quote_requests`);
    const completedJobsCount = await query(`SELECT COUNT(*) FROM bookings WHERE status = 'completed'`);

    const recentGarages = await query(`
      SELECT g.id, g.name, u.name as "ownerName", u.mobile_number as phone, g.city, g.created_at as "createdAt",
             CASE 
               WHEN g.approval_status = 'rejected' THEN 'rejected'
               WHEN g.approval_status = 'suspended' THEN 'suspended'
               WHEN g.approval_status = 'deleted' THEN 'deleted'
               WHEN g.approval_status = 'approved' OR g.is_approved = true THEN 'approved'
               ELSE 'pending'
             END as "approvalStatus"
      FROM garages g
      LEFT JOIN users u ON g.owner_user_id = u.id
      WHERE g.approval_status != 'deleted' OR g.approval_status IS NULL
      ORDER BY g.created_at DESC
      LIMIT 12
    `);

    const pendingGarageList = await query(`
      SELECT g.id, g.name, u.name as "ownerName", u.mobile_number as phone, g.city, g.created_at as "createdAt", 'pending' as "approvalStatus"
      FROM garages g
      LEFT JOIN users u ON g.owner_user_id = u.id
      WHERE (g.approval_status = 'pending' OR (g.approval_status != 'approved' AND (g.is_approved = false OR g.is_approved IS NULL)))
        AND (g.approval_status != 'deleted' AND g.approval_status != 'rejected' AND g.approval_status != 'suspended' OR g.approval_status IS NULL)
      ORDER BY g.created_at DESC
      LIMIT 10
    `);

    return success(res, {
      totalCustomers: parseInt(customersCount.rows[0].count),
      registeredGarages: parseInt(totalGaragesCount.rows[0].count),
      approvedGarages: parseInt(approvedGaragesCount.rows[0].count),
      pendingApprovals: parseInt(pendingCount.rows[0].count),
      suspendedGarages: parseInt(suspendedCount.rows[0].count),
      activeBookings: parseInt(bookingsCount.rows[0].count),
      quotesCount: parseInt(quotesCount.rows[0].count),
      serviceRequestsCount: parseInt(serviceRequestsCount.rows[0].count),
      completedJobsCount: parseInt(completedJobsCount.rows[0].count),
      recentlyRegisteredGarages: recentGarages.rows,
      pendingGarageList: pendingGarageList.rows
    });
  } catch (err) {
    return error(res, 'Failed to fetch admin stats', 'DATABASE_ERROR', 500);
  }
});

adminRouter.get('/onboarding/garages', async (req, res) => {
  try {
    const result = await query(
      `SELECT g.id, g.name, g.address, 
              CASE 
                WHEN g.approval_status = 'rejected' THEN 'rejected'
                WHEN g.approval_status = 'suspended' THEN 'suspended'
                WHEN g.approval_status = 'deleted' THEN 'deleted'
                WHEN g.approval_status = 'approved' OR g.is_approved = true THEN 'approved'
                ELSE 'pending'
              END as "approvalStatus", 
              g.is_approved as "isApproved",
              CASE WHEN g.is_approved = true THEN 'active' ELSE 'inactive' END as "status",
              COALESCE(
                (SELECT CASE 
                          WHEN gd.verification_status = 'approved' THEN 'verified'
                          ELSE gd.verification_status 
                        END 
                 FROM garage_documents gd 
                 WHERE gd.garage_id = g.id 
                 ORDER BY gd.created_at DESC LIMIT 1),
                'unverified'
              ) as "verificationStatus",
              g.created_at as "createdAt", g.updated_at as "updatedAt", g.city, g.state, g.postal_code as pincode, g.specializations as services, g.description,
              u.name as "ownerName", u.mobile_number as phone, u.email as "ownerEmail",
              u.status as "userStatus"
       FROM garages g
       LEFT JOIN users u ON g.owner_user_id = u.id
       WHERE g.approval_status != 'deleted' OR g.approval_status IS NULL
       ORDER BY g.created_at DESC`
    );
    return success(res, result.rows);
  } catch (err) {
    return error(res, 'Failed to fetch garages', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/onboarding/garages', async (req, res) => {
  try {
    const { name, email, registrationNumber, address, city, state, pincode, ownerName, description, services } = req.body;
    const phone = req.body.phone?.replace(/\s+/g, '');
    
    const regNum = registrationNumber?.trim() || '';
    if (!regNum) {
      return error(res, 'Registration number is required', 'VALIDATION_ERROR', 400);
    }
    const hasLetterOrNumber = /[a-zA-Z0-9]/.test(regNum);
    const hasInvalidChars = /[^a-zA-Z0-9\-\/\s]/.test(regNum);
    const isGibberish = /([a-zA-Z0-9]{2,})\1{2,}/.test(regNum) || /([a-zA-Z1-9])\1{4,}/.test(regNum);
    
    if (regNum.length < 5 || regNum.length > 30 || !hasLetterOrNumber || hasInvalidChars || isGibberish) {
      return error(res, 'Enter a valid garage registration number (5–30 characters; letters, numbers, / and - allowed).', 'VALIDATION_ERROR', 400);
    }
    
    // Enforce ONE PHONE = ONE ACCOUNT
    const userCheck = await query(
      `SELECT id FROM users WHERE (mobile_number = $1 AND $1 IS NOT NULL AND $1 != '') OR (email = $2 AND $2 IS NOT NULL AND $2 != '') LIMIT 1`,
      [phone || null, email || null]
    );

    if (userCheck.rows.length > 0) {
      return error(res, 'This phone number is already registered. Please use a different phone number.', 'CONFLICT', 409);
    }

    const newUser = await query(
      `INSERT INTO users (name, mobile_number, email, status) VALUES ($1, $2, $3, 'active') RETURNING id`,
      [ownerName || 'Garage Owner', phone || null, email || null]
    );
    const resolvedUserId = newUser.rows[0].id;
    
    const roleResult = await query("SELECT id FROM roles WHERE code = 'garage'");
    if (roleResult.rows.length > 0) {
      await query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [resolvedUserId, roleResult.rows[0].id]);
    }

    // New garage starts as pending approval
    const newGarage = await query(
      `INSERT INTO garages (name, address, city, state, postal_code, owner_user_id, approval_status, is_approved, description, specializations)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', false, $7, $8) RETURNING id`,
      [name, address, city, state, pincode, resolvedUserId, description || null, Array.isArray(services) ? services : null]
    );

    return success(res, { id: newGarage.rows[0].id }, 201);
  } catch (err) {
    return error(res, 'Failed to register garage', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/onboarding/garages/:id/photos', async (req, res) => {
  try {
    const garageId = req.params.id;
    const { photos } = req.body;

    if (!photos || !Array.isArray(photos)) {
      return error(res, 'Photos array is required', 'BAD_REQUEST', 400);
    }

    // Insert all photos
    for (const photo of photos) {
      if (typeof photo === 'string' && photo.trim() !== '') {
        await query(
          `INSERT INTO garage_photos (garage_id, url) VALUES ($1, $2)`,
          [garageId, photo]
        );
      }
    }

    return success(res, { message: 'Photos uploaded successfully' }, 201);
  } catch (err) {
    return error(res, 'Failed to upload photos', 'DATABASE_ERROR', 500);
  }
});

adminRouter.put('/onboarding/garages/:id', async (req, res) => {
  try {
    const { name, phone, email, address, city, state, pincode, ownerName } = req.body;
    const garageId = req.params.id;
    
    // First, update the garage
    const updateGarage = await query(
      `UPDATE garages 
       SET name = $1, address = $2, city = $3, state = $4, postal_code = $5 
       WHERE id = $6 RETURNING owner_user_id`,
      [name, address, city, state, pincode, garageId]
    );

    if (updateGarage.rows.length === 0) {
      return error(res, 'Garage not found', 'NOT_FOUND', 404);
    }

    const ownerUserId = updateGarage.rows[0].owner_user_id;

    // Update user if needed
    if (ownerUserId) {
      await query(
        `UPDATE users 
         SET name = $1, mobile_number = $2, email = $3 
         WHERE id = $4`,
        [ownerName, phone || null, email || null, ownerUserId]
      );
    }
    
    return success(res, { message: 'Garage updated successfully' });
  } catch (err) {
    return error(res, 'Failed to update garage', 'DATABASE_ERROR', 500);
  }
});

adminRouter.get('/onboarding/garages/:id/related-data', async (req, res) => {
  try {
    const garageId = req.params.id;
    const bookingsCount = await query(`SELECT COUNT(*) FROM bookings WHERE garage_id = $1`, [garageId]);
    const customersCount = await query(`SELECT COUNT(DISTINCT customer_id) FROM bookings WHERE garage_id = $1`, [garageId]);
    
    return success(res, {
      bookings: parseInt(bookingsCount.rows[0].count),
      customers: parseInt(customersCount.rows[0].count)
    });
  } catch (err) {
    return error(res, 'Failed to fetch related data', 'DATABASE_ERROR', 500);
  }
});

adminRouter.delete('/onboarding/garages/:id', async (req, res) => {
  try {
    const garageId = req.params.id;
    const result = await query(
      `UPDATE garages SET approval_status = 'deleted', is_approved = false WHERE id = $1 RETURNING id`,
      [garageId]
    );

    if (result.rows.length === 0) return error(res, 'Garage not found', 'NOT_FOUND', 404);
    
    return success(res, { success: true });
  } catch (err) {
    return error(res, 'Failed to delete garage', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/onboarding/garages/:id/verify-status', async (req, res) => {
  try {
    const { action } = req.body;
    if (!['verify', 'reject'].includes(action)) {
      return error(res, 'Invalid action', 'INVALID_ACTION', 400);
    }
    const docStatus = action === 'verify' ? 'approved' : 'rejected';
    const verificationStatus = action === 'verify' ? 'verified' : 'rejected';
    
    // Check if garage exists
    const garageCheck = await query(`SELECT id, approval_status, is_approved FROM garages WHERE id = $1`, [req.params.id]);
    if (garageCheck.rows.length === 0) return error(res, 'Garage not found', 'NOT_FOUND', 404);

    const isApproved = garageCheck.rows[0].approval_status === 'approved' || garageCheck.rows[0].is_approved === true;
    if (!isApproved) {
      return error(res, 'Garage must be approved before verification', 'INVALID_ACTION', 400);
    }

    // Upsert verification record into garage_documents with valid constraint status ('approved' | 'rejected' | 'pending')
    const docCheck = await query(`SELECT id FROM garage_documents WHERE garage_id = $1 LIMIT 1`, [req.params.id]);
    if (docCheck.rows.length > 0) {
      await query(
        `UPDATE garage_documents 
         SET verification_status = $1, reviewed_by = $2, reviewed_at = NOW() 
         WHERE garage_id = $3`,
        [docStatus, req.user?.userId || null, req.params.id]
      );
    } else {
      await query(
        `INSERT INTO garage_documents (garage_id, doc_type, file_url, verification_status, reviewed_by, reviewed_at)
         VALUES ($1, 'id_proof', '', $2, $3, NOW())`,
        [req.params.id, docStatus, req.user?.userId || null]
      );
    }
    
    return success(res, {
      garageId: req.params.id,
      verificationStatus: verificationStatus,
      reviewedBy: req.user?.userId,
      reviewedAt: new Date().toISOString(),
    });
  } catch (err) {
    return error(res, 'Failed to update garage verification status', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/onboarding/garages/:id/:action', async (req, res) => {
  try {
    const { action } = req.params;
    if (!['approve', 'reject', 'suspend', 'restore', 'activate', 'deactivate'].includes(action)) {
      return error(res, 'Invalid action', 'INVALID_ACTION', 400);
    }
    
    const garageQuery = await query(
      `SELECT g.id, 
              CASE 
                WHEN g.approval_status = 'rejected' THEN 'rejected'
                WHEN g.approval_status = 'suspended' THEN 'suspended'
                WHEN g.approval_status = 'deleted' THEN 'deleted'
                WHEN g.approval_status = 'approved' OR g.is_approved = true THEN 'approved'
                ELSE 'pending'
              END as "approvalStatus", 
              CASE WHEN g.is_approved = true THEN 'active' ELSE 'inactive' END as "status",
              COALESCE((SELECT CASE WHEN gd.verification_status = 'approved' THEN 'verified' ELSE gd.verification_status END 
               FROM garage_documents gd WHERE gd.garage_id = g.id ORDER BY gd.created_at DESC LIMIT 1), 'unverified') as "verificationStatus"
       FROM garages g WHERE g.id = $1`,
      [req.params.id]
    );

    if (garageQuery.rows.length === 0) return error(res, 'Garage not found', 'NOT_FOUND', 404);
    const garageState = garageQuery.rows[0];

    let result;
    if (action === 'approve') {
      result = await query(
        `UPDATE garages 
         SET approval_status = 'approved' 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved"`,
        [req.params.id]
      );
    } else if (action === 'reject') {
      result = await query(
        `UPDATE garages 
         SET approval_status = 'rejected', is_approved = false 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved"`,
        [req.params.id]
      );
    } else if (action === 'suspend') {
      result = await query(
        `UPDATE garages 
         SET approval_status = 'suspended', is_approved = false 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved"`,
        [req.params.id]
      );
    } else if (action === 'restore') {
      result = await query(
        `UPDATE garages 
         SET approval_status = 'approved', is_approved = true 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved"`,
        [req.params.id]
      );
    } else if (action === 'activate') {
      if (garageState.approvalStatus !== 'approved' || garageState.verificationStatus !== 'verified') {
        return error(res, 'Garage must be approved and verified before activation', 'INVALID_ACTION', 400);
      }
      result = await query(
        `UPDATE garages 
         SET is_approved = true 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved", 'active' as status`,
        [req.params.id]
      );
    } else if (action === 'deactivate') {
      if (garageState.status !== 'active') {
        return error(res, 'Garage must be active before deactivation', 'INVALID_ACTION', 400);
      }
      result = await query(
        `UPDATE garages 
         SET is_approved = false 
         WHERE id = $1 
         RETURNING id, approval_status as "approvalStatus", is_approved as "isApproved", 'inactive' as status`,
        [req.params.id]
      );
    }

    if (!result || result.rows.length === 0) return error(res, 'Garage not found', 'NOT_FOUND', 404);
    
    return success(res, {
      garageId: req.params.id,
      action,
      garage: result.rows[0],
      reviewedBy: req.user?.userId,
      reviewedAt: new Date().toISOString(),
    });
  } catch (err) {
    return error(res, 'Failed to update garage', 'DATABASE_ERROR', 500);
  }
});

adminRouter.get('/users', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.mobile_number as phone, u.created_at as "joined", u.status,
       p.address_line as address, p.city, p.state, p.postal_code as pincode,
       (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = u.id) as bookings,
       (
         SELECT json_agg(json_build_object(
           'vehicleNumber', v.plate_number,
           'vehicleBrand', v.make,
           'vehicleModel', v.model,
           'vehicleType', v.trim,
           'fuelType', v.fuel_type,
           'year', v.year,
           'mileage', v.mileage
         ))
         FROM vehicles v WHERE v.customer_id = u.id
       ) as vehicles_list
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE r.code = 'user'
       ORDER BY u.created_at DESC`
    );
    return success(res, result.rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    return error(res, 'Failed to fetch users', 'DATABASE_ERROR', 500);
  }
});

// Add a customer manually
adminRouter.post('/users', async (req, res) => {
  try {
    const { name, email, address, city, state, pincode, vehicleNumber, vehicleModel, vehicleBrand, vehicleType, mileage, fuelType, year, status } = req.body;
    const phone = req.body.phone?.replace(/\s+/g, '');
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return error(res, 'Name is required', 'VALIDATION_ERROR', 400);
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(res, 'A valid email is required', 'VALIDATION_ERROR', 400);
    }
    if (!phone || typeof phone !== 'string' || phone.trim() === '') return error(res, 'Phone is required', 'VALIDATION_ERROR', 400);
    if (!status || typeof status !== 'string' || status.trim() === '') return error(res, 'Status is required', 'VALIDATION_ERROR', 400);
    if (!address || typeof address !== 'string' || address.trim() === '') return error(res, 'Address is required', 'VALIDATION_ERROR', 400);
    if (!city || typeof city !== 'string' || city.trim() === '') return error(res, 'City is required', 'VALIDATION_ERROR', 400);
    if (!state || typeof state !== 'string' || state.trim() === '') return error(res, 'State is required', 'VALIDATION_ERROR', 400);
    if (!pincode || typeof pincode !== 'string' || pincode.trim() === '') return error(res, 'Pincode is required', 'VALIDATION_ERROR', 400);
    if (!vehicleNumber || typeof vehicleNumber !== 'string' || vehicleNumber.trim() === '') return error(res, 'Vehicle Number is required', 'VALIDATION_ERROR', 400);
    if (!vehicleBrand || typeof vehicleBrand !== 'string' || vehicleBrand.trim() === '') return error(res, 'Vehicle Brand is required', 'VALIDATION_ERROR', 400);
    if (!vehicleModel || typeof vehicleModel !== 'string' || vehicleModel.trim() === '') return error(res, 'Vehicle Model is required', 'VALIDATION_ERROR', 400);
    
    const mileageVal = mileage !== undefined && mileage !== null && String(mileage).trim() !== '' ? Number(mileage) : NaN;
    if (isNaN(mileageVal) || mileageVal < 0 || !Number.isInteger(mileageVal)) {
      return error(res, 'Please enter a valid mileage', 'VALIDATION_ERROR', 400);
    }

    if (!fuelType || typeof fuelType !== 'string' || fuelType.trim() === '') return error(res, 'Fuel Type is required', 'VALIDATION_ERROR', 400);
    if (!year || (typeof year !== 'string' && typeof year !== 'number') || String(year).trim() === '') return error(res, 'Year is required', 'VALIDATION_ERROR', 400);
    
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1 OR (mobile_number = $2 AND mobile_number IS NOT NULL)', [email, phone || null]);
    if (existing.rows.length > 0) return error(res, 'A user with this email or phone already exists', 'CONFLICT', 409);

    // 1. Insert user
    const userRes = await query(
      `INSERT INTO users (name, email, mobile_number, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, phone || null, status || 'active']
    );
    const user = userRes.rows[0];

    try {
      // 2. Get user role id
      const roleRes = await query(`SELECT id FROM roles WHERE code = 'user'`);
      if (roleRes.rows.length > 0) {
        await query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [user.id, roleRes.rows[0].id]);
      }

      // 3. Insert profile if address is provided
      if (address || city || state || pincode) {
        await query(
          `INSERT INTO profiles (id, user_id, address_line, city, state, postal_code)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
          [user.id, address || null, city || null, state || null, pincode || null]
        );
      }

      // 4. Insert vehicle if provided
      if (vehicleNumber || vehicleModel || vehicleBrand) {
        await query(
          `INSERT INTO vehicles (customer_id, plate_number, model, make, trim, fuel_type, year, mileage)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [user.id, vehicleNumber || null, vehicleModel || null, vehicleBrand || null, vehicleType || null, fuelType || null, year ? parseInt(String(year), 10) : null, mileageVal] 
        );
      }
    } catch (insertErr) {
      console.error('Partial insert failed, cleaning up user:', insertErr);
      await query(`DELETE FROM users WHERE id = $1`, [user.id]);
      return error(res, 'Failed to save customer details', 'DATABASE_ERROR', 500);
    }
    
    return success(res, user);
  } catch (err) {
    console.error('Add customer error:', err);
    return error(res, 'Failed to add customer', 'DATABASE_ERROR', 500);
  }
});

// GET /bookings
adminRouter.get('/bookings', async (req, res) => {
  try {
    const result = await query(
      `SELECT b.id, u.name as "customerName", g.name as "garageName", b.status, b.created_at as "createdAt",
              b.scheduled_at as "serviceDate", b.total_amount as "totalAmount", v.make as "vehicleMake", v.model as "vehicleModel"
       FROM bookings b
       LEFT JOIN users u ON b.customer_id = u.id
       LEFT JOIN garages g ON b.garage_id = g.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       ORDER BY b.created_at DESC`
    );
    return success(res, result.rows);
  } catch (err) {
    return error(res, 'Failed to fetch bookings', 'DATABASE_ERROR', 500);
  }
});

// Update customer status
adminRouter.post('/users/:id/:action', async (req, res) => {
  try {
    const { action } = req.params;
    if (!['verify', 'reject', 'suspend', 'activate'].includes(action)) {
      return error(res, 'Invalid action', 'INVALID_ACTION', 400);
    }
    
    const status = action === 'verify' || action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : 'rejected';
    
    const result = await query(
      `UPDATE users SET status = $1 WHERE id = $2 RETURNING id`,
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
    const userId = req.params.id;
    await query('DELETE FROM bookings WHERE customer_id = $1', [userId]);
    await query('DELETE FROM vehicles WHERE customer_id = $1', [userId]);
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rows.length === 0) return error(res, 'User not found', 'NOT_FOUND', 404);
    
    return success(res, { success: true });
  } catch (err) {
    return error(res, 'Failed to delete customer', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/service-requests', async (req, res) => {
  try {
    const { customerId, vehicleId, serviceType, priority, description, preferredDate, status } = req.body;
    
    // Ensure we have a valid vehicle ID to satisfy the foreign key constraint. We can query the first vehicle for this customer or fallback to a hardcoded UUID if needed, but it's best to require it or fallback gracefully.
    // If vehicleId is not provided, try to fetch the customer's first vehicle
    let resolvedVehicleId = vehicleId;
    if (!resolvedVehicleId && customerId) {
      const vRes = await query('SELECT id FROM vehicles WHERE customer_id = $1 LIMIT 1', [customerId]);
      if (vRes.rows.length > 0) resolvedVehicleId = vRes.rows[0].id;
    }
    
    const result = await query(
      `INSERT INTO quote_requests (customer_id, vehicle_id, issue_summary, preferred_date, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customerId || null, resolvedVehicleId || '00000000-0000-0000-0000-000000000002', description || serviceType || 'Issue not provided', preferredDate || null, status || 'open']
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
        `SELECT DISTINCT ON (qr.created_at) qr.id, u.name as "customerName", g.name as "garageName", 
                COALESCE(
                  NULLIF((SELECT string_agg(i->>'title', ', ') FROM diagnosis_results dres, jsonb_array_elements(dres.issues) i WHERE dres.diagnosis_request_id = qr.diagnosis_request_id), ''),
                  NULLIF((SELECT symptom_text FROM diagnosis_requests dr WHERE dr.id = qr.diagnosis_request_id), ''),
                  NULLIF(qr.issue_summary, ''),
                  'Issue not provided'
                ) as details, 
                qr.status,
                qr.created_at as "createdAt"
         FROM quote_requests qr
         LEFT JOIN users u ON qr.customer_id = u.id
         LEFT JOIN garages g ON qr.garage_id = g.id
         ORDER BY qr.created_at DESC`
      );
    return success(res, result.rows);
  } catch (err) {
    return error(res, 'Failed to fetch service requests', 'DATABASE_ERROR', 500);
  }
});



adminRouter.get('/quotes', async (req, res) => {
  try {
    const result = await query(
      `SELECT qr.id, u.name as "customerName", g.name as "garageName", q.amount as "totalAmount", 
              COALESCE(q.status, qr.status) as status, 
              qr.created_at as "createdAt"
       FROM quote_requests qr
       LEFT JOIN quotes q ON q.quote_request_id = qr.id
       LEFT JOIN users u ON qr.customer_id = u.id
       LEFT JOIN garages g ON qr.garage_id = g.id
       ORDER BY qr.created_at DESC`
    );
    return success(res, result.rows);
  } catch (err) {
    return error(res, 'Failed to fetch quotes', 'DATABASE_ERROR', 500);
  }
});

adminRouter.post('/quotes', async (req, res) => {
  try {
    const { customerId, garageId, amount, status } = req.body;
    const qrResult = await query(
      `INSERT INTO quote_requests (customer_id, status) VALUES ($1, 'pending') RETURNING id`,
      [customerId || null]
    );
    const qrId = qrResult.rows[0].id;
    
    const result = await query(
      `INSERT INTO quotes (quote_request_id, garage_id, amount, status)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [qrId, garageId || null, amount || 0, status || 'pending']
    );
    return success(res, result.rows[0]);
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to create quote', 'DATABASE_ERROR', 500);
  }
});

