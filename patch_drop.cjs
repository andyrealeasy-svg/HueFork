const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

// Replace banner HTML to fix mobile bug
code = code.replace(
    /<div class="relative z-10 p-8 md:p-12 flex items-center justify-between">.*?<\/div>\s*<\/div>\s*<\/div>/s,
    `<div class="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
                <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                   <img src="\${rel.cover}" class="w-40 h-40 md:w-48 md:h-48 rounded-xl shadow-lg border border-white/10 group-hover:rotate-3 transition-transform duration-500">
                   <div class="max-w-full">
                       <span class="bg-red-600 text-white font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Новинка в Дропе</span>
                       <h2 class="text-white text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none mb-2 break-words max-w-full">\${rel.title}</h2>
                       <p class="text-zinc-400 font-medium text-lg">\${artist?.name}</p>
                   </div>
                </div>
            </div>
        </div>`
);

fs.writeFileSync('drop.js', code);
