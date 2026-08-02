const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/components/home/main-content.tsx');
let content = fs.readFileSync(file, 'utf8');

const placeholderComponent = `
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

if (!content.includes('PlaceholderSection')) {
  // Insert PlaceholderSection after SectionHeader
  content = content.replace(/(function SectionHeader[\s\S]*?\}[\s\n]*)/, '$1' + placeholderComponent);
}

// Replace CategoryGrid invocation
content = content.replace(/<CategoryGrid[\s\S]*?\/>/g, '<PlaceholderSection title="Shop by Categories" message="Categories feature is coming soon." />');

// Replace MaintenanceStrip invocation
content = content.replace(/<MaintenanceStrip[\s\S]*?\/>/g, '<PlaceholderSection title="Recommended Preventive Maintenance Services" message="Maintenance recommendations coming soon." />');

// Replace CareTips invocation
content = content.replace(/<CareTips[\s\S]*?\/>/g, '<PlaceholderSection title="Car Care Tips" message="Car care tips coming soon." />');

fs.writeFileSync(file, content, 'utf8');
console.log('Cleaned Customer Dashboard successfully.');
