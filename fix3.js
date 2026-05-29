import fs from 'fs';
let s = fs.readFileSync('main.js', 'utf8');
s = s.replace(/<button[^>]*>Сравнить<\/button>\\n\s*/g, '');
s = s.replace(/<button[^>]*>Сравнить<\/button>\n\s*/g, '');
fs.writeFileSync('main.js', s);
