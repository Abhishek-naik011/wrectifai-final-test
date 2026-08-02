const fs = require('fs');
const path = require('path');

// Fix main-content.tsx
const mainContentPath = path.join(__dirname, '../src/components/home/main-content.tsx');
let mainContent = fs.readFileSync(mainContentPath, 'utf8');

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

if (!mainContent.includes('function PlaceholderSection')) {
  mainContent = mainContent.replace(/function SectionHeader/, placeholderCode + '\nfunction SectionHeader');
}
fs.writeFileSync(mainContentPath, mainContent, 'utf8');

// Fix quotes-page.tsx
const quotesPagePath = path.join(__dirname, '../src/pages/quotes/quotes-page.tsx');
let quotesPage = fs.readFileSync(quotesPagePath, 'utf8');

// quotes-page.tsx has `setSelectedQuoteIds` left over
// src/pages/quotes/quotes-page.tsx(358,31): error TS2304: Cannot find name 'setSelectedQuoteIds'.
quotesPage = quotesPage.replace(/onClick=\{\(\) => \{\s*setSelectedQuoteIds\(\(current\) =>\s*current\.includes\(quote\.id\)\s*\?\s*current\.filter\(\(item\) => item !== quote\.id\)\s*:\s*\[\.\.\.current, quote\.id\]\s*\);\s*\}\}/g, 'onClick={() => {}}');

fs.writeFileSync(quotesPagePath, quotesPage, 'utf8');

console.log('Fixed TS errors');
