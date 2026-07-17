const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const linkStr = `        <a href="#/archive" class="mobile-menu-link px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between">Архив ивентов <span class="text-red-500">→</span></a>
        <a href="#/drop" class="mobile-menu-link px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between text-yellow-600 dark:text-yellow-400">Дроп <span class="text-red-500">→</span></a>
        <a href="#/hueboard" class="mobile-menu-link px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between text-cyan-600 dark:text-cyan-400">HueBoard <span class="text-red-500">→</span></a>`;

code = code.replace(
    /        <a href="#\/archive".*?<\/a>/,
    linkStr
);

fs.writeFileSync('index.html', code);
