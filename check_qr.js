const { query } = require('./apps/api/src/config/database'); 
async function main() { 
  const res = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'quote_requests'"); 
  console.log(res.rows); 
  process.exit(0); 
} 
main();
