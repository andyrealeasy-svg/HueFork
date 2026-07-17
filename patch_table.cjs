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
                <div class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div class="w-6 sm:w-10 text-center text-2xl sm:text-4xl font-serif font-black tracking-tighter text-black dark:text-white">\${item.rank}</div>
                    <div class="w-8 sm:w-12 flex justify-center items-center">\${item.statusStr}</div>
                    <img src="\${rel.cover}" class="w-12 h-12 sm:w-16 sm:h-16 object-cover shadow-sm rounded-md">
                    <div class="flex-1 text-left min-w-0 ml-1 sm:ml-2">
                        <div class="font-serif font-black text-base sm:text-lg text-black dark:text-white truncate flex items-center gap-1 sm:gap-2">
                            <span class="truncate">\${rel.title}</span> \${item.certHtml}
                        </div>
                        <div class="text-zinc-500 font-bold text-xs sm:text-sm truncate">\${artist ? artist.name : ''}</div>
                    </div>
                    <div class="flex sm:hidden flex-col items-end justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0 ml-2">
                        <div class="flex gap-2 mb-1">
                            <div class="text-right"><span class="text-black dark:text-white">\${item.peak}</span> PK</div>
                            <div class="text-right"><span class="text-black dark:text-white">\${item.prevRank}</span> LW</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="text-right"><span class="text-black dark:text-white">\${item.points}</span> PTS</div>
                            <div class="text-right"><span class="text-black dark:text-white">\${item.woc}</span> WOC</div>
                        </div>
                    </div>
                    <div class="hidden sm:flex gap-6 md:gap-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest ml-auto shrink-0 pl-4">
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

fs.writeFileSync('hueboard.js', code);
