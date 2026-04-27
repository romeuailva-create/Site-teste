const fs = require('fs');
const path = 'script.js';
const imagePath = 'imagens/churros.jpeg';

const b64 = fs.readFileSync(imagePath).toString('base64');
let content = fs.readFileSync(path, 'utf8');
const rx = /churros:\s*"data:image\/jpeg;base64,[^\"]*"/;
if (!rx.test(content)) {
  console.error('NO MATCH');
  process.exit(1);
}
content = content.replace(rx, 'churros: "data:image/jpeg;base64,' + b64 + '"');
fs.writeFileSync(path, content, 'utf8');
console.log('REPLACED');
