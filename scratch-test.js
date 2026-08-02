const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });
client.connect().then(() => {
  return client.query(`SELECT b.id, b.customer_id as "customerId", b.vehicle_id as "vehicleId", b.quote_id as "quoteId",
              b.scheduled_at as "scheduledAt", b.status, b.total_amount as "totalAmount", b.created_at as "createdAt",
              v.make as "vehicleMake", v.model as "vehicleModel", v.year as "vehicleYear", v.vin as "vehicleVin",
              u.name as "customerName", p.avatar_url as "customerAvatar",
              q.details as "quoteDetails", q.amount as "quoteAmount"
       FROM bookings b
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       LEFT JOIN users u ON b.customer_id = u.id
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN quotes q ON b.quote_id = q.id
       WHERE b.garage_id = $1 AND b.status = 'pending'
       ORDER BY b.created_at DESC`, ['550e8400-e29b-41d4-a716-446655440000']);
}).then(res => console.log('Status: 200 OK', res.rows))
  .catch(err => console.error('SQL Error:', err.message))
  .finally(() => client.end());
