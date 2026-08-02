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

const files = walk(path.join(__dirname, '../src'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Replace <a href="/coming-soon">...</a> with <Link href="/coming-soon">...</Link>
    if (content.includes('<a href="/coming-soon"')) {
        content = content.replace(/<a href="\/coming-soon"/g, '<Link href="/coming-soon"');
        content = content.replace(/<\/a>/g, (match, offset, str) => {
            // Very naive way to replace closing tag of <a href="/coming-soon">
            // A safer approach:
            return match; // Actually, just changing <a to <Link will cause mismatched tags if we don't change </a>
        });
        
        // Let's use a regex that captures the content inside the tag
        // Wait, standard Regex for this is tricky due to nesting, but since they are simple links:
        content = content.replace(/<a href="\/coming-soon"([^>]*)>(.*?)<\/a>/gs, '<Link href="/coming-soon"$1>$2</Link>');
        changed = true;
    }

    // Replace <a href="/admin/garages/pending-approvals" ...> with Link
    if (content.includes('<a href="/admin/garages/pending-approvals"')) {
        content = content.replace(/<a href="\/admin\/garages\/pending-approvals"([^>]*)>(.*?)<\/a>/gs, '<Link href="/admin/garages/pending-approvals"$1>$2</Link>');
        changed = true;
    }
    
    // Replace <a href="/admin/garages/register" ...> with Link
    if (content.includes('<a href="/admin/garages/register"')) {
        content = content.replace(/<a href="\/admin\/garages\/register"([^>]*)>(.*?)<\/a>/gs, '<Link href="/admin/garages/register"$1>$2</Link>');
        changed = true;
    }

    // 2. Replace window.location.href='/coming-soon' with router.push('/coming-soon')
    // Wait, replacing window.location requires useRouter setup, which is complex for a simple script.
    // Let's manually replace those two known instances in admin/dashboard/page.tsx.

    // If we used <Link>, ensure import Link from 'next/link' exists
    if (changed) {
        if (!content.includes("import Link from 'next/link'") && !content.includes('import Link from "next/link"')) {
            // Find the last import
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLastImport = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLastImport + 1) + "import Link from 'next/link';\n" + content.slice(endOfLastImport + 1);
            } else {
                content = "import Link from 'next/link';\n" + content;
            }
        }
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated routing in ${path.basename(file)}`);
    }
}
