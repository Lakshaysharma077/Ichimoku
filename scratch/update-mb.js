const fs = require('fs');
const files = [
  'app/cookies/page.tsx',
  'app/disclaimer/page.tsx',
  'app/education/page.tsx',
  'app/faq/page.tsx',
  'app/glossary/page.tsx',
  'app/ichimoku/page.tsx',
  'app/pricing/page.tsx',
  'app/privacy/page.tsx',
  'app/refund/page.tsx',
  'app/terms/page.tsx',
  'app/tools/page.tsx',
  'components/home/HeroSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const h1Regex = /(<h1[^>]+className="[^"]*)mb-\d+([^"]*")/g;
  if (h1Regex.test(content)) {
    content = content.replace(h1Regex, '$1mb-12$2');
    fs.writeFileSync(file, content);
    console.log('Fixed mb on', file);
  }
});
