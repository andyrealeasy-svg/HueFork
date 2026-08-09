const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `export async function renderPersonalProfile(isLoading = true) {`;
const insertion = `
function formatStatsHtml(stats) {
    const formatName = { 'digital': 'Цифровой', 'cd': 'CD', 'vinyl': 'Винил' };
    let artistName = "Нет данных";
    if (stats.reviewCounts && Object.keys(stats.reviewCounts).length > 0) {
        let maxCount = 0;
        let bestArtistId = null;
        let artistCounts = {};
        for (const [revId, count] of Object.entries(stats.reviewCounts)) {
            const rev = reviews.find(r => r.id === revId);
            if (rev) {
                artistCounts[rev.artistId] = (artistCounts[rev.artistId] || 0) + count;
            }
        }
        for (const [artId, count] of Object.entries(artistCounts)) {
            if (count > maxCount) {
                maxCount = count;
                bestArtistId = artId;
            }
        }
        if (bestArtistId) {
            const art = getArtist(bestArtistId);
            artistName = art ? art.name : bestArtistId;
        }
    }
    
    return \`
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Любимый артист</span>
         <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-full" title="\${artistName}">\${artistName}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Коллекция</span>
         <span class="font-bold text-xl text-zinc-900 dark:text-zinc-100">\${stats.collectionSize || 0}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Формат</span>
         <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">\${stats.favFormat ? formatName[stats.favFormat] : 'Нет'}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Траты</span>
         <span class="font-bold text-xl text-red-600 dark:text-red-500">\${stats.expenses || 0} <span class="text-sm font-normal text-zinc-500">HC</span></span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Серия</span>
         <span class="font-bold text-xl text-zinc-900 dark:text-zinc-100">\${stats.streak || 0} <span class="text-sm font-normal text-zinc-500">дн.</span></span>
      </div>
    \`;
}

export async function renderPersonalProfile(isLoading = true) {`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
