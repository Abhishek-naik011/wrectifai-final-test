import { query } from './database';

async function checkAndCleanup() {
  const ids = [
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
  ];
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');

  try {
    // Check if these garages are referenced in bookings or quotes
    // These are the most likely tables to reference garages
    const bookings = await query(`SELECT COUNT(*) FROM bookings WHERE garage_id IN (${placeholders})`, ids);
    const quotes = await query(`SELECT COUNT(*) FROM quotes WHERE garage_id IN (${placeholders})`, ids);
    
    console.log(`Bookings referencing duplicates: ${bookings.rows[0].count}`);
    console.log(`Quotes referencing duplicates: ${quotes.rows[0].count}`);

    if (parseInt(bookings.rows[0].count) > 0 || parseInt(quotes.rows[0].count) > 0) {
      console.log('Duplicates are referenced in active data (bookings/quotes). Cannot delete blindly.');
      process.exit(1);
    }

    console.log('No active references found. Deleting duplicate garages...');
    
    // Delete dependent tables first
    await query(`DELETE FROM services WHERE garage_id IN (${placeholders})`, ids);
    await query(`DELETE FROM garage_badges WHERE garage_id IN (${placeholders})`, ids);
    
    // Delete garages
    const res = await query(`DELETE FROM garages WHERE id IN (${placeholders})`, ids);
    console.log(`Deleted ${res.rowCount} duplicate garages successfully.`);
    
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    process.exit(0);
  }
}

checkAndCleanup();
