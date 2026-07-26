import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

import { query } from '../config/database';

async function verifyCache() {
  const result = await query('SELECT key, image_url FROM vehicle_images_cache');
  for (const row of result.rows) {
    const url = row.image_url;
    console.log(`Checking ${row.key}: ${url}`);
    
    let isValid = true;
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      isValid = false;
    } else {
      try {
        const fetchRes = await fetch(url, { method: 'HEAD' });
        if (!fetchRes.ok) {
          isValid = false;
        }
      } catch (err) {
        isValid = false;
      }
    }

    if (!isValid) {
      console.log(`❌ Invalid URL. Deleting...`);
      await query('DELETE FROM vehicle_images_cache WHERE key = $1', [row.key]);
    } else {
      console.log(`✅ Valid.`);
    }
  }
  process.exit(0);
}

verifyCache().catch(console.error);
