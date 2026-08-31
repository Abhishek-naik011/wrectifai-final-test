import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { query } from '../../config/database';

export const usersRouter = Router();

usersRouter.get('/', (_req, res) => {
  res.json([{ id: 'u_1', name: 'Wrectifai User' }]);
});

usersRouter.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return error(res, 'Unauthorized', 'UNAUTHORIZED', 401);

    const { name, email, mobileNumber, profileImage } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return error(res, 'Name is required', 'VALIDATION_ERROR', 400);
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(res, 'A valid email is required', 'VALIDATION_ERROR', 400);
    }

    const phoneToSave = mobileNumber && mobileNumber.trim() !== '' ? mobileNumber.trim() : null;
    
    const result = await query(
      'UPDATE users SET name = $1, email = $2, mobile_number = $3 WHERE id = $4 RETURNING id, email, name, mobile_number as "mobileNumber", status',
      [name.trim(), email.trim().toLowerCase(), phoneToSave, userId]
    );

    if (result.rowCount === 0) {
      return error(res, 'User not found', 'NOT_FOUND', 404);
    }

    if (profileImage !== undefined) {
      if (profileImage === null || profileImage === '') {
        await query(
          `UPDATE profiles SET avatar_url = NULL WHERE user_id = $1`,
          [userId]
        );
      } else if (typeof profileImage === 'string') {
        await query(
          `INSERT INTO profiles (id, user_id, avatar_url) 
           VALUES (uuid_generate_v4(), $1, $2)
           ON CONFLICT (user_id) DO UPDATE SET avatar_url = $2`,
          [userId, profileImage]
        );
      }
    }

    const finalResult = { ...result.rows[0], profileImage };

    return success(res, finalResult);
  } catch (err: any) {
    console.error('Failed to update profile', err);
    if (err.code === '23505') {
      if (err.constraint?.includes('email')) {
        return error(res, 'Email is already in use', 'CONFLICT', 409);
      }
      if (err.constraint?.includes('mobile_number')) {
        return error(res, 'Mobile number is already in use', 'CONFLICT', 409);
      }
      return error(res, 'Resource already exists', 'CONFLICT', 409);
    }
    return error(res, 'Internal error', 'INTERNAL_SERVER_ERROR', 500);
  }
});

usersRouter.get('/customer/stats', authenticate, async (req, res) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return error(res, 'Unauthorized', 'UNAUTHORIZED', 401);

    const period = req.query.period as string || 'this-month';
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (period === 'this-month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'last-month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    } else if (period === 'last-3-months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'this-year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    let bookingsQuery = `
      SELECT COUNT(*) as count, MIN(scheduled_at) as next_booking
      FROM bookings 
      WHERE customer_id = $1 AND status IN ('pendingPayment', 'confirmed', 'in_progress', 'pending', 'accepted')
    `;
    const bookingsParams: any[] = [customerId];
    if (startDate && endDate) {
      bookingsParams.push(startDate.toISOString(), endDate.toISOString());
      bookingsQuery += ` AND scheduled_at >= $2 AND scheduled_at <= $3`;
    }

    const bookingsRes = await query(bookingsQuery, bookingsParams);

    // Pending Quotes Count (Quote requests with actual quotes that are not booked)
    let quotesQuery = `
      SELECT COUNT(DISTINCT q.id) as count
      FROM quotes q
      JOIN quote_requests qr ON q.quote_request_id = qr.id
      WHERE qr.customer_id = $1 AND NOT EXISTS (
        SELECT 1 FROM bookings b WHERE b.quote_id = q.id
      ) AND q.status NOT IN ('rejected', 'cancelled', 'expired')
    `;
    const quotesParams: any[] = [customerId];
    if (startDate && endDate) {
      quotesParams.push(startDate.toISOString(), endDate.toISOString());
      quotesQuery += ` AND q.created_at >= $2 AND q.created_at <= $3`;
    }
    const quotesRes = await query(quotesQuery, quotesParams);


    // Vehicles Count
    const vehiclesRes = await query(`
      SELECT COUNT(*) as count FROM vehicles WHERE customer_id = $1
    `, [customerId]);

    return success(res, {
      bookingsCount: Number(bookingsRes.rows[0].count || 0),
      nextBooking: bookingsRes.rows[0].next_booking,
      quotesCount: Number(quotesRes.rows[0].count || 0),
      vehiclesCount: Number(vehiclesRes.rows[0].count || 0),
      ordersCount: 0
    });
  } catch (err) {
    console.error('Failed to fetch customer stats', err);
    return error(res, 'Internal error', 'INTERNAL_SERVER_ERROR', 500);
  }
});
