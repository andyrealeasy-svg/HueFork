import { callApi } from "./api.js";
import { reviews, getArtist, getScore } from "./data.js";

export async function renderMyGlobalReview() {
  const app = document.getElementById("app");
  window.scrollTo(0, 0);

  const reviewIds = [
    "le-sserafim-illit-katseye-iconic-by-mistake",
    "miroslava-daydream-devochka-ferrari",
    "ice-spice-y2k",
    "nicki-minaj-pink-friday"
  ];

  let targetReviews = reviewIds.map(id => reviews.find(r => r.id === id)).filter(Boolean);

  let html = `<div id="mgr-wrapper" class="max-w-5xl mx-auto px-4 py-8 animate-slide-up pb-32">`;
  html += `
    <div class="mb-12 border-b-2 border-black dark:border-white pb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a href="#/" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="font-serif font-black text-3xl sm:text-4xl uppercase tracking-tighter text-zinc-900 dark:text-white">MY GLOBAL REVIEW</h1>
      </div>
    </div>
  `;

  app.innerHTML = html + `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div></div>`;

  const res = await callApi({ action: 'getMGRVotes', username: 'guest' });
  const serverTotalVotes = (res.success && res.totalVotes) ? res.totalVotes : {};
  
  targetReviews = targetReviews.sort((a, b) => (serverTotalVotes[b.id] || 0) - (serverTotalVotes[a.id] || 0));

  html = `<div id="mgr-wrapper" class="max-w-6xl mx-auto px-4 py-8 animate-slide-up pb-32">`;
  html += `
    <div class="mb-12 border-b-2 border-black dark:border-white pb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <a href="#/" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="font-serif font-black text-3xl sm:text-4xl uppercase tracking-tighter text-zinc-900 dark:text-white">РЕЗУЛЬТАТЫ MGR</h1>
      </div>
    </div>
  `;

  html += `
    <div class="mb-16 text-center">
      <h2 class="text-5xl sm:text-7xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white mb-6">
        ЗАЛ СЛАВЫ
      </h2>
      <p class="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 font-serif max-w-3xl mx-auto leading-relaxed">
        Голосование завершено. Спасибо всем за участие! Вот лучшие рецензии пользователей по версии сообщества HueFork.
      </p>
    </div>
  `;

  // Podium
  if (targetReviews.length >= 3) {
    const first = targetReviews[0];
    const second = targetReviews[1];
    const third = targetReviews[2];
    const fourth = targetReviews[3]; // might be undefined

    const renderPodiumItem = (review, rank, heightClass, bgClass, textClass) => {
      const artist = getArtist(review.artistId);
      let artistName = artist ? artist.name : "";
      if (review.artistIds) {
         artistName = review.artistIds.map(id => getArtist(id) ? getArtist(id).name : "").filter(Boolean).join(", ");
      }
      const votes = serverTotalVotes[review.id] || 0;

      return `
        <div class="flex flex-col items-center justify-end w-full sm:w-1/3 px-2 group">
          <a href="#/reviews/${review.id}" class="flex flex-col items-center mb-6 hover:scale-105 transition-transform duration-500">
             <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl mb-4 relative ring-4 ring-transparent group-hover:ring-zinc-200 dark:group-hover:ring-zinc-800 transition-all">
                <img src="${review.cover}" class="w-full h-full object-cover" />
             </div>
             <div class="text-center px-2">
               <div class="font-serif font-black text-lg sm:text-xl text-zinc-900 dark:text-white leading-tight mb-1 line-clamp-2">${review.title}</div>
               <div class="font-bold text-xs text-zinc-500 uppercase tracking-widest truncate max-w-full">${artistName}</div>
               <div class="mt-2 text-sm font-black text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-950/50 inline-block px-3 py-1 rounded-full border border-red-200 dark:border-red-900/50">${votes} ГОЛОСОВ</div>
             </div>
          </a>
          <div class="w-full ${heightClass} ${bgClass} rounded-t-3xl shadow-inner border border-black/5 dark:border-white/5 relative overflow-hidden flex flex-col items-center justify-start pt-6 sm:pt-8 transition-all group-hover:brightness-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div class="text-5xl sm:text-7xl font-black font-serif italic ${textClass} drop-shadow-md z-10">${rank}</div>
          </div>
        </div>
      `;
    };

    html += `
      <div class="flex flex-col sm:flex-row items-center sm:items-end justify-center max-w-5xl mx-auto gap-12 sm:gap-2 mb-20 mt-24 px-4">
        ${renderPodiumItem(second, 2, "h-48 sm:h-80", "bg-zinc-200 dark:bg-zinc-800", "text-zinc-400 dark:text-zinc-500")}
        ${renderPodiumItem(first, 1, "h-56 sm:h-[420px]", "bg-gradient-to-b from-yellow-300 to-yellow-600 dark:from-yellow-500 dark:to-yellow-800", "text-yellow-100 dark:text-yellow-200")}
        ${renderPodiumItem(third, 3, "h-40 sm:h-64", "bg-orange-200 dark:bg-orange-900/40", "text-orange-400 dark:text-orange-700")}
      </div>
    `;

    if (fourth) {
       const artist = getArtist(fourth.artistId);
       let artistName = artist ? artist.name : "";
       if (fourth.artistIds) {
          artistName = fourth.artistIds.map(id => getArtist(id) ? getArtist(id).name : "").filter(Boolean).join(", ");
       }
       const votes = serverTotalVotes[fourth.id] || 0;
       html += `
         <div class="max-w-2xl mx-auto border-t-2 border-zinc-200 dark:border-zinc-800 pt-12">
            <h3 class="text-center font-bold text-sm text-zinc-400 uppercase tracking-widest mb-6">4 МЕСТО</h3>
            <a href="#/reviews/${fourth.id}" class="flex items-center gap-6 p-4 rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
               <img src="${fourth.cover}" class="w-24 h-24 rounded-2xl object-cover shadow-md" />
               <div class="flex-grow">
                 <div class="font-serif font-black text-xl text-zinc-900 dark:text-white leading-tight mb-1">${fourth.title}</div>
                 <div class="font-bold text-xs text-zinc-500 uppercase tracking-widest">${artistName}</div>
               </div>
               <div class="text-right">
                 <div class="font-black text-2xl font-serif text-zinc-900 dark:text-white">${votes}</div>
                 <div class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Голосов</div>
               </div>
            </a>
         </div>
       `;
    }

  }

  html += `
    </div>
  </div>`;
  
  app.innerHTML = html;
}
