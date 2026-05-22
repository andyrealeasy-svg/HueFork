import fs from 'fs';

let content = fs.readFileSync('main.js', 'utf8');

content = content.replace(/red-600/g, 'pink-600');
content = content.replace(/red-500/g, 'pink-500');
content = content.replace(/red-400/g, 'pink-400');
content = content.replace(/red-100/g, 'pink-100');

content = content.replace(/bg-\[#fff0f0\]/g, 'bg-pink-50');
content = content.replace(/border-\[#fff0f0\]/g, 'border-pink-50');
content = content.replace(/dark:bg-\[#1f0f0f\]/g, 'dark:bg-pink-950/50');
content = content.replace(/dark:border-\[#1f0f0f\]/g, 'dark:border-pink-950/50');
content = content.replace(/text-red-500/g, 'text-pink-500');

fs.writeFileSync('main.js', content);
console.log('Replaced colors successfully');
