const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

code = code.replace(
    /class="relative flex-1 p-3 sm:p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20"/,
    'class="relative flex-1 p-3 sm:p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20 min-w-0"'
);

code = code.replace(
    /class="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 uppercase leading-none truncate"/,
    'class="text-lg sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 uppercase leading-none truncate"'
);

code = code.replace(
    /class="text-sm sm:text-lg md:text-2xl text-zinc-300 font-medium truncate"/,
    'class="text-xs sm:text-lg md:text-2xl text-zinc-300 font-medium truncate"'
);

fs.writeFileSync('drop.js', code);
