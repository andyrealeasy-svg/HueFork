import { reviews, artists } from './data.js';
import { callApi } from './api.js';

function getChartWeek(dateString) {
    // Return a comparable week identifier (e.g., timestamp of the Thursday 21:00 UTC+3 that closes this week)
    const date = dateString ? new Date(dateString) : new Date();
    // UTC time
    let d = new Date(date);
    d.setUTCHours(d.getUTCHours() + 3); // Adjust to Aremaine time (UTC+3)
    
    // Find the NEXT Thursday 21:00
    // If it's already past Thursday 21:00, it belongs to the next Thursday
    let day = d.getUTCDay(); // 0=Sun, 4=Thu
    let hours = d.getUTCHours();
    
    let daysToThursday = 4 - day;
    if (daysToThursday < 0 || (daysToThursday === 0 && hours >= 21)) {
        daysToThursday += 7;
    }
    
    d.setUTCDate(d.getUTCDate() + daysToThursday);
    d.setUTCHours(21, 0, 0, 0);
    return d.toISOString();
}

export async function renderHueboard() {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-16 animate-slide-up pb-24 text-center">
       <h1 class="text-6xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-4">HueBoard</h1>
       <p class="text-zinc-500 mb-12">Загрузка чартов...</p>
    </div>
  `;

  try {
      const res = await callApi({ action: 'getChartData' });
      if (!res.success) return;
      
      let purchases = res.purchases || [];
      if (purchases.length === 0) {
          purchases = [
              { reviewId: 'sicka-fucking-fucking-freestyle', points: 500, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: 'sicka-100-flopie-single', points: 250, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'dollova-cum-mania-sex-bomb-deluxe', points: 300, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: 'ksivat-matcha-single', points: 150, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'sicka-okurr', points: 100, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'niksa-business-single', points: 60, type: 'digital', date: new Date().toISOString() },
          ];
      }
      
      const now = new Date();
      now.setUTCHours(now.getUTCHours() + 3);
      
      // We want to show the LATEST closed week.
      // A week is closed if its closing time is <= now.
      const weeks = {}; // weekId -> points map
      purchases.forEach(p => {
          const itemReview = reviews.find(r => r.id === p.reviewId);
          if (!itemReview) return;
          
          let w_purchase = getChartWeek(p.date);
          let w_effective = w_purchase;
          
          if (itemReview.releaseDate) {
              let w0 = getChartWeek(itemReview.releaseDate);
              let d = new Date(w0);
              d.setUTCDate(d.getUTCDate() + 7);
              let debutWeek = d.toISOString();
              
              if (new Date(w_purchase) <= new Date(debutWeek)) {
                  w_effective = debutWeek;
              }
          }
          
          let targetReviewId = itemReview.originalAlbumId || itemReview.id;
          
          if (!weeks[w_effective]) weeks[w_effective] = {};
          if (!weeks[w_effective][targetReviewId]) weeks[w_effective][targetReviewId] = 0;
          weeks[w_effective][targetReviewId] += p.points;
      });

      // To find the latest closed week, sort all weekIds ascending, filter <= now
      const sortedWeekIds = Object.keys(weeks).sort((a,b) => new Date(a) - new Date(b));
      
      let lastClosedWeekId = null;
      let previousClosedWeekId = null;
      
      // Find the currently active closed week (the one we show)
      for (let i = 0; i < sortedWeekIds.length; i++) {
          if (new Date(sortedWeekIds[i]) <= now) {
              previousClosedWeekId = lastClosedWeekId;
              lastClosedWeekId = sortedWeekIds[i];
          }
      }

      // Strictly show only the last closed week. If no week is closed, it's null.
      const weekToShowId = lastClosedWeekId;
      const prevWeekId = sortedWeekIds[sortedWeekIds.indexOf(weekToShowId) - 1] || null;

      const currentPoints = weekToShowId && weeks[weekToShowId] ? weeks[weekToShowId] : {};
      const prevPoints = prevWeekId && weeks[prevWeekId] ? weeks[prevWeekId] : {};

      // Also calculate total points for certifications, and peak, and weeks on chart
      // For each release:
      const stats = {};
      Object.keys(weeks).forEach(wId => {
          const sortedInWeek = Object.keys(weeks[wId]).sort((a,b) => {
              if (weeks[wId][b] === weeks[wId][a]) {
                  const ra = reviews.find(r => r.id === a);
                  const rb = reviews.find(r => r.id === b);
                  return new Date(rb?.releaseDate || 0) - new Date(ra?.releaseDate || 0);
              }
              return weeks[wId][b] - weeks[wId][a];
          });
          
          // Separate into singles, albums, global for ranking
          // Well, actually rank is per chart.
          // Let's pre-calculate all ranks for all weeks.
      });

      // Actually, let's simplify.
      // For each chart (Singles, Albums, Global), calculate rank for current week, and rank for previous week.
      const buildChart = (filterFn, limit) => {
          const currentItems = Object.keys(currentPoints)
             .filter(filterFn)
             .map(id => ({ id, points: currentPoints[id] }))
             .sort((a,b) => {
                 if (b.points === a.points) {
                     const ra = reviews.find(r => r.id === a.id);
                     const rb = reviews.find(r => r.id === b.id);
                     return new Date(rb?.releaseDate || 0) - new Date(ra?.releaseDate || 0);
                 }
                 return b.points - a.points;
             }).slice(0, limit);

          const prevItems = Object.keys(prevPoints)
             .filter(filterFn)
             .map(id => ({ id, points: prevPoints[id] }))
             .sort((a,b) => {
                 if (b.points === a.points) {
                     const ra = reviews.find(r => r.id === a.id);
                     const rb = reviews.find(r => r.id === b.id);
                     return new Date(rb?.releaseDate || 0) - new Date(ra?.releaseDate || 0);
                 }
                 return b.points - a.points;
             }).slice(0, limit);
             
          return currentItems.map((item, index) => {
              const rank = index + 1;
              const prevRankIdx = prevItems.findIndex(pi => pi.id === item.id);
              const prevRank = prevRankIdx >= 0 ? prevRankIdx + 1 : '-';
              
              let statusStr = '<span class="text-zinc-500 font-bold">=</span>';
              if (prevRank === '-') statusStr = '<span class="text-yellow-600 dark:text-yellow-500 font-black uppercase text-[8px] sm:text-xs">New</span>';
              else if (rank < prevRank) statusStr = `<span class="text-green-500 font-bold text-xs flex flex-col leading-none items-center">▲<span class="text-[10px]">${prevRank - rank}</span></span>`;
              else if (rank > prevRank) statusStr = `<span class="text-red-500 font-bold text-xs flex flex-col leading-none items-center">▼<span class="text-[10px]">${rank - prevRank}</span></span>`;
              
              // Weeks on chart and Peak we calculate across all weeks
              let woc = 0;
              let peak = 999;
              Object.keys(weeks).forEach(wId => {
                  const weekItems = Object.keys(weeks[wId])
                     .filter(filterFn)
                     .sort((a,b) => weeks[wId][b] - weeks[wId][a]); // omitting tie breaker for speed here, it's just stats
                  const idx = weekItems.indexOf(item.id);
                  if (idx >= 0 && idx < limit) {
                      woc++;
                      if (idx + 1 < peak) peak = idx + 1;
                  }
              });

              // Total points for cert
              let totalPts = 0;
              Object.keys(weeks).forEach(wId => {
                  if (weeks[wId][item.id]) totalPts += weeks[wId][item.id];
              });
              
              let certHtml = '';
              if (totalPts >= 500) certHtml = `<span class="inline-flex ml-2 align-middle" title="Diamond (500 pts)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#22d3ee" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg></span>`;
              else if (totalPts >= 250) certHtml = `<span class="inline-flex ml-2 align-middle" title="Platinum (250 pts)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#d4d4d8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg></span>`;
              else if (totalPts >= 100) certHtml = `<span class="inline-flex ml-2 align-middle" title="Gold (100 pts)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg></span>`;
              else if (totalPts >= 50) certHtml = `<span class="inline-flex ml-2 align-middle" title="Silver (50 pts)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg></span>`;

              return { ...item, rank, prevRank, statusStr, woc, peak, totalPts, certHtml };
          });
      };

      const isSingleLocal = (id) => {
          const r = reviews.find(x => x.id === id);
          if (!r) return false;
          const a = artists.find(x => x.id === r.artistId);
          return r.isSingle && (!a || !a.isGlobal);
      };
      
      const isAlbumLocal = (id) => {
          const r = reviews.find(x => x.id === id);
          if (!r) return false;
          const a = artists.find(x => x.id === r.artistId);
          return !r.isSingle && (!a || !a.isGlobal);
      };

      const isGlobal = (id) => {
          const r = reviews.find(x => x.id === id);
          if (!r) return false;
          const a = artists.find(x => x.id === r.artistId);
          return a && a.isGlobal;
      };

      const hot10 = buildChart(isSingleLocal, 10);
      const big5 = buildChart(isAlbumLocal, 5);
      const global3 = buildChart(isGlobal, 3);

      
      
      const renderTable = (title, items) => {
          if (items.length === 0) return `<div class="mb-16"><h2 class="text-3xl font-serif font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white border-b-4 border-black dark:border-white pb-2 inline-block">${title}</h2><p class="text-zinc-500">Пока нет данных.</p></div>`;
          
          const rows = items.map(item => {
              const rel = reviews.find(r => r.id === item.id);
              const artist = artists.find(a => a.id === rel.artistId);
              return `
                <div class="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div class="w-6 sm:w-10 text-center text-2xl sm:text-4xl font-serif font-black tracking-tighter text-black dark:text-white">${item.rank}</div>
                    <div class="w-8 sm:w-12 flex justify-center items-center">${item.statusStr}</div>
                    <img src="${rel.cover}" class="w-12 h-12 sm:w-16 sm:h-16 object-cover shadow-sm rounded-md">
                    <div class="flex-1 text-left min-w-0 ml-1 sm:ml-2">
                        <div class="font-serif font-black text-base sm:text-lg text-black dark:text-white truncate flex items-center gap-1 sm:gap-2">
                            <span class="truncate">${rel.title}</span> ${item.certHtml}
                        </div>
                        <div class="text-zinc-500 font-bold text-xs sm:text-sm truncate">${artist ? artist.name : ''}</div>
                    </div>
                    <div class="flex sm:hidden flex-col items-end justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0 ml-2">
                        <div class="flex gap-2 mb-1">
                            <div class="text-right"><span class="text-black dark:text-white">${item.peak}</span> PK</div>
                            <div class="text-right"><span class="text-black dark:text-white">${item.prevRank}</span> LW</div>
                        </div>
                        <div class="flex gap-2">
                            <div class="text-right"><span class="text-black dark:text-white">${item.points}</span> PTS</div>
                            <div class="text-right"><span class="text-black dark:text-white">${item.woc}</span> WOC</div>
                        </div>
                    </div>
                    <div class="hidden sm:flex gap-6 md:gap-8 text-center text-xs font-bold text-zinc-400 uppercase tracking-widest ml-auto shrink-0 pl-4">
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">${item.prevRank}</span>Last</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">${item.peak}</span>Peak</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">${item.woc}</span>WOC</div>
                        <div><span class="block text-black dark:text-white text-lg font-serif font-black">${item.points}</span>Pts</div>
                    </div>
                </div>
              `;
          }).join('');

          return `
            <div class="mb-20">
                <div class="flex justify-between items-end border-b-[6px] border-black dark:border-white pb-4 mb-2 mt-12">
                    <h2 class="text-4xl sm:text-6xl font-serif font-black uppercase tracking-tighter text-black dark:text-white m-0 leading-none">${title}</h2>
                </div>
                <div class="flex flex-col">
                    ${rows}
                </div>
            </div>
          `;
      };

      app.innerHTML = `
        <div class="max-w-5xl mx-auto px-4 py-12 animate-slide-up pb-24">
           <div class="mb-12 text-center">
               <h1 class="text-5xl sm:text-7xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">HueBoard</h1>
               <p class="text-zinc-500 font-serif italic text-lg sm:text-xl border-b-2 border-zinc-200 dark:border-zinc-800 pb-8 inline-block px-8">Обновление каждый четверг в 21:00 UTC+3</p>
           </div>
           
           ${renderTable("HueBoard Hot 10", hot10)}
           ${renderTable("HueBoard Big 5", big5)}
           ${renderTable("HueBoard Global 3", global3)}
        </div>
      `;

  } catch(e) {
      console.error(e);
      app.innerHTML = `<p class="text-center text-red-500 mt-20">Ошибка загрузки чартов.</p>`;
  }
}
