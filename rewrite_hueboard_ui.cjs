const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

const regex = /const renderTable = \([\s\S]*?app\.innerHTML = `/;

const newTableCode = `
      const renderTable = (title, items) => {
          if (items.length === 0) return \`<div class="mb-16"><h2 class="text-3xl font-serif font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white border-b-4 border-black dark:border-white pb-2 inline-block">\${title}</h2><p class="text-zinc-500">Пока нет данных.</p></div>\`;
          
          const rows = items.map(item => {
              const rel = reviews.find(r => r.id === item.id);
              const artist = artists.find(a => a.id === rel.artistId);
              return \`
                <div class="flex items-center gap-2 sm:gap-4 py-4 border-b-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors px-1 sm:px-2">
                    <div class="w-8 sm:w-12 text-center text-3xl sm:text-4xl font-serif font-black tracking-tighter text-black dark:text-white">\${item.rank}</div>
                    <div class="w-10 sm:w-12 flex justify-center items-center">\${item.statusStr}</div>
                    <img src="\${rel.cover}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover shadow-sm rounded-sm">
                    <div class="flex-1 text-left min-w-0 ml-2">
                        <div class="font-serif font-black text-base sm:text-lg text-black dark:text-white uppercase truncate flex items-center gap-2">
                            <span class="truncate">\${rel.title}</span> \${item.certHtml}
                        </div>
                        <div class="text-zinc-500 font-bold text-xs sm:text-sm truncate">\${artist ? artist.name : ''}</div>
                    </div>
                    <div class="hidden md:flex gap-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">\${item.prevRank}</span>Last</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">\${item.peak}</span>Peak</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">\${item.woc}</span>WOC</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">\${item.points}</span>Pts</div>
                    </div>
                </div>
              \`;
          }).join('');

          return \`
            <div class="mb-20">
                <div class="flex justify-between items-end border-b-[6px] border-black dark:border-white pb-4 mb-2 mt-12">
                    <h2 class="text-4xl sm:text-6xl font-serif font-black uppercase tracking-tighter text-black dark:text-white m-0 leading-none">\${title}</h2>
                </div>
                <div class="flex flex-col">
                    \${rows}
                </div>
            </div>
          \`;
      };

      app.innerHTML = \``;

code = code.replace(regex, newTableCode);

// Also let's change the page header to be more serif/pitchfork-like
code = code.replace(
    /<h1 class="text-6xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">HueBoard<\/h1>\s*<p class="text-zinc-500 font-bold tracking-widest uppercase text-sm">Обновление каждую неделю<\/p>/,
    `<h1 class="text-5xl sm:text-7xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">HueBoard</h1>
               <p class="text-zinc-500 font-serif italic text-lg sm:text-xl border-b-2 border-zinc-200 dark:border-zinc-800 pb-8 inline-block px-8">Обновление каждую неделю</p>`
);

fs.writeFileSync('hueboard.js', code);
