import { query } from './apps/api/src/config/database';

async function main() {
  const res = await query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('garages', 'users', 'bookings', 'quotes')");
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
main();
