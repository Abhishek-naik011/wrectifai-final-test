const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
let replacedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('👋')) {
        content = content.replace(/👋/g, '');
        changed = true;
    }
    if (content.includes('📍')) {
        content = content.replace(/<span[^>]*>📍<\/span>/g, '<MapPin className="w-3 h-3 inline-block" />');
        content = content.replace(/📍/g, '<MapPin className="w-3 h-3 inline-block" />');
        changed = true;
    }
    if (content.includes('●')) {
        content = content.replace(/● /g, '');
        changed = true;
    }

    if (changed) {
        if (content.includes('<MapPin') && !content.includes('MapPin')) {
            // Need to add MapPin to lucide-react import
            if (content.includes('lucide-react')) {
                content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, MapPin} from 'lucide-react';");
            } else {
                content = "import { MapPin } from 'lucide-react';\n" + content;
            }
        }
        fs.writeFileSync(file, content, 'utf8');
        replacedCount++;
    }
}

console.log(`Replaced emojis in ${replacedCount} files.`);
