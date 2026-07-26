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

import { VehicleImageService } from '../modules/vehicles/vehicle-image.service';

async function test() {
  try {
    const url = await VehicleImageService.getImageUrl('Chevrolet', 'Cruze', '2018');
    console.log('Success:', url);
  } catch (err) {
    console.error('Failed:', err);
  }
  process.exit(0);
}

test();
