const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = [...walk('app'), ...walk('components')];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace text-4xl lg:text-6xl -> text-4xl lg:text-[56px] in h1
  if (content.includes('<h1') && content.includes('lg:text-6xl')) {
    content = content.replace(/lg:text-6xl/g, 'lg:text-[56px]');
    changed = true;
  }

  // Same for clamp in HeroSection
  if (file.includes('HeroSection.tsx')) {
    content = content.replace(/text-\[clamp\([^)]+\)\]/g, 'text-4xl lg:text-[56px]');
    changed = true;
  }

  // Update wrapper spacing to pt-40 pb-24 relative overflow-hidden min-h-[100svh]
  if (file.includes('page.tsx')) {
    const wrapperRegex1 = /className="pt-40 pb-24 relative overflow-hidden"/g;
    const wrapperRegex2 = /className="pt-40 pb-24 relative overflow-hidden min-h-screen"/g;
    
    if (wrapperRegex1.test(content) || wrapperRegex2.test(content)) {
      content = content.replace(wrapperRegex1, 'className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]"');
      content = content.replace(wrapperRegex2, 'className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]"');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
