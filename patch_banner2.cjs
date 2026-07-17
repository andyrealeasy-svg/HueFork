const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

code = code.replace(
    /class="relative flex-1 p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20"/,
    'class="relative flex-1 p-3 sm:p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20"'
);

code = code.replace(
    /class="inline-block w-fit px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2 md:mb-4"/,
    'class="inline-block w-fit px-2 py-0.5 sm:px-3 sm:py-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full mb-1 sm:mb-2 md:mb-4"'
);

code = code.replace(
    /class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 uppercase leading-none truncate"/,
    'class="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 uppercase leading-none truncate"'
);

code = code.replace(
    /class="text-lg md:text-2xl text-zinc-300 font-medium truncate"/,
    'class="text-sm sm:text-lg md:text-2xl text-zinc-300 font-medium truncate"'
);

fs.writeFileSync('drop.js', code);
