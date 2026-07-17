const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

code = code.replace(
    /<div class="hidden md:flex gap-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">[\s\S]*?<\/div>\s*<\/div>/,
    `<div class="flex gap-2 md:gap-8 text-center text-[8px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest ml-auto shrink-0 pl-2">
                        <div><span class="block text-black dark:text-white text-xs sm:text-lg font-serif font-black">\${item.prevRank}</span>Last</div>
                        <div><span class="block text-black dark:text-white text-xs sm:text-lg font-serif font-black">\${item.peak}</span>Peak</div>
                        <div><span class="block text-black dark:text-white text-xs sm:text-lg font-serif font-black">\${item.woc}</span>WOC</div>
                        <div><span class="block text-black dark:text-white text-xs sm:text-lg font-serif font-black">\${item.points}</span>Pts</div>
                    </div>
                </div>`
);

code = code.replace(
    /<div class="w-8 sm:w-12 text-center text-3xl sm:text-4xl font-serif font-black tracking-tighter text-black dark:text-white">\$\{item\.rank\}<\/div>/,
    '<div class="w-5 sm:w-12 text-center text-xl sm:text-4xl font-serif font-black tracking-tighter text-black dark:text-white">${item.rank}</div>'
);

code = code.replace(
    /<div class="w-10 sm:w-12 flex justify-center items-center">\$\{item\.statusStr\}<\/div>/,
    '<div class="w-8 sm:w-12 flex justify-center items-center">${item.statusStr}</div>'
);

code = code.replace(
    /<div class="font-serif font-black text-base sm:text-lg text-black dark:text-white uppercase truncate flex items-center gap-2">/,
    '<div class="font-serif font-black text-sm sm:text-lg text-black dark:text-white uppercase truncate flex items-center gap-1 sm:gap-2">'
);

code = code.replace(
    /<img src="\$\{rel\.cover\}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover shadow-sm rounded-sm">/,
    '<img src="${rel.cover}" class="w-10 h-10 sm:w-16 sm:h-16 object-cover shadow-sm rounded-[4px]">'
);

code = code.replace(
    /<div class="flex items-center gap-2 sm:gap-4 py-4 border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900\/50 transition-colors px-1 sm:px-2">/,
    '<div class="flex items-center gap-1 sm:gap-4 py-3 sm:py-4 border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors px-0 sm:px-2">'
);

code = code.replace(
    /text-yellow-600 dark:text-yellow-500 font-black uppercase text-\[10px\] sm:text-xs/,
    'text-yellow-600 dark:text-yellow-500 font-black uppercase text-[8px] sm:text-xs'
);

fs.writeFileSync('hueboard.js', code);
