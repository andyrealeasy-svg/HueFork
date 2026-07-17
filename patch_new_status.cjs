const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');
code = code.replace(
    'text-yellow-500 font-bold uppercase text-[10px]',
    'text-yellow-600 dark:text-yellow-500 font-black uppercase text-[10px] sm:text-xs'
);
fs.writeFileSync('hueboard.js', code);
