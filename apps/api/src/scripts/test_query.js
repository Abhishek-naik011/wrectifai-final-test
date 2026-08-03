const { Client } = require('pg');
async function test() {
  const c = new Client({connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new'});
  await c.connect();
  try {
    const res = await c.query(`
      SELECT 
         qr.id, 
         u.name as "customerName", 
         u.mobile_number as "customerPhone",
         u.email as "customerEmail",
         g.name as "garageName", 
         qr.issue_summary as details, 
         qr.status,
         CASE 
           WHEN qr.status = 'open' THEN 'Pending'
           WHEN qr.status = 'selected' THEN 'Garage Selected'
           WHEN qr.status = 'quoted' THEN 'Quote Sent'
           WHEN qr.status = 'accepted' THEN 'Accepted'
           WHEN qr.status = 'inspection' THEN 'Inspection'
           WHEN qr.status = 'repair' THEN 'Repair'
           WHEN qr.status = 'ready' THEN 'Ready for Delivery'
           WHEN qr.status = 'completed' THEN 'Completed'
           WHEN qr.status = 'cancelled' THEN 'Cancelled'
           WHEN qr.status = 'rejected' THEN 'Rejected'
           ELSE qr.status 
         END as "displayStatus",
         v.make || ' ' || v.model as vehicle,
         qr.created_at as "createdAt",
         qr.preferred_date as "preferredDate",
         dr.symptom_text as "notes",
         dres.issues as "diagnosis",
         q.id as "quoteId",
         q.total_cost as "quoteCost",
         b.id as "bookingId",
         b.status as "bookingStatus",
         b.scheduled_at as "bookingDate"
       FROM quote_requests qr
       LEFT JOIN users u ON qr.customer_id = u.id
       LEFT JOIN garages g ON qr.garage_id = g.id
       LEFT JOIN vehicles v ON qr.vehicle_id = v.id
       LEFT JOIN diagnosis_requests dr ON qr.diagnosis_request_id = dr.id
       LEFT JOIN diagnosis_results dres ON dr.id = dres.diagnosis_request_id
       LEFT JOIN quotes q ON q.quote_request_id = qr.id
       LEFT JOIN bookings b ON b.quote_id = q.id
       WHERE qr.is_deleted = false OR qr.is_deleted IS NULL LIMIT 1
    `);
    console.log(res.rows);
  } catch(e) {
    console.error(e.message);
  } finally {
    await c.end();
  }
}
test();
