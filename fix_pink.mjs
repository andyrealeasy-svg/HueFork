import fs from 'fs';
let content = fs.readFileSync('main.js', 'utf8');

// Replace dark:border-pink-950/50 and dark:bg-pink-950/50 ONLY inside class attributes for score badges, NOT the document.body ones.
// Actually replacing all is fine EXCEPT the document.body.classList ones.

content = content.replace(/dark:border-pink-950\/50/g, 'dark:border-pink-950');
// We need to keep dark:bg-pink-950/50 only for document.body.classList
content = content.replace(/dark:bg-pink-950\/50/g, 'dark:bg-pink-950');
content = content.replace(/document\.body\.classList\.add\("bg-pink-50", "dark:bg-pink-950"\)/g, 'document.body.classList.add("bg-pink-50", "dark:bg-pink-950/50")');
content = content.replace(/document\.body\.classList\.remove\("bg-pink-50", "dark:bg-pink-950"\)/g, 'document.body.classList.remove("bg-pink-50", "dark:bg-pink-950/50")');

fs.writeFileSync('main.js', content);
