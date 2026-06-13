const fs = require('fs');
const path = require('path');

const courseDataPath = path.join(__dirname, '../src/lib/courseData.js');
const fileContent = fs.readFileSync(courseDataPath, 'utf8');

let pos = 0;
let count = 0;
while ((pos = fileContent.indexOf('Hkg3wKVPznA', pos)) !== -1) {
  count++;
  // find line number
  const before = fileContent.substring(0, pos);
  const lineNum = before.split('\n').length;
  console.log(`Match ${count} at line ${lineNum}`);
  pos += 'Hkg3wKVPznA'.length;
}
