const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/admin/garages/pending-approvals/page.tsx',
  'src/app/admin/service-requests/cancelled/page.tsx',
  'src/app/admin/service-requests/completed/page.tsx',
  'src/app/admin/service-requests/in-progress/page.tsx',
  'src/app/admin/service-requests/pending/page.tsx',
  'src/app/admin/users/page.tsx',
  'src/app/admin/users/verification/page.tsx',
];

for (const relPath of filesToFix) {
  const file = path.join(__dirname, relPath);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('MapPin') || (content.includes('<MapPin') && !content.includes('MapPin,'))) {
      // It has MapPin component but not in imports
      if (content.includes('lucide-react')) {
          content = content.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, "import {$1, MapPin} from 'lucide-react';");
      } else {
          content = "import { MapPin } from 'lucide-react';\n" + content;
      }
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed', relPath);
  }
}
