const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

code = code.replace(
/  const renderContent = \(\) => \{[\s\S]*?renderContent\(\);\n\}/,
`
  let currentTab = 'albums';
  let searchQuery = '';

  const getFiltered = () => {
      const filteredReviews = sortedReviews.filter(r => {
         const searchStr = (r.title + " " + (artists.find(a => a.id === r.artistId)?.name || "")).toLowerCase();
         return searchStr.includes(searchQuery.toLowerCase());
      });
      return {
          albums: filteredReviews.filter(r => !r.isSingle),
          singles: filteredReviews.filter(r => r.isSingle)
      };
  };

  const renderLists = () => {
      const { albums, singles } = getFiltered();
      const container = document.getElementById('drop-lists-container');
      if (container) {
          container.innerHTML = currentTab === 'albums' 
              ? renderSection("Альбомы", albums) 
              : renderSection("Синглы", singles);
      }
      
      const tabClass = (tab) => currentTab === tab 
        ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-bold shadow-sm" 
        : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800";
        
      const tabAlbums = document.getElementById('tab-albums');
      const tabSingles = document.getElementById('tab-singles');
      if (tabAlbums) tabAlbums.className = \`flex-1 sm:w-32 py-2 rounded-full text-sm transition-all \${tabClass('albums')}\`;
      if (tabSingles) tabSingles.className = \`flex-1 sm:w-32 py-2 rounded-full text-sm transition-all \${tabClass('singles')}\`;
  };

  app.innerHTML = \`
    <div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up pb-24">
       <div class="flex items-center justify-between mb-8">
           <h1 class="text-4xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Дроп</h1>
           <div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
               <span>\${coinSvg}</span>
               <span id="hc-balance">\${hueCoins} HueCoins</span>
           </div>
       </div>
       
       \${renderBanner(bannerRelease)}
       
       <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
           <div class="flex bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
               <button id="tab-albums" class="flex-1 sm:w-32 py-2 rounded-full text-sm transition-all">Альбомы</button>
               <button id="tab-singles" class="flex-1 sm:w-32 py-2 rounded-full text-sm transition-all">Синглы</button>
           </div>
           
           <div class="relative w-full sm:w-64">
               <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               <input type="text" id="drop-search" placeholder="Поиск релизов..." value="\${searchQuery}" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors">
           </div>
       </div>
       
       <div id="drop-lists-container" class="mb-16">
       </div>
    </div>
  \`;
  
  renderLists();
  
  document.getElementById('tab-albums').addEventListener('click', () => { currentTab = 'albums'; renderLists(); });
  document.getElementById('tab-singles').addEventListener('click', () => { currentTab = 'singles'; renderLists(); });
  const searchInput = document.getElementById('drop-search');
  searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; renderLists(); });
}
`
);

fs.writeFileSync('drop.js', code);
