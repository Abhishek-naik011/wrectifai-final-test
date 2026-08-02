const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/pages/quotes/quotes-page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove compare mode state and logic
content = content.replace(/const \[compareMode, setCompareMode\] = useState\(false\);\s*/g, '');
content = content.replace(/const \[selectedQuoteIds, setSelectedQuoteIds\] = useState<string\[\]>\(\[\]\);\s*/g, '');
content = content.replace(/const selectedQuoteCount = selectedQuoteIds.length;\s*/g, '');
content = content.replace(/const canCompare = selectedQuoteCount >= 2;\s*/g, '');
content = content.replace(/const selectedLimitReached = selectedQuoteCount >= 3;\s*/g, '');

// Remove the Compare and Sort buttons section (the whole div containing them)
const sortFilterRegex = /<div className="mb-3 grid gap-3 sm:grid-cols-\[208px_192px\]">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(sortFilterRegex, '</div>');

// Remove the checkbox in quote card
const checkboxRegex = /{compareMode \? \([\s\S]*?\) : null}/;
content = content.replace(checkboxRegex, '');

// Update grid template
content = content.replace(/2xl:grid-cols-\[36px_minmax\(320px,1\.25fr\)_144px_312px\]/g, '2xl:grid-cols-[minmax(320px,1.25fr)_144px_312px]');
content = content.replace(/compareMode\s*\?\s*'2xl:grid-cols-\[minmax\(320px,1\.25fr\)_144px_312px\]'\s*:\s*'2xl:grid-cols-\[minmax\(320px,1\.25fr\)_144px_312px\]'/g, "'2xl:grid-cols-[minmax(320px,1.25fr)_144px_312px]'");

// Also there's a reference to compareMode in the grid classname
content = content.replace(/className=\{cn\(\s*'grid gap-4 pt-1 2xl:items-center',\s*compareMode[\s\S]*?\)\}/, "className={cn('grid gap-4 pt-1 2xl:items-center', '2xl:grid-cols-[minmax(320px,1.25fr)_144px_312px]')}");

fs.writeFileSync(file, content, 'utf8');
console.log('Simplified Customer Quotes page successfully.');
