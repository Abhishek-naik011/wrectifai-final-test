const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/WRECTIFIAI/wrectifai/apps/api/audit_output.json', 'utf8'));
console.log("Total garages: " + data.length);
