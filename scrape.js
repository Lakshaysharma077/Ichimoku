const fs = require('fs');
const content = fs.readFileSync('C:/Users/laksh/.gemini/antigravity-ide/brain/98535a6b-567f-4a2f-b656-7d7945d000d7/.system_generated/steps/62/content.md', 'utf8');

const titleMatch = content.match(/<title>(.*?)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'Not found');

const descMatch = content.match(/<meta property="og:description" content="([^"]+)"/);
console.log('Description:', descMatch ? descMatch[1] : 'Not found');

const jsonMatch = content.match(/window\.initData = (\{.*?\});/s);
if (jsonMatch) {
  try {
    const data = JSON.parse(jsonMatch[1]);
    console.log('Init Data parsed successfully!');
    if (data.pine && data.pine.script) {
       console.log('Script name:', data.pine.script.scriptName);
       console.log('Script description:', data.pine.script.description);
    } else {
       console.log('pine.script not found in initData');
       fs.writeFileSync('initData.json', JSON.stringify(data, null, 2));
    }
  } catch(e) {
    console.log('Failed to parse initData JSON:', e.message);
  }
}
