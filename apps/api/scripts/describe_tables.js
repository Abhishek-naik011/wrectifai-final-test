const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

pool.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name IN ('quotes', 'bookings')`)
.then(res => console.log(JSON.stringify(res.rows, null, 2)))
.catch(console.error)
.finally(() => pool.end());
