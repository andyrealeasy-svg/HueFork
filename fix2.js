import fs from 'fs';
let s = fs.readFileSync('main.js', 'utf8');
s = s.replace(/<button data-compare-btn.*?>Сравнить<\/button>\\n\s*/g, '');
s = s.replace(/<button onclick="window\.toggleCompare\(event, '\$\\{review\.id\\}'\)".*?>Сравнить<\/button>\\n\s*/g, '');
s = s.replace(/<button onclick="window\.toggleCompare\(event, '\$\\{review\.id\\}'\)".*?>Сравнить<\/button>\n\s*/g, '');
fs.writeFileSync('main.js', s);
