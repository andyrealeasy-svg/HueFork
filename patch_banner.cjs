const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

code = code.replace(
    /const renderBanner = \(rel\) => \{[\s\S]*?blur-3xl opacity-50">\s*<\/div>\s*`;\s*};/,
    `const renderBanner = (rel) => {
      if (!rel) return '';
      const artist = artists.find(a => a.id === rel.artistId);
      return \`
        <div class="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden mb-16 bg-zinc-900 group cursor-pointer flex" onclick="window.location.hash='#/reviews/\${rel.id}'">
            <div class="h-full aspect-square flex-shrink-0 relative z-20">
               <img src="\${rel.cover}" class="w-full h-full object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-700">
            </div>
            <div class="relative flex-1 p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20">
               <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
               <img src="\${rel.cover}" class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 z-0">
               <div class="relative z-10 text-white flex-1 flex flex-col justify-center max-w-full">
                  <div class="inline-block w-fit px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-2 md:mb-4">
                     \${rel === soonestUpcoming ? 'Скоро' : 'Новый релиз'}
                  </div>
                  <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 uppercase leading-none truncate">\${rel.title}</h2>
                  <p class="text-lg md:text-2xl text-zinc-300 font-medium truncate">\${artist ? artist.name : ''}</p>
               </div>
            </div>
        </div>
      \`;
  };`
);

fs.writeFileSync('drop.js', code);
