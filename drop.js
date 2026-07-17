import { reviews, artists, formatDate } from './data.js';
import { callApi, getCurrentUser } from './api.js';

export async function renderDrop() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="flex items-center justify-center min-h-[50vh] animate-fade-in">
        <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-black dark:border-t-white animate-spin"></div>
            <div class="text-zinc-500 font-medium tracking-widest uppercase text-sm animate-pulse">Загрузка Drop...</div>
        </div>
    </div>
  `;

  // Sort reviews by date
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  
  // Find the latest released and most upcoming
  const now = new Date();
  // Using simple current date approach
  const released = sortedReviews.filter(r => new Date(r.releaseDate) <= now);
  const upcoming = sortedReviews.filter(r => new Date(r.releaseDate) > now);
  
  const latestReleased = released.length > 0 ? released[0] : null;
  const mostUpcoming = upcoming.length > 0 ? upcoming[upcoming.length - 1] : null; // closest to now? 
  // Wait, most upcoming is the one that is closest to current date? Or furthest? Usually closest.
  // Actually, 'samij skorij' means the one coming soonest. So sort ascending and pick first.
  const soonestUpcoming = upcoming.length > 0 ? upcoming.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))[0] : null;

  // Let's determine banner release: if soonestUpcoming is within 3 days, show it. Otherwise show latestReleased.
  let bannerRelease = latestReleased;
  if (soonestUpcoming) {
      const daysDiff = (new Date(soonestUpcoming.releaseDate) - now) / (1000 * 3600 * 24);
      if (daysDiff <= 3) {
          bannerRelease = soonestUpcoming;
      }
  }

  // Get user economy
  let hueCoins = 0;
  let canClaimRegister = false;
  let canClaimDaily = false;
  const user = getCurrentUser();
  if (user) {
      try {
          const res = await callApi({ action: 'getUserEconomy', username: user.username, token: user.token });
          if (res.success) {
              hueCoins = res.hueCoins || 0;
              canClaimRegister = res.canClaimRegister;
              canClaimDaily = res.canClaimDaily;
          }
      } catch (e) {}
  }

  const renderBanner = (rel) => {
      if (!rel) return '';
      const artist = artists.find(a => a.id === rel.artistId);
      return `
        <div class="relative w-full aspect-video  rounded-2xl overflow-hidden mb-16 bg-zinc-900 group cursor-pointer flex" onclick="window.location.hash='#/reviews/${rel.id}'">
            <div class="h-full aspect-square flex-shrink-0 relative z-20">
               <img src="${rel.cover}" class="w-full h-full object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-700">
            </div>
            <div class="relative flex-1 p-3 sm:p-6 md:p-12 flex flex-col justify-center overflow-hidden z-20 min-w-0">
               <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
               <img src="${rel.cover}" class="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 z-0">
               <div class="relative z-10 text-white flex-1 flex flex-col justify-center max-w-full">
                  <div class="inline-block w-fit px-2 py-0.5 sm:px-3 sm:py-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full mb-1 sm:mb-2 md:mb-4">
                     ${rel === soonestUpcoming ? 'Скоро' : 'Новый релиз'}
                  </div>
                  <h2 class="text-lg sm:text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter mb-1 md:mb-2 leading-none truncate">${rel.title}</h2>
                  <p class="text-xs sm:text-lg md:text-2xl text-zinc-300 font-medium truncate">${artist ? artist.name : ''}</p>
               </div>
            </div>
        </div>
      `;
  };

  const getDiscount = (rel) => {
      let discount = 0;
      if (latestReleased && rel.releaseDate === latestReleased.releaseDate) discount = 10;
      if (soonestUpcoming && rel.releaseDate === soonestUpcoming.releaseDate) discount = 15;
      return discount;
  };

  const calculatePrice = (basePrice, rel) => {
      const discount = getDiscount(rel);
      return Math.floor(basePrice * (1 - discount / 100));
  };

  const renderItems = (items) => {
      if (items.length === 0) return '';
      return items.map(rel => {
          const discount = getDiscount(rel);
          const priceDig = calculatePrice(5, rel);
          const priceCD = calculatePrice(20, rel);
          const priceVinyl = calculatePrice(50, rel);
          return `
            <div class="flex-shrink-0 w-48 group">
                <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                    <img src="${rel.cover}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    ${discount > 0 ? `<div class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">-${discount}%</div>` : ''}
                </div>
                <h4 class="font-bold text-sm text-zinc-900 dark:text-white truncate" title="${rel.title}">${rel.title}</h4>
                <p class="text-xs text-zinc-500 mb-2 truncate">${formatDate(rel.releaseDate)}</p>
                <div class="flex flex-col gap-1">
                    <button onclick="window.buyItem('${rel.id}', 'digital', ${priceDig}, 1)" class="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-1.5 rounded-lg text-xs font-semibold flex justify-between px-3 transition-colors">
                        <span>Digital</span> <span>${priceDig} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></span>
                    </button>
                    <button onclick="window.buyItem('${rel.id}', 'cd', ${priceCD}, 6)" class="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-1.5 rounded-lg text-xs font-semibold flex justify-between px-3 transition-colors">
                        <span>CD</span> <span>${priceCD} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></span>
                    </button>
                    <button onclick="window.buyItem('${rel.id}', 'vinyl', ${priceVinyl}, 19)" class="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-1.5 rounded-lg text-xs font-semibold flex justify-between px-3 transition-colors">
                        <span>Vinyl</span> <span>${priceVinyl} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></span>
                    </button>
                </div>
            </div>
          `;
      }).join('');
  };

  const renderSection = (title, items) => {
      // Group by artist
      let artistGroups = {};
      items.forEach(r => {
          if (!artistGroups[r.artistId]) artistGroups[r.artistId] = [];
          artistGroups[r.artistId].push(r);
      });
      
      const artistArr = Object.keys(artistGroups).map(id => {
          const a = artists.find(x => x.id === id);
          const rels = artistGroups[id].sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
          return { artist: a, latestRelease: new Date(rels[0].releaseDate), releases: rels };
      });

      // Split local vs global
      const local = artistArr.filter(x => x.artist && !x.artist.isGlobal).sort((a,b) => b.latestRelease - a.latestRelease);
      const global = artistArr.filter(x => x.artist && x.artist.isGlobal).sort((a,b) => b.latestRelease - a.latestRelease);

      let html = `<h3 class="text-3xl font-serif font-black tracking-tighter mb-8 uppercase">${title}</h3>`;
      
      const drawGroup = (arr) => {
          return arr.map(grp => `
            <div class="mb-8">
                <h4 class="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-200">${grp.artist.name}</h4>
                <div class="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                    ${renderItems(grp.releases)}
                </div>
            </div>
          `).join('');
      };

      if (local.length > 0) html += drawGroup(local);
      if (global.length > 0) {
          html += `<h4 class="text-2xl font-bold mb-6 mt-12 text-zinc-400">Глобальные артисты</h4>`;
          html += drawGroup(global);
      }
      return html;
  };

    

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
      if (tabAlbums) tabAlbums.className = `flex-1 sm:w-32 py-2 rounded-full text-sm transition-all ${tabClass('albums')}`;
      if (tabSingles) tabSingles.className = `flex-1 sm:w-32 py-2 rounded-full text-sm transition-all ${tabClass('singles')}`;
  };

  const initDropPage = () => {
      app.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up pb-24">
           <div class="flex items-center justify-between mb-8">
               <h1 class="text-4xl font-serif font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Дроп</h1>
               <div class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                   <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></span>
                   <span id="hc-balance">${hueCoins} HueCoins</span>
               </div>
           </div>
           
           
           ${(canClaimRegister || canClaimDaily) ? `
           <div class="mb-8 flex flex-col sm:flex-row gap-4 animate-fade-in">
               ${canClaimRegister ? `<button id="claim-register-btn" class="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95">+50 HueCoins за регистрацию</button>` : ''}
               ${canClaimDaily ? `<button id="claim-daily-btn" class="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95">+25 HueCoins (сегодняшний день)</button>` : ''}
           </div>
           ` : ''}

           ${renderBanner(bannerRelease)}

           
           <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
               <div class="flex bg-zinc-100 dark:bg-zinc-900 rounded-full p-1 border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
                   <button id="tab-albums" class="flex-1 sm:w-32 py-2 rounded-full text-sm transition-all">Альбомы</button>
                   <button id="tab-singles" class="flex-1 sm:w-32 py-2 rounded-full text-sm transition-all">Синглы</button>
               </div>
               
               <div class="relative w-full sm:w-64">
                   <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                   <input type="text" id="drop-search" placeholder="Поиск релизов..." value="${searchQuery}" class="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors">
               </div>
           </div>
           
           <div id="drop-lists-container" class="mb-16">
           </div>
        </div>
      `;
      
      renderLists();
      
      document.getElementById('tab-albums').addEventListener('click', () => { currentTab = 'albums'; renderLists(); });
      document.getElementById('tab-singles').addEventListener('click', () => { currentTab = 'singles'; renderLists(); });
      const searchInput = document.getElementById('drop-search');
      searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; renderLists(); });
  };
  initDropPage();

  // Provide global function for buying
  window.buyItem = (reviewId, type, price, points) => {
      const user = getCurrentUser();
      if (!user) {
          window.appAlert("Для покупок необходимо войти в аккаунт.");
          return;
      }
      window.appConfirm(`Купить ${type.toUpperCase()} за ${price} HueCoins?`, async () => {
          try {
              const res = await callApi({ action: 'buyItem', username: user.username, token: user.token, reviewId, type, price, points });
              if (res.success) {
                  document.getElementById("hc-balance").innerText = res.hueCoins + " HueCoins";
                  
                  // Show receipt
                  const rel = reviews.find(r => r.id === reviewId);
                  const modal = document.createElement("div");
                  modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
                  modal.innerHTML = `
                    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 class="font-serif font-black text-2xl mb-2">Чек покупки</h3>
                        <p class="text-zinc-500 font-medium mb-6">Товар добавлен в вашу коллекцию</p>
                        
                        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 text-left mb-6">
                            <div class="flex gap-4 items-center">
                                <img src="${rel.cover}" class="w-16 h-16 rounded-md object-cover">
                                <div>
                                    <h4 class="font-bold text-zinc-900 dark:text-white leading-tight">${rel.title}</h4>
                                    <p class="text-xs text-zinc-500 uppercase mt-1">${type}</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <span class="text-zinc-500 font-bold">Итого</span>
                                <span class="font-black text-lg text-zinc-900 dark:text-white">${price} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg></span>
                            </div>
                        </div>
                        <button id="modal-ok" class="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">Супер</button>
                    </div>
                  `;
                  document.body.appendChild(modal);
                  modal.querySelector("#modal-ok").addEventListener("click", () => modal.remove());
                  
              } else {
                  window.appAlert(res.error || "Ошибка при покупке.");
              }
          } catch(e) {
              window.appAlert("Произошла ошибка сети.");
          }
      });
  };

  if (canClaimRegister || canClaimDaily) {
      const handleClaim = async (btn) => {
          btn.disabled = true;
          const orig = btn.innerHTML;
          btn.innerHTML = `<span class="animate-pulse">Загрузка...</span>`;
          const res = await callApi({ action: 'claimBonus', username: user.username, token: user.token });
          if (res.success) {
              window.appAlert(`Успешно! Начислено ${res.added} HueCoins.`);
              renderDrop();
          } else {
              window.appAlert(res.error || "Ошибка при получении бонуса");
              btn.disabled = false;
              btn.innerHTML = orig;
          }
      };
      
      const btnReg = document.getElementById('claim-register-btn');
      if (btnReg) btnReg.addEventListener('click', () => handleClaim(btnReg));
      
      const btnDaily = document.getElementById('claim-daily-btn');
      if (btnDaily) btnDaily.addEventListener('click', () => handleClaim(btnDaily));
  }

}
