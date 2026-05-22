import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/red-600/g, 'pink-600');
content = content.replace(/red-500/g, 'pink-500');
content = content.replace(/red-400/g, 'pink-400');
content = content.replace(/red-700/g, 'pink-700');

fs.writeFileSync('index.html', content);
console.log('Replaced colors successfully in index.html');
