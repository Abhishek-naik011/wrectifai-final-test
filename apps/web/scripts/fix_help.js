const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/garage/help/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The </a> are on lines 81, 88, 95, 102, 109. They are standalone closing tags.
// Since we only replaced <a> with <Link> for coming-soon, let's just replace all </a> inside the Popular Help Articles section.
content = content.replace(/<\/a>/g, '</Link>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed help page syntax');
