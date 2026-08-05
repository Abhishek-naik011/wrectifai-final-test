const fs = require('fs');
const path = require('path');

function replaceLinkClosings(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match a Link tag and its contents until the closing </a>
  // Actually, a safer way is to just replace </a> with </Link> if the line has <Link
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Link ') && lines[i].includes('</a>')) {
      lines[i] = lines[i].replace(/<\/a>/g, '</Link>');
    }
  }
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

const filesToFix = [
  '../src/app/garage/help/page.tsx',
  '../src/app/garage/profile/page.tsx',
  '../src/app/garage/reviews/page.tsx',
  '../src/app/garage/settings/page.tsx',
  '../src/components/garages/ui/reusable-components.tsx'
];

filesToFix.forEach(f => {
  replaceLinkClosings(path.join(__dirname, f));
});

// Now fix main-content.tsx
const mainContentPath = path.join(__dirname, '../src/components/home/main-content.tsx');
let mainContent = fs.readFileSync(mainContentPath, 'utf8');

// The issue in main-content is:
/*
function SectionHeader({
  title,
  linkLabel,
  href,
}
function PlaceholderSection({ title, message }: { title: string; message: string }) {
  ...
}
: {
*/
mainContent = mainContent.replace(
  /function SectionHeader\(\{\s*title,\s*linkLabel,\s*href,\s*\}\s*function PlaceholderSection\(\{\s*title,\s*message\s*\}\s*:\s*\{\s*title:\s*string;\s*message:\s*string\s*\}\)\s*\{\s*return\s*\(\s*<section>[\s\S]*?<\/section>\s*\);\s*\}\s*:\s*\{/,
  `function SectionHeader({\n  title,\n  linkLabel,\n  href,\n}: {`
);

// We need to re-insert PlaceholderSection outside of SectionHeader
const placeholderCode = `
function PlaceholderSection({ title, message }: { title: string; message: string }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15.5px] font-semibold tracking-[-0.03em] text-[#17307a]">{title}</h2>
      </div>
      <Card className="flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50 border-dashed">
        <p className="text-sm">{message}</p>
      </Card>
    </section>
  );
}
`;

if (!mainContent.includes('PlaceholderSection')) {
  // Put it before SectionHeader
  mainContent = mainContent.replace(/function SectionHeader/, placeholderCode + '\nfunction SectionHeader');
}

fs.writeFileSync(mainContentPath, mainContent, 'utf8');
console.log('Fixed syntax errors.');
