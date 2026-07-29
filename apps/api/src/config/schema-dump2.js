const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Smruti%4022@localhost:5432/wrectifai_new' });

async function getSchema() {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  let out = '';
  for (const row of tables.rows) {
    if (!['products', 'inventory', 'carts', 'orders', 'payments', 'reviews', 'garage_badges', 'notifications', 'refresh_tokens', 'known_issues', 'diagnose_issue_categories', 'promos', 'diagnose_questions', 'diagnose_possible_issues', 'diagnose_result_summaries', 'diagnose_next_steps', 'diagnose_trust_items', 'services', 'vehicle_images_cache', 'profiles', 'user_social_accounts', 'auth_sessions', 'vehicle_repair_history', 'diagnosis_sessions', 'issue_requests', 'payment_intents', 'support_tickets', 'part_orders', 'parts_catalog', 'otp_challenges', 'sms_events', 'runtime_app_config', 'garage_services', 'ui_content'].includes(row.table_name)) {
      out += 'TABLE: ' + row.table_name + '\n';
      const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1", [row.table_name]);
      cols.rows.forEach(c => out += '  ' + c.column_name + ' ' + c.data_type + '\n');
    }
  }
  console.log(out);
  pool.end();
}
getSchema();
