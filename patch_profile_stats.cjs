const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `         <div class="px-6 md:px-12 mt-4 mb-8 w-full flex justify-center border-t border-zinc-200 dark:border-zinc-800 pt-8">`;

const insertion = `
         <div id="personal-stats-container" class="px-6 md:px-12 mt-12 w-full">
            <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Персональная статистика</h4>
            <div id="personal-stats-content" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
            </div>
         </div>
         <div class="px-6 md:px-12 mt-4 mb-8 w-full flex justify-center border-t border-zinc-200 dark:border-zinc-800 pt-8">`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
