import {
  reviews,
  artists,
  getScore,
  getArtist,
  getArtistValue,
  getReview,
  getGlobalRank,
  getTier,
  getArtistRank,
  formatDate,
  formatYear,
} from "./data.js";
import { renderRequestReview } from "./request.js";
import { renderMadness } from "./madness.js";

// Global Compare logic
window.compareQueue = [];
window.toggleCompare = function(e, id) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (window.compareQueue.includes(id)) {
    window.compareQueue = window.compareQueue.filter(i => i !== id);
  } else {
    window.compareQueue.push(id);
  }
  window.updateCompareUI();
};

window.clearCompare = function() {
  window.compareQueue = [];
  window.updateCompareUI();
};

window.renderCompareModal = function() {
  const container = document.getElementById("compare-container");
  if (!container) return;
  if (window.compareQueue.length < 2) return;
  
  const selectedReviews = window.compareQueue.map(id => reviews.find(r => r.id === id)).filter(Boolean);
  if (selectedReviews.length < 2) return;

  const getScoreMap = (review) => {
      const items = (review.criteria || review.singleCriteria || []);
      const map = {};
      items.forEach((c) => {
          map[c.title.toLowerCase()] = { val: c.score, origTitle: c.title };
      });
      return map;
  };
  
  const criteriaKeys = new Set();
  const mappedCriteriaList = selectedReviews.map(r => getScoreMap(r));
  mappedCriteriaList.forEach(m => Object.keys(m).forEach(k => criteriaKeys.add(k)));
  const allCriteriaKeys = Array.from(criteriaKeys);
  
  const criteriaScores = new Array(selectedReviews.length).fill(0);
  const trackScores = new Array(selectedReviews.length).fill(0);

  // Criteria processing
  const criteriaRows = allCriteriaKeys.map(key => {
      const origTitle = mappedCriteriaList.find(m => m[key])?.[key].origTitle || key;
      const vals = mappedCriteriaList.map(m => m[key] ? m[key].val : undefined);
      const nums = vals.map(v => typeof v === 'number' ? v : -1);
      
      const allHaveScore = vals.every(v => typeof v === 'number');
      let maxVal = -1;
      
      if (allHaveScore) {
          maxVal = Math.max(...nums);
          if (maxVal > -1) {
              nums.forEach((v, idx) => {
                 if (v === maxVal) {
                     criteriaScores[idx]++;
                 }
              });
          }
      }
      return { title: origTitle, vals, maxVal };
  });

  // Tracks processing
  const maxTracksLength = Math.max(...selectedReviews.map(r => (r.tracks || []).length));
  
  const trackRows = [];
  for (let i = 0; i < maxTracksLength; i++) {
      const vals = selectedReviews.map(r => {
          const t = (r.tracks || [])[i];
          return t ? { title: t.title, val: t.score } : { title: '-', val: undefined };
      });
      
      const nums = vals.map(v => typeof v.val === 'number' ? v.val : -1);
      const allHaveScore = vals.every(v => typeof v.val === 'number');
      let maxVal = -1;
      
      if (allHaveScore) {
          maxVal = Math.max(...nums);
          if (maxVal > -1) {
              nums.forEach((v, idx) => {
                 if (v === maxVal) {
                     trackScores[idx]++;
                 }
              });
          }
      }
      trackRows.push({ vals, maxVal });
  }

  const scores = criteriaScores.map((c, i) => c + trackScores[i]);
  const maxScore = Math.max(...scores);
  const winners = selectedReviews.filter((_, idx) => scores[idx] === maxScore && maxScore > 0);
  
  let winnerText = "Никто не победил (Нет баллов)";
  if (winners.length === 1) {
      winnerText = `Победитель: ${winners[0].title}`;
  } else if (winners.length > 1 && maxScore > 0) {
      winnerText = `Ничья: ${winners.map(w => w.title).join(", ")}`;
  }

  const renderCriteriaRow = (row) => {
      return `
        <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <td class="py-3 px-2 font-semibold text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-xs text-left">${row.title}</td>
          ${row.vals.map(v => {
              const strVal = v !== undefined ? v : '-';
              const isWinner = v === row.maxVal && v > -1;
              const colorClass = isWinner ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
              return `<td class="py-3 px-1 text-center ${colorClass}">${strVal}</td>`;
          }).join('')}
        </tr>
      `;
  };

  const renderTrackRow = (row) => {
      // Special rendering based on index
      // If 2 reviews, follow the exact request: left review -> track | score, right review -> score | track.
      // If more than 2, we just render it simply.
      
      if (selectedReviews.length === 2) {
          const v0 = row.vals[0], v1 = row.vals[1];
          const color0 = v0.val === row.maxVal && v0.val > -1 ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
          const color1 = v1.val === row.maxVal && v1.val > -1 ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
          
          return `
            <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
               <td class="py-2 px-2 text-left truncate max-w-[120px] sm:max-w-[170px] lg:max-w-[200px] font-medium">${v0.title}</td>
               <td class="py-2 px-1 text-center font-bold ${color0}">${v0.val !== undefined ? v0.val : '-'}</td>
               <td class="py-2 px-1 text-center border-l border-zinc-200 dark:border-zinc-800 font-bold ${color1}">${v1.val !== undefined ? v1.val : '-'}</td>
               <td class="py-2 px-2 text-right truncate max-w-[120px] sm:max-w-[170px] lg:max-w-[200px] font-medium">${v1.title}</td>
            </tr>
          `;
      }
      
      // Multi-review > 2 track rendering
      return `
        <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          ${row.vals.map((v, i) => {
              const isWinner = v.val === row.maxVal && v.val > -1;
              const colorClass = isWinner ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal text-zinc-800 dark:text-zinc-200";
              const borderClass = i > 0 ? 'border-l border-zinc-200 dark:border-zinc-800' : '';
              return `
                 <td class="py-2 px-2 max-w-[120px] truncate text-center ${borderClass}">
                    ${v.title !== '-' ? `<div class="text-[9px] sm:text-[10px] text-zinc-500 truncate mb-1" title="${v.title.replace(/"/g, "'")}">${v.title}</div><div class="font-bold ${colorClass}">${v.val !== undefined ? v.val : '-'}</div>` : '-'}
                 </td>
              `;
          }).join('')}
        </tr>
      `;
  };

  const content = `
    <div class="compare-modal-open fixed inset-0 bg-black/60 z-[100] flex justify-center items-end sm:items-center animate-slide-up backdrop-blur-sm p-0 sm:p-4" onclick="window.closeCompareModal(event)">
      <div class="bg-white dark:bg-zinc-950 w-full md:w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl relative" onclick="event.stopPropagation()">
        <div class="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur z-20 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex justify-between items-center">
            <h2 class="text-xl sm:text-2xl font-serif font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Сравнение</h2>
            <div class="flex items-center gap-4">
               <button onclick="window.clearCompare(); window.closeCompareModal(event)" class="text-[10px] hidden sm:block uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold">Очистить список</button>
               <button onclick="window.closeCompareModal(event)" class="text-zinc-500 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
            </div>
        </div>
        
        <div class="p-4 sm:p-6 text-center">
           <div class="flex flex-nowrap overflow-x-auto gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-inner items-start justify-center">
            ${selectedReviews.map((r, i) => `
              <div class="flex flex-col items-center flex-1 min-w-[100px] max-w-[160px]">
                 <img src="${r.cover}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shadow-md mb-3 ring-1 ring-black/5 dark:ring-white/10" />
                 <h3 class="font-bold text-[10px] sm:text-xs leading-tight line-clamp-2 uppercase tracking-widest">${r.title}</h3>
                 <div class="mt-3 text-xs sm:text-sm text-green-700 bg-green-100 dark:bg-green-950 dark:text-green-400 px-3 py-1 rounded-full font-black">${scores[i]} баллов</div>
              </div>
            `).join('')}
          </div>

           <div class="mb-8 font-black uppercase tracking-widest text-sm text-zinc-500">
               ${winnerText}
           </div>
          
          <div class="overflow-x-auto pb-8 flex justify-center">
             
             <div class="flex flex-col gap-8 w-full max-w-4xl">
             
                ${criteriaRows.length > 0 ? `
                  <table class="w-full text-left uppercase tracking-widest text-[10px] sm:text-xs">
                     <thead>
                       <tr class="border-b-2 border-black dark:border-white">
                         <th class="py-2 px-2 w-[120px] sm:w-[150px]">Критерий</th>
                         ${selectedReviews.map((_, i) => `<th class="py-2 text-center flex-1 min-w-[50px]">#${i+1}</th>`).join('')}
                       </tr>
                     </thead>
                     <tbody>
                        ${criteriaRows.map(renderCriteriaRow).join('')}
                     </tbody>
                  </table>
                ` : ''}

                ${trackRows.length > 0 ? `
                  <table class="w-full text-left uppercase tracking-widest text-[10px] sm:text-xs text-zinc-500">
                     <thead>
                       <tr class="border-b-2 border-black dark:border-white">
                         ${selectedReviews.length === 2 ? `
                           <th class="py-2 px-2 text-left w-[40%]">#1 ${selectedReviews[0].title}</th>
                           <th class="py-2 px-1 text-center">Оценка</th>
                           <th class="py-2 px-1 text-center border-l border-zinc-200 dark:border-zinc-800">Оценка</th>
                           <th class="py-2 px-2 text-right w-[40%]">#2 ${selectedReviews[1].title}</th>
                         ` : `
                           ${selectedReviews.map((r, i) => `<th class="py-2 text-center text-[9px] sm:text-xs min-w-[60px] ${i > 0 ? 'border-l border-zinc-200 dark:border-zinc-800' : ''}">#${i+1}</th>`).join('')}
                         `}
                       </tr>
                     </thead>
                     <tbody>
                        ${trackRows.map(renderTrackRow).join('')}
                     </tbody>
                  </table>
                ` : ''}
                
             </div>

          </div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = content;
};

window.closeCompareModal = function(e) {
  if (e) e.stopPropagation();
  const c = document.getElementById("compare-container");
  if (c) c.innerHTML = "";
};

window.updateCompareUI = function() {
  document.querySelectorAll("[data-compare-btn]").forEach(btn => {
     const pId = btn.getAttribute("data-compare-btn");
     if (window.compareQueue.includes(pId)) {
        btn.classList.add("bg-green-600", "dark:bg-green-500", "text-white");
        btn.classList.remove("bg-black", "dark:bg-white", "dark:text-black", "hover:bg-zinc-800", "dark:hover:bg-zinc-200");
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>Выбрано (${window.compareQueue.indexOf(pId) + 1})</span>`;
     } else {
        btn.classList.remove("bg-green-600", "dark:bg-green-500", "text-white");
        btn.classList.add("bg-black", "dark:bg-white", "dark:text-black", "hover:bg-zinc-800", "dark:hover:bg-zinc-200");
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg><span>Сравнить</span>`;
     }
  });

  const c = document.getElementById("compare-container");
  if (!c) return;
  
  if (window.compareQueue.length === 0) {
      c.innerHTML = "";
      return;
  }
  
  if (window.compareQueue.length >= 2 && !c.querySelector('.compare-modal-open')) {
      c.innerHTML = `
        <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 dark:bg-white text-white dark:text-black py-2 px-6 rounded-full shadow-2xl z-50 flex items-center gap-4 animate-slide-up">
           <div class="font-bold uppercase tracking-widest text-[10px] hidden sm:block whitespace-nowrap">Сравнение: ${window.compareQueue.length} шт.</div>
           <button onclick="window.renderCompareModal()" class="font-black text-xs uppercase tracking-widest text-zinc-300 dark:text-zinc-700 hover:text-white dark:hover:text-black transition-colors">Показать</button>
           <button onclick="window.clearCompare()" class="opacity-50 hover:opacity-100 transition-opacity p-1 ml-2 border-l border-white/20 pl-4 font-bold text-[10px] uppercase tracking-widest">Очистить</button>
        </div>
      `;
  } else if (window.compareQueue.length === 1) {
      c.innerHTML = `
        <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 dark:bg-white text-white dark:text-black backdrop-blur py-2 px-6 rounded-full shadow-2xl z-50 flex items-center gap-4 animate-slide-up">
           <div class="font-bold uppercase tracking-widest text-[10px] whitespace-nowrap">Выбран 1 релиз. Выберите еще.</div>
           <button onclick="window.clearCompare()" class="opacity-50 hover:opacity-100 transition-opacity p-1 ml-2 font-bold text-[10px] uppercase tracking-widest">Отмена</button>
        </div>
      `;
  }
};

// Icons
const ICONS = {
  SUN: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  MOON: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  DISC3: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6 12c0-1.7.7-3.2 1.8-4.2"/><circle cx="12" cy="12" r="2"/><path d="M18 12c0 1.7-.7 3.2-1.8 4.2"/></svg>`,
  DISC: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`,
  STAR: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  EXTERNAL_LINK: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  ARROW_LEFT: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  FLAME: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
};

// State
let recentReviewsDisplayed = 4;

// Theme Management
const themeToggle = document.getElementById("theme-toggle");
let currentTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

function applyTheme() {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(currentTheme);
  localStorage.setItem("theme", currentTheme);
  themeToggle.innerHTML = currentTheme === "dark" ? ICONS.SUN : ICONS.MOON;
}

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme();
});
applyTheme();

const headerLogo = document.getElementById("header-logo");
if (headerLogo) {
  headerLogo.addEventListener("click", (e) => {
    recentReviewsDisplayed = 4;
    if (window.location.hash === "" || window.location.hash === "#/") {
      e.preventDefault();
      renderHome();
      window.scrollTo(0, 0);
    }
  });
}

// Footer Year
document.getElementById("current-year").textContent = new Date()
  .getFullYear()
  .toString();

// Search Logic
const searchToggle = document.getElementById("search-toggle");
const searchDropdown = document.getElementById("search-dropdown");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const searchResults = document.getElementById("search-results");
const searchContainer = document.getElementById("search-container");

let searchOpen = false;

function closeSearch() {
  if (!searchOpen) return;
  searchOpen = false;
  searchDropdown.classList.add("hidden");
  searchInput.value = "";
  updateSearch();
}

searchToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  searchOpen = !searchOpen;
  if (searchOpen) {
    searchDropdown.classList.remove("hidden");
    searchInput.focus();
  } else {
    searchDropdown.classList.add("hidden");
  }
});

document.addEventListener("click", (e) => {
  if (searchOpen && !searchContainer.contains(e.target)) {
    closeSearch();
  }
});

searchInput.addEventListener("input", () => {
  updateSearch();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  updateSearch();
  searchInput.focus();
});

function updateSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchClear.classList.add("hidden");
    searchResults.classList.add("hidden");
    return;
  }

  searchClear.classList.remove("hidden");
  searchResults.classList.remove("hidden");

  const filteredReviews = reviews
    .filter((r) => {
      const artist = getArtist(r.artistId);
      return `${r.title} ${artist?.name}`.toLowerCase().includes(query);
    })
    .slice(0, 5);

  const filteredArtists = artists
    .filter(
      (a) => a.name.toLowerCase().includes(query) && a.id !== "various-artists",
    )
    .slice(0, 3);

  let html = "";

  if (filteredArtists.length > 0) {
    html += `
      <div class="p-2 border-b border-zinc-100 dark:border-zinc-800">
        <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">Артисты</div>
        ${filteredArtists
          .map(
            (artist) => `
          <a href="#/artists/${artist.id}" class="search-link flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-sm">
            <img src="${artist.photo}" alt="${artist.name}" class="w-8 h-8 rounded-full object-cover" />
            <span class="font-bold text-sm text-zinc-900 dark:text-white">${artist.name}</span>
          </a>
        `,
          )
          .join("")}
      </div>
    `;
  }

  if (filteredReviews.length > 0) {
    html += `
      <div class="p-2">
        <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">Рецензии</div>
        ${filteredReviews
          .map((review) => {
            const artist = getArtist(review.artistId);
            return `
            <a href="#/reviews/${review.id}" class="search-link flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-sm">
              <img src="${review.cover}" alt="${review.title}" class="w-10 h-10 object-cover rounded-sm" />
              <div>
                <div class="font-bold text-sm text-zinc-900 dark:text-white leading-tight">${review.title}</div>
                <div class="text-xs text-zinc-500">${artist?.name}</div>
              </div>
            </a>
          `;
          })
          .join("")}
      </div>
    `;
  }

  if (filteredArtists.length === 0 && filteredReviews.length === 0) {
    html = `
      <div class="p-6 text-center text-zinc-500 text-sm">
        Ничего не найдено по запросу "${escapeHtml(query)}"
      </div>
    `;
  }

  searchResults.innerHTML = html;

  document.querySelectorAll(".search-link").forEach((link) => {
    link.addEventListener("click", closeSearch);
  });
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const app = document.getElementById("app");

function renderHome() {
  const sortedReviews = [...reviews].sort((a, b) => {
    const timeA = a.reviewDate ? new Date(a.reviewDate).getTime() : 0;
    const timeB = b.reviewDate ? new Date(b.reviewDate).getTime() : 0;
    const diff = (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    if (diff !== 0) return diff;
    const relA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const relB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return (isNaN(relB) ? 0 : relB) - (isNaN(relA) ? 0 : relA);
  });
  const pastReviews = sortedReviews.filter((r) => !r.isUpcoming);
  let featuredReview = pastReviews[0];

  if (featuredReview && featuredReview.isSingle) {
    const recentAlbum = pastReviews.find((r) => {
      if (r.isSingle) return false;
      const releaseTime = new Date(r.releaseDate).getTime();
      const daysSinceRelease =
        (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
      return daysSinceRelease <= 7;
    });

    if (recentAlbum) {
      featuredReview = recentAlbum;
    }
  }

  const otherReviewsAll = pastReviews.filter(
    (r) => r.id !== featuredReview?.id,
  );
  const otherReviews = otherReviewsAll.slice(0, recentReviewsDisplayed);

  const springReviews = [...reviews].filter(r => {
    if (!r.releaseDate) return false;
    const rd = r.releaseDate;
    return rd >= '2026-03-01' && rd <= '2026-05-31';
  });
  const springCovers = springReviews.map(r => r.cover).sort(() => 0.5 - Math.random());
  
  const c1 = [...springCovers].sort(() => 0.5 - Math.random());
  const c2 = [...springCovers].sort(() => 0.5 - Math.random());
  const c3 = [...springCovers].sort(() => 0.5 - Math.random());
  
  const renderCol = (covers) => covers.map(c => `<img src="${c}" class="w-full aspect-square object-cover rounded-lg shadow-md" />`).join('');

  let html = `<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up">`;
  
  html += `
    <section class="mb-12">
      <a href="#/madness" class="group block relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
        
        <div class="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-40 gap-4 sm:gap-8 pointer-events-none overflow-hidden scale-110 group-hover:scale-100 transition-transform duration-700 delay-75">
           <div class="flex flex-col gap-6 sm:gap-12">
              <div class="w-12 h-6 sm:w-16 sm:h-8 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
              <div class="w-12 h-6 sm:w-16 sm:h-8 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
           </div>
           <div class="flex flex-col gap-12 sm:gap-24">
              <div class="w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
           </div>
           <div class="w-16 sm:w-24 h-0 border-b-2 border-black dark:border-white relative">
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-black dark:bg-white rounded-full"></div>
           </div>
        </div>

        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-black dark:text-white drop-shadow-sm">
          <span class="bg-black text-white dark:bg-white dark:text-black text-[10px] md:text-xs font-black px-4 py-1.5 uppercase tracking-widest rounded-full mb-4 shadow-xl">
            Событие
          </span>
          <h2 class="text-4xl md:text-6xl font-serif font-black leading-tight tracking-tighter group-hover:scale-105 transition-transform duration-500">
            HUEFORK MADNESS
          </h2>
          <p class="mt-3 text-sm md:text-base font-bold text-zinc-600 dark:text-zinc-400 tracking-widest uppercase flex items-center gap-2 justify-center">
            Турнир релизов
          </p>
        </div>
      </a>
    </section>
  `;

  html += `
    <section class="mb-12">
      <style>
        @keyframes slide-v-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes slide-v-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .spring-col-up { animation: slide-v-up 40s linear infinite; }
        .spring-col-down { animation: slide-v-down 45s linear infinite; }
      </style>
      <a href="#/spring-2026" class="group block relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-lime-200 via-green-100 to-emerald-200 dark:from-green-950 dark:via-emerald-900 dark:to-lime-950 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div class="absolute inset-0 bg-white/30 dark:bg-black/40 z-10 backdrop-blur-[2px]"></div>
        
        <div class="absolute inset-0 flex gap-2 md:gap-4 p-2 md:p-4 rotate-[-6deg] scale-125 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
          <div class="flex-1 w-1/3 flex flex-col gap-2 md:gap-4 spring-col-up">
            ${renderCol([...c1, ...c1])}
          </div>
          <div class="flex-1 w-1/3 flex flex-col gap-2 md:gap-4 spring-col-down">
            ${renderCol([...c2, ...c2])}
          </div>
          <div class="flex-1 w-1/3 flex flex-col gap-2 md:gap-4 spring-col-up" style="animation-duration: 50s; animation-delay: -10s;">
            ${renderCol([...c3, ...c3])}
          </div>
        </div>

        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-zinc-900 dark:text-white drop-shadow-md cursor-pointer">
          <span class="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-full mb-3 shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-500/30">
            Итоги Сезона
          </span>
          <h2 class="text-4xl md:text-6xl font-serif font-black leading-tight tracking-tighter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
            Весна 2026
          </h2>
          <p class="mt-2 text-sm md:text-base font-bold text-emerald-900/80 dark:text-emerald-100/80 tracking-widest uppercase text-shadow-sm">
            Топ лучших релизов
          </p>
        </div>
      </a>
    </section>
  `;

  if (featuredReview) {
    const artistNames = (featuredReview.artistIds || [featuredReview.artistId])
      .map((id) => getArtist(id)?.name)
      .filter(Boolean)
      .join(", ");
    html += `
      <section class="mb-16">
        <a href="#/reviews/${featuredReview.id}" class="group block relative aspect-[4/3] w-full max-h-[80vh] overflow-hidden mb-6 flex flex-col justify-end">
           <div class="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-900">
             <img src="${featuredReview.cover}" alt="${featuredReview.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
             <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
           </div>
           <div class="relative z-10 p-6 md:p-12 text-white">
             <div class="mb-4">
                <span class="bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest">Новая рецензия</span>
             </div>
             <h2 class="text-4xl md:text-6xl font-serif font-black leading-tight mb-2 group-hover:text-red-400 transition-colors">
               ${artistNames}: ${featuredReview.title}
             </h2>
             <p class="text-lg md:text-xl text-zinc-300 max-w-2xl hidden md:block">${featuredReview.text}</p>
           </div>
        </a>
      </section>
    `;
  }

  const upcomingReviews = sortedReviews
    .filter((r) => r.isUpcoming)
    .sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

  if (upcomingReviews.length > 0) {
    html += `
      <section class="mb-16">
        <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm flex items-center gap-3">
          Скорые релизы
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${upcomingReviews
            .slice(0, 4)
            .map((review) => {
              const artistNames = (review.artistIds || [review.artistId])
                .map((id) => getArtist(id)?.name)
                .filter(Boolean)
                .join(", ");
              return `
              <a href="#/reviews/${review.id}" class="group block relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-end shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                 <div class="absolute inset-0 z-0">
                   <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                   <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                 </div>
                 <div class="relative z-10 p-4 sm:p-6 text-white w-full">
                   <div class="mb-2 sm:mb-3">
                      <span class="bg-yellow-400 text-black text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-widest rounded-sm inline-flex items-center gap-1.5 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${review.releaseDate ? formatDate(review.releaseDate) : "Скоро"}</span>
                   </div>
                   <h3 class="text-xl sm:text-2xl md:text-3xl font-serif font-black leading-tight group-hover:text-yellow-400 transition-colors drop-shadow-md">
                     ${artistNames}: <br/>${review.title}
                   </h3>
                 </div>
              </a>
            `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  if (otherReviews.length > 0) {
    html += `
      <section class="mb-16">
        <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Недавние рецензии</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${otherReviews
            .map((review) => {
              const artistNames = (review.artistIds || [review.artistId])
                .map((id) => getArtist(id)?.name)
                .filter(Boolean)
                .join(", ");
              return `
              <a href="#/reviews/${review.id}" class="group flex flex-col p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                <div class="aspect-square w-full relative overflow-hidden mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  ${review.isCancelled ? `<div class="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Отменен</div>` : review.isUpcoming ? `<div class="absolute bottom-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Скоро</div>` : ""}
                </div>
                <h3 class="font-serif font-bold text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50 break-words">
                  ${artistNames}: <i>${review.title}</i>
                </h3>
              </a>
            `;
            })
            .join("")}
        </div>
        ${
          otherReviews.length < otherReviewsAll.length
            ? `
          <div class="mt-8 text-center flex justify-center">
            <button id="load-more-recent" class="border-2 border-black dark:border-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Больше
            </button>
          </div>
        `
            : ""
        }
      </section>
    `;
  }

  html += `
    <section class="mb-16 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 animate-slide-up hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
      <div class="text-center sm:text-left flex items-center gap-3">
         <div class="hidden sm:flex w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center text-zinc-500 dark:text-zinc-400 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         </div>
         <div>
           <h2 class="font-bold text-sm text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">Не знаете что послушать?</h2>
           <p class="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">Случайная рецензия из нашей базы</p>
         </div>
      </div>
      <button id="random-review-btn" class="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs px-6 py-2.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        Крутить
      </button>
    </section>
  `;

  const albums = sortedReviews.filter((r) => !r.isSingle);

  html += `
    <section class="mb-16">
      <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm flex items-center gap-3">
        Альбомы
      </h2>
      ${
        albums.length > 0
          ? `<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
              ${albums
                .slice(0, 6)
                .map((review) => {
                  const artist = getArtist(review.artistId);
                  return `
                  <a href="#/reviews/${review.id}" class="group flex flex-col p-2 sm:p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                    <div class="aspect-square w-full relative overflow-hidden mb-2 sm:mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                      ${review.isCancelled ? `<div class="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Отменен</div>` : review.isUpcoming ? `<div class="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Скоро</div>` : ""}
                    </div>
                    <h3 class="font-serif font-bold text-xs sm:text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50 break-words">
                      ${artist?.name}: <i>${review.title}</i>
                    </h3>
                  </a>
                `;
                })
                .join("")}
             </div>`
          : `<div class="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <div class="text-zinc-500 dark:text-zinc-400 font-serif italic text-lg mb-2">Здесь будут рецензии на альбомы</div>
             </div>`
      }
    </section>
  `;

  const singles = sortedReviews.filter((r) => r.isSingle);

  html += `
    <section class="mb-16">
      <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm flex items-center gap-3">
        Синглы
      </h2>
      ${
        singles.length > 0
          ? `<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
              ${singles
                .slice(0, 6)
                .map((review) => {
                  const artist = getArtist(review.artistId);
                  return `
                  <a href="#/reviews/${review.id}" class="group flex flex-col p-2 sm:p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                    <div class="aspect-square w-full relative overflow-hidden mb-2 sm:mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    </div>
                    <h3 class="font-serif font-bold text-xs sm:text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50 break-words">
                      ${artist?.name}: <i>${review.title}</i>
                    </h3>
                  </a>
                `;
                })
                .join("")}
             </div>`
          : `<div class="py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <div class="text-zinc-500 dark:text-zinc-400 font-serif italic text-lg mb-2">Здесь будут рецензии на синглы</div>
              <div class="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Ожидайте обновления</div>
             </div>`
      }
    </section>
  `;

  const generateArtistsHtml = (artistsList) => {
    return artistsList
      .sort((a, b) => {
        const getLatestReviewDate = (artistId) => {
          const artistReviews = reviews.filter(
            (r) =>
              (r.artistId === artistId ||
                (r.artistIds && r.artistIds.includes(artistId))) &&
              !r.isUpcoming,
          );
          if (artistReviews.length === 0) return 0;
          return Math.max(
            ...artistReviews.map((r) =>
              r.reviewDate ? new Date(r.reviewDate).getTime() : 0,
            ),
          );
        };
        return getLatestReviewDate(b.id) - getLatestReviewDate(a.id);
      })
      .map((artist) => {
        const artistReviews = reviews.filter(
          (r) =>
            (r.artistId === artist.id ||
              (r.artistIds && r.artistIds.includes(artist.id))) &&
            !r.isUpcoming,
        );
        const totalScore = artistReviews.reduce(
          (sum, r) => sum + getScore(r),
          0,
        );
        const avgScore =
          artistReviews.length > 0
            ? (totalScore / artistReviews.length).toFixed(1)
            : "-";
        const ratingVal = getArtistValue(artist.id);

        return `
    <a href="#/artists/${artist.id}" class="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
      <div class="aspect-square rounded-full overflow-hidden mb-4 max-w-[8rem] w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group-hover:shadow-md transition-all">
        <img src="${artist.photo}" alt="${artist.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
      </div>
      <h3 class="font-bold text-sm uppercase tracking-wide group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors text-zinc-900 dark:text-zinc-50 mb-1">${artist.name}</h3>
      <div class="flex flex-col gap-1 items-center mt-1">
        ${ratingVal > 0 ? `<span class="text-xs font-mono font-bold ${ratingVal >= 8.0 ? "text-white bg-red-600 dark:bg-red-600 border border-transparent" : "text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"} px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> РЕЙТИНГ: ${ratingVal.toFixed(1)}</span>` : ""}
        <span class="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">СР. ОЦЕНКА: <span class="${avgScore >= 8.0 ? "text-red-600 dark:text-red-400" : ""}">${avgScore}</span></span>
      </div>
    </a>
  `;
      })
      .join("");
  };

  const globalArtistsList = [...artists].filter(
    (artist) => artist.id !== "various-artists" && artist.isGlobal,
  );

  html += `
    <section>
      <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Артисты</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        ${generateArtistsHtml([...artists].filter((artist) => artist.id !== "various-artists" && !artist.isGlobal))}
      </div>
    </section>
  `;

  if (globalArtistsList.length > 0) {
    html += `
      <section class="mt-12 mb-12">
        <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Глобальные артисты</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          ${generateArtistsHtml(globalArtistsList)}
        </div>
      </section>
    `;
  }

  html += `
    <section class="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-0 text-center animate-slide-up">
      <div class="max-w-3xl mx-auto bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden group border border-zinc-800 dark:border-zinc-700">
        <div class="absolute -inset-10 bg-red-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="relative z-10 flex flex-col items-center">
            <h2 class="font-serif font-black text-3xl sm:text-4xl lg:text-5xl mb-4 text-white uppercase tracking-tight">Зал Визуала</h2>
            <p class="text-zinc-400 mb-8 max-w-xl mx-auto text-sm sm:text-base font-serif italic">
               Галерея релизов, чьё визуальное оформление достигло абсолютного идеала. Только 10 из 10.
            </p>
            <a href="#/hall" class="inline-block bg-white text-black font-bold uppercase tracking-widest text-xs sm:text-sm px-8 py-4 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-lg hover:shadow-red-500/25">
               Войти в зал
            </a>
        </div>
      </div>
    </section>
  `;

  html += `
    <section class="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-12 text-center animate-slide-up">
      <h2 class="font-serif font-black text-3xl sm:text-4xl mb-4 text-zinc-900 dark:text-zinc-50">Выпускаете новый материал?</h2>
      <p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
        Отправьте свой релиз на рассмотрение редакции. Мы слушаем всё, но рецензируем только то, что вызывает у нас эмоции.
      </p>
      <a href="#/request" class="inline-block bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
        Заказать рецензию
      </a>
    </section>
  </div>
  <div id="roulette-overlay" class="fixed inset-0 z-[100] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
    <div class="text-center w-full px-4">
      <div id="roulette-pulse-text" class="text-xs uppercase tracking-widest text-red-500 font-bold mb-6 animate-pulse">Выбираем релиз...</div>
      <div id="roulette-stage" class="relative w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl opacity-50 scale-90 transition-all duration-300 border-4 border-transparent">
        <img id="roulette-cover" src="" class="w-full h-full object-cover" />
      </div>
      <h3 id="roulette-title" class="font-serif font-black text-3xl sm:text-5xl text-zinc-900 dark:text-zinc-50 truncate transition-all duration-300 mb-3 w-full max-w-2xl mx-auto">&nbsp;</h3>
      <p id="roulette-artist" class="font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg truncate transition-all duration-300 w-full max-w-2xl mx-auto">&nbsp;</p>
    </div>
  </div>`;

  app.innerHTML = html;
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const moreBtn = document.getElementById("load-more-recent");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      recentReviewsDisplayed += 4;
      renderHome();
    });
  }

  const randomReviewBtn = document.getElementById("random-review-btn");
  if (randomReviewBtn) {
    randomReviewBtn.addEventListener("click", () => {
      const validReviews = reviews.filter(r => !r.isUpcoming && !r.isCancelled);
      if (validReviews.length === 0) return;

      const overlay = document.getElementById("roulette-overlay");
      const cover = document.getElementById("roulette-cover");
      const title = document.getElementById("roulette-title");
      const artistEl = document.getElementById("roulette-artist");
      const stage = document.getElementById("roulette-stage");
      const pulseText = document.getElementById("roulette-pulse-text");

      overlay.classList.remove("opacity-0", "pointer-events-none");
      document.body.style.overflow = "hidden"; 
      
      let iters = 0;
      const maxIters = 25; 
      let intervalSpeed = 50;
      
      let wheelInterval = setInterval(pickRandom, intervalSpeed);
      let targetReview = validReviews[Math.floor(Math.random() * validReviews.length)];

      function pickRandom() {
        iters++;
        let r = validReviews[Math.floor(Math.random() * validReviews.length)];
        if (iters >= maxIters) r = targetReview; 

        cover.src = r.cover;
        title.textContent = r.title;
        const artistNames = (r.artistIds || [r.artistId])
            .map((id) => getArtist(id)?.name)
            .filter(Boolean)
            .join(", ");
        artistEl.textContent = artistNames;

        if (iters > maxIters * 0.6) {
            clearInterval(wheelInterval);
            intervalSpeed += 40;
            wheelInterval = setInterval(pickRandom, intervalSpeed);
        }

        if (iters >= maxIters) {
          clearInterval(wheelInterval);
          stage.classList.remove("opacity-50", "scale-90", "border-transparent");
          stage.classList.add("opacity-100", "scale-105", "border-red-500");
          pulseText.classList.remove("animate-pulse", "text-red-500");
          pulseText.classList.add("text-emerald-500");
          pulseText.textContent = "Случайный выбор!";
          
          setTimeout(() => {
            overlay.classList.add("opacity-0", "pointer-events-none");
            document.body.style.overflow = "";
            setTimeout(() => {
                window.location.hash = "/reviews/" + targetReview.id;
            }, 300);
          }, 1500);
        }
      }
    });
  }


}

function renderReview(id) {
  const review = getReview(id);
  if (!review) {
    window.location.hash = "/";
    return;
  }

  const artist = getArtist(review.artistId);
  const score = getScore(review);
  const isBNM = !review.isUpcoming && !review.isSingle && score >= 8.2;
  const isBNT = !review.isUpcoming && review.isSingle && score >= 9.2;
  const globalRank = getGlobalRank(review.id, review.isSingle);
  const tier = getTier(review.id, review.isSingle);
  const artistRank = getArtistRank(review.id, review.artistId, review.isSingle);

  const springReviews = [...reviews].filter((r) => r.releaseDate && r.releaseDate >= '2026-03-01' && r.releaseDate <= '2026-05-31' && !r.isUpcoming && !r.noTop);
  let springRank = null;
  const isSpringTop = springReviews.some(r => r.id === review.id);
  if (isSpringTop) {
    const springSameType = springReviews.filter(r => !!r.isSingle === !!review.isSingle).sort((a,b) => getScore(b) - getScore(a));
    springRank = springSameType.findIndex(r => r.id === review.id) + 1;
  }

  if (isSpringTop) {
    document.body.classList.add("bg-emerald-50", "dark:bg-emerald-950/50");
    document.body.classList.remove("bg-red-50", "dark:bg-red-950/50");
  } else if (isBNM || isBNT) {
    document.body.classList.add("bg-red-50", "dark:bg-red-950/50");
    document.body.classList.remove("bg-emerald-50", "dark:bg-emerald-950/50");
  } else {
    document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");
  }

  const itemsToRender =
    review.isSingle && review.singleCriteria
      ? [...review.singleCriteria]
      : review.tracks
        ? [...review.tracks]
        : [];

  const userRatingsData = JSON.parse(
    localStorage.getItem("userRatings") || "{}",
  );
  const currentUserRating = userRatingsData[review.id] || {
    tracks: {},
    criteria: {},
  };
  let allRatingsCount = 0;
  let allRatingsSum = 0;

  Object.values(currentUserRating.tracks || {}).forEach((v) => {
    if (v !== "" && !isNaN(parseInt(v))) {
      allRatingsSum += parseInt(v);
      allRatingsCount++;
    }
  });
  Object.values(currentUserRating.criteria || {}).forEach((v) => {
    if (v !== "" && !isNaN(parseInt(v))) {
      allRatingsSum += parseInt(v);
      allRatingsCount++;
    }
  });
  const avgUserScore =
    allRatingsCount > 0 ? (allRatingsSum / allRatingsCount).toFixed(1) : null;
  const isWantsToRate = currentUserRating.wantsToRate === true;

  let parentAlbums = [];
  if (review.isSingle) {
    parentAlbums = reviews.filter(
      (r) =>
        (!r.isSingle && review.albumId === r.id) ||
        (!r.isSingle &&
        r.tracks &&
        r.tracks.some(
          (item) =>
            (item.singleId && item.singleId === review.id) ||
            ((r.artistIds || [r.artistId]).some((id) =>
              (review.artistIds || [review.artistId]).includes(id),
            ) &&
              item.title &&
              review.title &&
              item.title.toLowerCase() === review.title.toLowerCase()),
        ))
    );
  }

  const parentAlbumHtml =
    parentAlbums.length > 0
      ? `
    <div class="mt-4 flex flex-wrap gap-2">
      ${parentAlbums
        .map(
          (parentAlbum) => `
      <a href="#/reviews/${parentAlbum.id}" class="inline-flex items-center gap-3 p-2 pr-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 rounded-xl transition-all border border-zinc-200 dark:border-zinc-700/50 group w-max shadow-sm">
        <img src="${parentAlbum.cover}" alt="${parentAlbum.title}" class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
        <div class="flex flex-col justify-center">
          <span class="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-black">Состоит в альбоме</span>
          <span class="text-sm sm:text-base font-bold font-serif leading-none text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">${parentAlbum.title}</span>
        </div>
      </a>
      `,
        )
        .join("")}
    </div>
  `
      : "";

  const artistReviewsList = reviews
    .map((r) => ({ ...r, scoreVal: getScore(r) }))
    .filter(
      (r) =>
        r.scoreVal !== null &&
        !!r.isSingle === !!review.isSingle &&
        (r.artistIds || [r.artistId]).some((id) =>
          (review.artistIds || [review.artistId]).includes(id),
        ),
    )
    .sort((a, b) => {
      if (b.scoreVal !== a.scoreVal) return b.scoreVal - a.scoreVal;
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    });

  const currentIndex = artistReviewsList.findIndex((r) => r.id === review.id);
  const higherRelease =
    currentIndex > 0 ? artistReviewsList[currentIndex - 1] : null;
  const lowerRelease =
    currentIndex !== -1 && currentIndex < artistReviewsList.length - 1
      ? artistReviewsList[currentIndex + 1]
      : null;

  const getReleaseHtml = (rel, typeLabel, isCurrent = false) => {
    if (!rel && isCurrent) return `<div class="w-full"></div>`;
    if (!rel)
      return `<div class="w-full h-full flex flex-col items-center justify-center opacity-30 text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-zinc-400 text-center px-1">${typeLabel === "Ниже" ? "Нет ниже" : "Лучший релиз"}</div>`;

    if (isCurrent) {
      return `
        <div class="flex flex-col items-center text-center gap-2 w-full min-w-0 p-1 sm:p-2 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-default">
          <div class="relative">
             <img src="${rel.cover}" class="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover shadow-sm shrink-0 border-2 border-red-600 dark:border-red-500" />
             <div class="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-600 text-white text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-widest shadow-md">Эта</div>
          </div>
          <div class="flex flex-col min-w-0 items-center">
            <span class="text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-0.5">${score.toFixed(1)}</span>
            <span class="text-[9px] sm:text-xs font-serif font-bold text-zinc-900 dark:text-zinc-100 truncate w-full" title="${rel.title}">${rel.title}</span>
          </div>
        </div>
      `;
    }

    return `
      <a href="#/reviews/${rel.id}" class="group flex flex-col items-center text-center gap-2 w-full min-w-0 transition-all p-1 sm:p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
        <img src="${rel.cover}" class="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0" />
        <div class="flex flex-col min-w-0 items-center">
          <span class="text-[8px] sm:text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">${typeLabel} (${rel.scoreVal.toFixed(1)})</span>
          <span class="text-[9px] sm:text-xs font-serif font-bold text-zinc-700 dark:text-zinc-300 truncate w-full group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" title="${rel.title}">${rel.title}</span>
        </div>
      </a>
    `;
  };

  const prevNextHtml =
    lowerRelease || higherRelease
      ? `
    <div class="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h3 class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 text-center">Относительно топа артиста(ов)</h3>
      <div class="grid grid-cols-3 gap-1 sm:gap-4 items-end justify-center max-w-lg mx-auto">
        ${getReleaseHtml(lowerRelease, "Ниже")}
        ${getReleaseHtml(currentIndex !== -1 ? review : null, "Эта", true)}
        ${getReleaseHtml(higherRelease, "Выше")}
      </div>
    </div>
  `
      : "";

  const generateListHtml = (items, isTracks = true) => {
    return items
      .map((item, idx) => {
        const isHigh = item.score !== undefined && item.score >= 9;
        const isGrey = isTracks && ((review.greyTracks || item.isGrey || (item.title && /^track\s*\d+/i.test(item.title))) && item.isGrey !== false);
        const titleColorClass = isGrey
          ? "text-zinc-400 dark:text-zinc-500 font-medium italic"
          : "font-bold text-zinc-800 dark:text-zinc-200";
        const numberStr = !isTracks
          ? ""
          : item.number !== undefined
            ? item.number
              ? `${item.number}.`
              : ""
            : `${idx + 1}.`;

        const singleReview =
          isTracks && !review.isSingle
            ? reviews.find(
                (r) =>
                  r.isSingle &&
                  (item.singleId
                    ? r.id === item.singleId
                    : r.artistId === review.artistId &&
                      r.title.toLowerCase() === item.title.toLowerCase()),
              )
            : null;

        let originalAlbumLink = null;
        if (item.title === "Original Album") {
          const artistAlbums = [...reviews].filter(
            (r) =>
              r.artistId === review.artistId &&
              !r.isSingle &&
              r.id !== review.id,
          );
          artistAlbums.sort(
            (a, b) =>
              new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime(),
          );
          const orig = artistAlbums.find(
            (r) =>
              new Date(r.releaseDate).getTime() <=
              new Date(review.releaseDate).getTime(),
          );
          if (orig) {
            originalAlbumLink = `#/reviews/${orig.id}`;
          }
        }

        const titleHtml = originalAlbumLink
          ? `<a href="${originalAlbumLink}" class="hover:underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">${item.title}</a>`
          : item.title;

        const userScoreVal =
          currentUserRating[isTracks ? "tracks" : "criteria"]?.[item.title];
        const parsedVal =
          userScoreVal !== undefined && userScoreVal !== ""
            ? parseInt(userScoreVal)
            : null;

        return `
        <div class="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 group hover:bg-black/5 dark:hover:bg-white/5 px-2 -mx-2 transition-colors">
           <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
             ${numberStr ? `<span class="${isGrey ? "text-zinc-400/60 dark:text-zinc-500/60" : "text-zinc-400 dark:text-zinc-500"} font-mono text-sm w-5 sm:w-6 flex-shrink-0 text-right">${numberStr}</span>` : ""}
             <span class="${titleColorClass} ${!numberStr ? "pl-2" : ""} inline-block break-words min-w-0 flex-1">
               ${titleHtml}
             </span>
           </div>
           <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
             <div class="rating-readonly-view flex items-center gap-2">
               ${originalAlbumLink ? `<a href="${originalAlbumLink}" title="Оригинальный альбом" class="text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors">${ICONS.EXTERNAL_LINK}</a>` : ""}
               ${singleReview ? `<a href="#/reviews/${singleReview.id}" title="Читать разбор сингла" class="text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors">${ICONS.EXTERNAL_LINK}</a>` : ""}
               <span class="user-score-readonly-val text-zinc-500 dark:text-zinc-500 font-medium text-[10px] w-5 text-center h-5 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 ${parsedVal !== null ? "opacity-100" : "opacity-0 hidden"}" title="Ваша оценка">${parsedVal !== null ? parsedVal : ""}</span>
               <span class="font-bold w-8 text-center rounded flex items-center justify-center h-7 text-sm ml-1 ${isGrey ? "text-zinc-400 dark:text-zinc-600 bg-transparent" : isHigh ? "text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/10"}">
                 ${item.score !== undefined && item.score !== null ? item.score : "-"}
               </span>
             </div>
             
             ${
               !review.isUpcoming
                 ? `
             <div class="rating-edit-view hidden items-center gap-2">
                <button data-action="minus" data-review-id="${review.id}" data-type="${isTracks ? "tracks" : "criteria"}" data-title="${item.title.replace(/"/g, "&quot;")}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none ${parsedVal === null ? "opacity-30 pointer-events-none" : ""}">-</button>
                <span class="rate-val-display w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none">${parsedVal !== null ? parsedVal : "-"}</span>
                <button data-action="plus" data-review-id="${review.id}" data-type="${isTracks ? "tracks" : "criteria"}" data-title="${item.title.replace(/"/g, "&quot;")}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none ${parsedVal !== null && parsedVal >= 10 ? "opacity-30 pointer-events-none" : ""}">+</button>
             </div>
             `
                 : ""
             }
           </div>
         </div>
       `;
      })
      .join("");
  };

  const tracklistHtml = generateListHtml(itemsToRender, true);
  const criteriaHtml =
    review.criteria && review.criteria.length
      ? generateListHtml(review.criteria, false)
      : "";

  app.innerHTML = `
    <div class="min-h-screen transition-colors duration-500 pb-20 pt-1">
      <article class="max-w-4xl mx-auto px-4 py-8 md:py-16 animate-slide-up">
        <button class="back-button mb-8 flex items-center gap-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          ${ICONS.ARROW_LEFT} Назад
        </button>
        <header class="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
          <div class="flex-1 order-2 md:order-1 flex flex-col justify-center">
            ${
              review.isCancelled
                ? `
              <div class="mb-6 bg-red-600 text-white px-4 py-3 rounded-lg font-bold text-sm tracking-wide uppercase flex items-center gap-3 w-fit">
                Отмененный релиз
              </div>
            `
                : review.isUpcoming
                  ? `
              <div class="mb-6 bg-yellow-400 text-black px-4 py-3 rounded-lg font-bold text-sm tracking-wide uppercase flex items-center gap-3 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Ожидаемый релиз
              </div>
            `
                  : ""
            }
            ${
              isSpringTop && springRank
                ? `
              <div class="mb-4">
                <a href="#/spring-2026" class="bg-emerald-600 text-white font-bold text-xs px-3 py-1 uppercase tracking-widest rounded-full inline-flex items-center gap-1 hover:bg-emerald-700 transition-colors">
                  ${ICONS.STAR || ''} Топ-${springRank} ${review.isSingle ? "Сингл" : "Альбом"} Весны
                </a>
              </div>
            `
                : isBNM
                ? `
              <div class="mb-4">
                <span class="bg-red-600 text-white font-bold text-xs px-3 py-1 uppercase tracking-widest rounded-full inline-flex items-center gap-1">
                  ${ICONS.DISC3} Лучшая новая музыка
                </span>
              </div>
            `
                : isBNT
                  ? `
              <div class="mb-4">
                <span class="bg-red-600 text-white font-bold text-xs px-3 py-1 uppercase tracking-widest rounded-full inline-flex items-center gap-1">
                  ${ICONS.DISC3} Лучший новый трек
                </span>
              </div>
            `
                  : ""
            }
            <h2 class="font-serif font-black text-4xl md:text-6xl mb-2 text-zinc-900 dark:text-zinc-50 leading-tight">
              ${review.title}
            </h2>
            <div class="mt-2 flex flex-wrap gap-3 items-center">
            ${(review.artistIds || [review.artistId])
              .map((id) => getArtist(id))
              .filter(Boolean)
              .map(
                (a, i, arr) => `
              <a href="#/artists/${a.id}" class="inline-flex items-center group w-max">
                <img src="${a.photo || a.banner || 'https://i.postimg.cc/FKxyCBhy/IMG-20260508-160333-769.jpg'}" alt="${a.name}" class="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover mr-2 border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:border-red-500 transition-colors" />
                <h3 class="font-bold text-xl md:text-2xl uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                  ${a.name}${i < arr.length - 1 ? '<span class="text-zinc-600 dark:text-zinc-400 ml-1">,</span>' : ""}
                </h3>
              </a>
            `,
              )
              .join("")}
            </div>
            
            ${parentAlbumHtml}

            <div class="mt-6 flex flex-wrap gap-4">
               ${
                 review.isUpcoming
                   ? `
               <button id="wants-to-rate-btn" data-review-id="${review.id}" class="text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full border shadow-sm ${isWantsToRate ? "bg-black text-white dark:bg-white dark:text-black border-transparent hover:opacity-90" : "bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-black dark:hover:border-white"} transition-all duration-300 transform active:scale-95">
                  ${isWantsToRate ? "В заметках" : "Хочу оценить"}
               </button>
               `
                   : `
               <a href="https://t.me/share/url?url=https://t.me/HueForkBot&text=${encodeURIComponent(`Посмотри эту рецензию на HueFork!\n${review.isSingle ? "Сингл" : "Альбом"} ${[...new Set((review.artistIds || [review.artistId]).map((id) => getArtist(id)?.name).filter(Boolean))].join(", ")} — «${review.title}» получил ${score.toFixed(1)} баллов!\nСмотреть тут: @HueForkBot`)}" target="_blank" rel="noopener noreferrer" class="text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full border shadow-sm bg-[#2AABEE]/10 text-[#2AABEE] dark:text-[#2AABEE] border-transparent hover:bg-[#2AABEE]/20 transition-all duration-300 transform active:scale-95 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  Поделиться
               </a>
               `
               }
            </div>
            
            <div class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              <div><span class="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Лейбл</span>${review.label}</div>
              ${review.releaseDate ? `<div><span class="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Год</span>${formatYear(review.releaseDate)}</div>` : ""}
            </div>
            
            <div class="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
               ${
                 !review.isUpcoming && !review.noTop && globalRank > 0
                   ? `
                 <div>
                    <span class="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе ${review.isSingle ? "синглов" : "альбомов"} платформы</span>
                    <div class="font-serif italic text-xl dark:text-zinc-200">#${globalRank}</div>
                 </div>
               `
                   : ""
               }
               ${
                 !review.isUpcoming && !review.noTop && tier
                   ? `
                 <div>
                    <span class="block text-zinc-500 text-xs uppercase tracking-wider mb-2">Позиция в тир-листе</span>
                    <div class="font-serif italic text-xl ${isSpringTop ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"} font-bold">${tier}</div>
                 </div>
               `
                   : ""
               }
               ${
                 !review.isUpcoming && !review.noTop
                   ? `<div class="contents">
                        ${(review.artistIds || [review.artistId])
                          .map((id) => {
                            const a = getArtist(id);
                            const aRank = getArtistRank(
                              review.id,
                              id,
                              review.isSingle,
                            );
                            if (a && aRank > 0) {
                              return `
                             <div>
                                <span class="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе ${review.isSingle ? "синглов" : "альбомов"} артиста</span>
                                <div class="font-serif italic text-xl dark:text-zinc-200">#${aRank} <span class="text-sm font-sans not-italic text-zinc-400 dark:text-zinc-600">/ ${a.name}</span></div>
                             </div>
                             `;
                            }
                            return "";
                          })
                          .join("")}
                      </div>`
                   : ""
               }
            </div>
          </div>
          
          <div class="w-[calc(100%-2rem)] md:w-[calc(20rem-2rem)] lg:w-80 flex-shrink-0 order-1 md:order-2 mb-6 md:mb-0 mr-2 md:mr-6 lg:mr-4">
            <div class="relative group">
              <img src="${review.cover}" alt="${review.title}" class="w-full bg-zinc-100 dark:bg-zinc-900 aspect-square object-cover shadow-2xl dark:shadow-none dark:ring-1 dark:ring-white/10" />
              <div title="Оценка" class="absolute -bottom-6 -right-6 md:-right-8 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-xl border-4 z-10 font-bold ${isSpringTop ? "bg-emerald-50 border-emerald-50 dark:bg-emerald-950 dark:border-emerald-950" : isBNM ? "bg-red-50 border-red-50 dark:bg-red-950 dark:border-red-950" : "bg-white border-white dark:bg-zinc-950 dark:border-zinc-950"} group-hover:scale-105 transition-transform duration-500">
                 <div class="text-center">
                   ${
                     review.isUpcoming
                       ? `
                     <div class="text-4xl md:text-5xl font-black text-zinc-400 dark:text-zinc-600 tracking-tighter leading-none">?</div>
                   `
                       : `
                     <div class="score-animate text-4xl md:text-5xl tracking-tighter leading-none ${score >= 8.0 ? (isSpringTop ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500") : "text-zinc-900 dark:text-zinc-100"}" data-target="${score.toFixed(1)}">
                       0.0
                     </div>
                   `
                   }
                 </div>
              </div>
              ${
                !review.isUpcoming
                  ? `
              <div title="Ваша средняя оценка" class="absolute -bottom-6 -left-6 md:-left-8 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-xl border-4 z-10 font-bold ${isSpringTop ? "bg-emerald-50 border-emerald-50 dark:bg-emerald-950 dark:border-emerald-950" : isBNM ? "bg-red-50 border-red-50 dark:bg-red-950 dark:border-red-950" : "bg-white border-white dark:bg-zinc-950 dark:border-zinc-950"} group-hover:scale-105 transition-transform duration-500 delay-75">
                 <div class="text-center">
                     <div id="user-score-display" class="text-3xl md:text-4xl tracking-tighter leading-none ${avgUserScore !== null && parseFloat(avgUserScore) >= 8.0 ? (isSpringTop ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500") : "text-zinc-500 dark:text-zinc-400"} border-b-2 border-dashed border-zinc-300 dark:border-zinc-700 pb-1 cursor-help">
                       ${avgUserScore !== null ? avgUserScore : "—"}
                     </div>
                 </div>
              </div>
              `
                  : `
              `
              }
            </div>
          </div>
        </header>

        <div class="prose prose-lg dark:prose-invert mx-auto md:mx-0 max-w-2xl font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed mb-16 ${review.isUpcoming ? "mt-12" : ""} first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
          <p>${review.text}</p>
        </div>
        
        <section class="border-t border-black dark:border-zinc-700 pt-8">
           <h3 class="text-sm font-bold uppercase tracking-wider mb-6 flex justify-between items-end dark:text-zinc-200">
             <span>${review.isSingle ? "Критерии" : "Треклист"}</span>
             <div class="flex items-center gap-4">
               ${!review.isUpcoming ? `<button class="toggle-rating-mode-btn hover:text-black dark:hover:text-white transition-colors text-xs font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 flex items-center gap-1">${ICONS.STAR} Оценить</button>` : ""}
               <span class="text-xs text-zinc-500 dark:text-zinc-400 font-normal normal-case">${review.isUpcoming ? "" : `Средняя оценка: ${score.toFixed(1)}`}</span>
             </div>
           </h3>
           <div class="flex flex-col">
             ${tracklistHtml.length ? tracklistHtml : `<div class="text-zinc-500 italic py-4">${review.isSingle ? "Критерии" : "Треклист"} пока неизвестны</div>`}
           </div>
        </section>

        ${
          criteriaHtml
            ? `
        <section class="border-t border-black dark:border-zinc-700 pt-8 mt-8">
           <h3 class="text-sm font-bold uppercase tracking-wider mb-6 flex justify-between items-end dark:text-zinc-200">
             <span>Оценки</span>
             <div class="flex items-center gap-4">
               ${!review.isUpcoming ? `<button class="toggle-rating-mode-btn hover:text-black dark:hover:text-white transition-colors text-xs font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 flex items-center gap-1">${ICONS.STAR} Оценить</button>` : ""}
             </div>
           </h3>
           <div class="flex flex-col">
             ${criteriaHtml}
           </div>
        </section>
        `
            : ""
        }

        ${prevNextHtml}

        <div class="mt-8 text-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
           <button data-compare-btn="${review.id}" onclick="window.toggleCompare(event, '${review.id}')" class="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold uppercase tracking-widest px-6 py-3 rounded-full text-xs transition-colors w-full sm:w-auto inline-flex items-center justify-center gap-2">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             <span>Сравнить</span>
           </button>
        </div>

        <footer class="mt-16 text-sm flex flex-col md:flex-row justify-between text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-8 gap-4 font-mono">
           ${review.isUpcoming || !review.reviewDate ? `<div>Оценено: TBD</div>` : `<div>Оценено: ${review.reviewDateDisplay || formatDate(review.reviewDate)}</div>`}
           ${review.releaseDate ? `<div>Релиз: ${formatDate(review.releaseDate)}</div>` : ""}
        </footer>
      </article>
    </div>
  `;

  setTimeout(() => {
    const scoreElement = document.querySelector(".score-animate");
    if (scoreElement) {
      const targetScore = parseFloat(
        scoreElement.getAttribute("data-target") || "0",
      );
      let startTimestamp = null;
      const duration = 1200; // 1.2s

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutOut = 1 - Math.pow(1 - progress, 3);
        const currentScore = easeOutOut * targetScore;

        scoreElement.textContent = currentScore.toFixed(1);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          scoreElement.textContent = targetScore.toFixed(1);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, 50);

  // Setup user ratings interaction
  const toggleBtns = document.querySelectorAll(".toggle-rating-mode-btn");
  let isRatingMode = false;
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      isRatingMode = !isRatingMode;
      const roViews = document.querySelectorAll(".rating-readonly-view");
      const editViews = document.querySelectorAll(".rating-edit-view");
      if (isRatingMode) {
        toggleBtns.forEach((b) => {
          b.classList.add(
            "bg-zinc-200",
            "dark:bg-zinc-800",
            "text-black",
            "dark:text-white",
          );
          b.classList.remove("text-zinc-400");
          b.innerHTML = `${ICONS.CHECK || ICONS.STAR} Готово`;
        });
        roViews.forEach((el) => el.classList.add("hidden"));
        editViews.forEach((el) => {
          el.classList.remove("hidden");
          el.classList.add("flex");
        });
      } else {
        toggleBtns.forEach((b) => {
          b.classList.remove(
            "bg-zinc-200",
            "dark:bg-zinc-800",
            "text-black",
            "dark:text-white",
          );
          b.classList.add("text-zinc-400");
          b.innerHTML = `${ICONS.STAR} Оценить`;
        });
        roViews.forEach((el) => el.classList.remove("hidden"));
        editViews.forEach((el) => {
          el.classList.add("hidden");
          el.classList.remove("flex");
        });
      }
    });
  });

  const rateBtns = document.querySelectorAll(".rate-btn");
  rateBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-action");
      const revId = e.target.getAttribute("data-review-id");
      const revType = e.target.getAttribute("data-type");
      const revTitle = e.target.getAttribute("data-title");

      const valDisplay =
        e.target.parentElement.querySelector(".rate-val-display");
      let currentVal =
        valDisplay.textContent === "-"
          ? null
          : parseInt(valDisplay.textContent);

      if (action === "minus") {
        if (currentVal === null) return;
        currentVal -= 1;
        if (currentVal < 0) currentVal = null;
      } else if (action === "plus") {
        if (currentVal === null)
          currentVal = 5; // Start at 5, like half score
        else currentVal += 1;
        if (currentVal > 10) currentVal = 10;
      }

      const isMinusDis = currentVal === null;
      const isPlusDis = currentVal !== null && currentVal >= 10;

      const minusBtn = e.target.parentElement.querySelector(
        '[data-action="minus"]',
      );
      const plusBtn = e.target.parentElement.querySelector(
        '[data-action="plus"]',
      );

      if (isMinusDis)
        minusBtn.classList.add("opacity-30", "pointer-events-none");
      else minusBtn.classList.remove("opacity-30", "pointer-events-none");

      if (isPlusDis) plusBtn.classList.add("opacity-30", "pointer-events-none");
      else plusBtn.classList.remove("opacity-30", "pointer-events-none");

      valDisplay.textContent = currentVal !== null ? currentVal : "-";

      const itemRow = e.target.closest(
        ".flex.items-center.justify-between.py-3",
      );
      if (itemRow) {
        const readonlyVal = itemRow.querySelector(".user-score-readonly-val");
        if (readonlyVal) {
          readonlyVal.textContent = currentVal !== null ? currentVal : "";
          if (currentVal !== null) {
            readonlyVal.classList.remove("opacity-0", "hidden");
            readonlyVal.classList.add("opacity-100");
          } else {
            readonlyVal.classList.add("opacity-0", "hidden");
            readonlyVal.classList.remove("opacity-100");
          }
        }
      }

      const allRatings = JSON.parse(
        localStorage.getItem("userRatings") || "{}",
      );
      if (!allRatings[revId]) allRatings[revId] = { tracks: {}, criteria: {} };

      if (currentVal === null) {
        delete allRatings[revId][revType][revTitle];
      } else {
        allRatings[revId][revType][revTitle] = currentVal.toString();
      }
      localStorage.setItem("userRatings", JSON.stringify(allRatings));

      // Update average real-time
      let currentSum = 0;
      let currentCount = 0;
      Object.values(allRatings[revId].tracks || {}).forEach((v) => {
        if (v !== "" && !isNaN(parseInt(v))) {
          currentSum += parseInt(v);
          currentCount++;
        }
      });
      Object.values(allRatings[revId].criteria || {}).forEach((v) => {
        if (v !== "" && !isNaN(parseInt(v))) {
          currentSum += parseInt(v);
          currentCount++;
        }
      });

      const scoreDisplay = document.getElementById("user-score-display");
      if (scoreDisplay) {
        if (currentCount > 0) {
          const avg = (currentSum / currentCount).toFixed(1);
          scoreDisplay.textContent = avg;
          if (parseFloat(avg) >= 8.0) {
            scoreDisplay.className =
              "text-3xl md:text-4xl tracking-tighter leading-none text-red-600 dark:text-red-500 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700 pb-1 cursor-help";
          } else {
            scoreDisplay.className =
              "text-3xl md:text-4xl tracking-tighter leading-none text-zinc-500 dark:text-zinc-400 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700 pb-1 cursor-help";
          }
        } else {
          scoreDisplay.textContent = "—";
          scoreDisplay.className =
            "text-3xl md:text-4xl tracking-tighter leading-none text-zinc-500 dark:text-zinc-400 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700 pb-1 cursor-help";
        }
      }
    });
  });

  const wantsToRateBtn = document.getElementById("wants-to-rate-btn");
  if (wantsToRateBtn) {
    wantsToRateBtn.addEventListener("click", () => {
      const revId = wantsToRateBtn.getAttribute("data-review-id");
      const allRatings = JSON.parse(
        localStorage.getItem("userRatings") || "{}",
      );
      if (!allRatings[revId]) allRatings[revId] = { tracks: {}, criteria: {} };

      allRatings[revId].wantsToRate = !allRatings[revId].wantsToRate;
      localStorage.setItem("userRatings", JSON.stringify(allRatings));

      if (allRatings[revId].wantsToRate) {
        wantsToRateBtn.textContent = "В заметках";
        wantsToRateBtn.className =
          "text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full border shadow-sm bg-black text-white dark:bg-white dark:text-black border-transparent hover:opacity-90 transition-all duration-300 transform active:scale-95";
      } else {
        wantsToRateBtn.textContent = "Хочу оценить";
        wantsToRateBtn.className =
          "text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full border shadow-sm bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-black dark:hover:border-white transition-all duration-300 transform active:scale-95";
      }
    });
  }
}

function renderArtist(id) {
  if (id === "various-artists") {
    window.location.hash = "/";
    return;
  }
  const artist = getArtist(id);
  if (!artist) {
    window.location.hash = "/";
    return;
  }

  const artistReviews = [
    ...reviews.filter(
      (r) => r.artistId === id || (r.artistIds && r.artistIds.includes(id)),
    ),
  ];
  const albumsList = artistReviews.filter((r) => !r.isSingle);
  const singlesList = artistReviews.filter((r) => r.isSingle);

  const scoredAlbums = albumsList.filter((r) => !r.isUpcoming);
  const totalAlbumsScore = scoredAlbums.reduce(
    (sum, r) => sum + getScore(r),
    0,
  );
  const avgAlbumsScore =
    scoredAlbums.length > 0
      ? (totalAlbumsScore / scoredAlbums.length).toFixed(1)
      : "-";

  const scoredSingles = singlesList.filter((r) => !r.isUpcoming);
  const totalSinglesScore = scoredSingles.reduce(
    (sum, r) => sum + getScore(r),
    0,
  );
  const avgSinglesScore =
    scoredSingles.length > 0
      ? (totalSinglesScore / scoredSingles.length).toFixed(1)
      : "-";

  const topAlbums = albumsList
    .filter((r) => !r.isUpcoming)
    .sort((a, b) => getScore(b) - getScore(a))
    .slice(0, 3);
  const topSingles = singlesList
    .filter((r) => !r.isUpcoming)
    .sort((a, b) => getScore(b) - getScore(a))
    .slice(0, 3);

  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");


  let latestRelease = null;
  const getCompareDate = (r) => r.reviewDate ? new Date(r.reviewDate).getTime() : new Date(r.releaseDate).getTime();
  const compareReleases = (a, b) => {
    const dateA = getCompareDate(a);
    const dateB = getCompareDate(b);
    if (dateA !== dateB) return dateB - dateA;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  };

  const upcomingReleases = artistReviews.filter(r => r.isUpcoming).sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
  const recentAlbums = albumsList.filter(r => !r.isUpcoming && (Date.now() - getCompareDate(r)) / (1000 * 60 * 60 * 24) <= 14).sort(compareReleases);
  const recentSingles = singlesList.filter(r => !r.isUpcoming && (Date.now() - getCompareDate(r)) / (1000 * 60 * 60 * 24) <= 3).sort(compareReleases);

  if (upcomingReleases.length > 0) {
      latestRelease = upcomingReleases[0];
  } else if (recentAlbums.length > 0) {
      latestRelease = recentAlbums[0];
  } else if (recentSingles.length > 0) {
      latestRelease = recentSingles[0];
  }

  let latestReleaseHtml = "";
  if (latestRelease) {
      let bannerTextLabel = latestRelease.isUpcoming ? "Оценить после релиза" : (latestRelease.isSingle ? "Посмотреть новую рецензию" : "Посмотреть новую рецензию");
      latestReleaseHtml = `
      <div class="mb-12">
        <a href="#/reviews/${latestRelease.id}" class="group flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors rounded-xl p-2 sm:p-3 w-full">
          <div class="flex items-center gap-3 min-w-0">
            <img src="${latestRelease.cover}" alt="${latestRelease.title}" class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shadow-sm flex-shrink-0" />
            <div class="flex flex-col min-w-0 pr-2">
              <div class="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
                ${bannerTextLabel}
              </div>
              <div class="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                ${latestRelease.title}
              </div>
            </div>
          </div>
          <div class="flex-shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors ml-4 mr-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </a>
      </div>
      `;
  }

  let topReleasesHtml = "";
  if (topAlbums.length > 0) {
    topReleasesHtml += `
      <section class="mb-20">
        <h2 class="text-2xl font-bold border-b-2 border-red-600 pb-2 mb-8 uppercase tracking-wider text-sm inline-block text-zinc-900 dark:text-zinc-50">Лучшие альбомы / EP</h2>
        <div class="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-8">
          ${topAlbums
            .map(
              (review, idx) => `
            <a href="#/reviews/${review.id}" class="group flex flex-col items-center text-center">
               <div class="relative w-full aspect-square mb-2 sm:mb-4 bg-zinc-100 dark:bg-zinc-900 shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden rounded-lg">
                  <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div class="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white dark:bg-zinc-900 dark:text-white dark:ring-1 dark:ring-white/10 w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-[10px] sm:text-lg shadow-md group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                    ${getScore(review).toFixed(1)}
                  </div>
                  ${
                    idx === 0
                      ? `
                    <div class="absolute bottom-0 left-0 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest">
                      #1 В РЕЙТИНГЕ
                    </div>
                  `
                      : ""
                  }
               </div>
               <h3 class="font-serif font-bold text-xs sm:text-xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                 ${review.title}
               </h3>
            </a>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  if (topSingles.length > 0) {
    topReleasesHtml += `
      <section class="mb-20">
        <h2 class="text-2xl font-bold border-b-2 border-red-600 pb-2 mb-8 uppercase tracking-wider text-sm inline-block text-zinc-900 dark:text-zinc-50">Лучшие синглы</h2>
        <div class="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-8">
          ${topSingles
            .map(
              (review, idx) => `
            <a href="#/reviews/${review.id}" class="group flex flex-col items-center text-center">
               <div class="relative w-full aspect-square mb-2 sm:mb-4 bg-zinc-100 dark:bg-zinc-900 shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden rounded-lg">
                  <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div class="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white dark:bg-zinc-900 dark:text-white dark:ring-1 dark:ring-white/10 w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-[10px] sm:text-lg shadow-md group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                    ${getScore(review).toFixed(1)}
                  </div>
                  ${
                    idx === 0
                      ? `
                    <div class="absolute bottom-0 left-0 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest">
                      #1 В РЕЙТИНГЕ
                    </div>
                  `
                      : ""
                  }
               </div>
               <h3 class="font-serif font-bold text-xs sm:text-xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                 ${review.title}
               </h3>
            </a>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  const renderDiscographyList = (sortMode, listToRender) => {
    const list = [...listToRender];
    if (sortMode === "score") {
      list.sort((a, b) => getScore(b) - getScore(a));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
      );
    }

    return list
      .map((review) => {
        const score = getScore(review);
        const isHigh = score >= 8.2;
        return `
        <a href="#/reviews/${review.id}" class="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-6 px-4 -mx-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.01]">
          <div class="w-20 h-20 sm:w-24 sm:h-24 relative bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mr-6 overflow-hidden shadow-sm dark:ring-1 dark:ring-white/10 rounded-lg group-hover:shadow-md transition-shadow">
            <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ${review.isCancelled ? `<div class="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.5 text-center uppercase tracking-widest z-20">Отменен</div>` : review.isUpcoming ? `<div class="absolute bottom-0 left-0 right-0 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-bold px-1 py-0.5 text-center uppercase tracking-widest z-20">Скоро</div>` : ""}
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="font-serif font-bold text-xl sm:text-2xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-1 break-words">
              ${review.title}
            </h3>
            <div class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-mono truncate">
              ${new Date(review.releaseDate).getFullYear()} • ${review.label}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 text-center">
            <div class="text-2xl sm:text-3xl font-bold tracking-tighter w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 transition-colors ${isHigh ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500" : "border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"}">
              ${review.isUpcoming ? "?" : score.toFixed(1)}
            </div>
          </div>
        </a>
      `;
      })
      .join("");
  };

  app.innerHTML = `
    <div class="animate-slide-up pb-16">
      <div class="w-full max-w-5xl mx-auto aspect-video md:aspect-[21/9] bg-zinc-200 dark:bg-black relative z-0 md:mt-4 md:rounded-t-3xl overflow-hidden shadow-inner" style="${artist.banner ? `background-image: url('${artist.banner}'); background-size: cover; background-position: center;` : ""}">
         <button class="back-button absolute top-4 left-4 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all font-bold text-xs uppercase tracking-widest z-20">
           ${ICONS.ARROW_LEFT} Назад
         </button>
      </div>
      
      <div class="max-w-5xl mx-auto px-4 relative z-10">
      <header class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 lg:gap-12 mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <!-- Левая колонка (Аватар и Рейтинг на ПК) -->
        <div class="flex flex-col items-center flex-shrink-0 -mt-16 md:-mt-20 lg:-mt-24">
          <div class="w-36 h-36 md:w-48 lg:w-56 md:h-48 lg:h-56 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border-4 md:border-8 border-white dark:border-zinc-950 shadow-xl group relative">
            <img src="${artist.photo}" alt="${artist.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          
          ${
            getArtistValue(id) > 0
              ? `
          <div class="mt-8 hidden md:flex flex-col items-center w-full" title="Рейтинг артиста отражает как средние оценки, так и ценность дискографии.">
            <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-[10px] lg:text-xs mb-3 text-center">Рейтинг артиста</p>
            <div class="text-4xl lg:text-5xl font-bold tracking-tighter w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-full border-4 shadow-xl hover:scale-110 hover:-rotate-6 transition-all duration-500 cursor-help ${getArtistValue(id) >= 8.0 ? 'border-red-50 bg-red-50 text-red-600 dark:border-red-950 dark:bg-red-950 dark:text-red-500' : 'border-zinc-100 bg-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100'}">
              ${getArtistValue(id).toFixed(1)}
            </div>
          </div>
          `
              : ""
          }
        </div>

        <!-- Правая колонка (Инфо и Статы) -->
        <div class="text-center md:text-left flex-grow min-w-0 md:mt-4 w-full">
          <h1 class="font-serif font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 md:mb-8 cursor-help drop-shadow-sm truncate" title="Ценность дискографии (без округления): ${getArtistValue(id).toFixed(3)}">
            ${artist.name}
          </h1>
          
          <div class="flex flex-col items-center md:items-start gap-8">
            <button id="subscribe-btn" data-artist-id="${artist.id}" class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-zinc-200 transition-colors shadow-md active:scale-95 flex items-center gap-2 relative flex-shrink-0">
              <!-- text set in updateSubscribeButton -->
              <span></span>
            </button>
            
            <div class="flex flex-col gap-3 w-full max-w-md">
              ${
                scoredAlbums.length > 0
                  ? `
              <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50 pb-3">
                <p class="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-bold text-xs sm:text-sm flex items-center gap-2">
                  ${ICONS.DISC} <span class="hidden sm:inline">Оцененных </span>Альбомов <span class="ml-1 text-zinc-900 dark:text-white">${scoredAlbums.length}</span>
                </p>
                <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-xs bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                  СР. ОЦЕНКА: <span class="${avgAlbumsScore >= 8.0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}">${avgAlbumsScore}</span>
                </p>
              </div>
              `
                  : ""
              }
              ${
                scoredSingles.length > 0
                  ? `
              <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50 pb-3">
                <p class="text-zinc-600 dark:text-zinc-400 uppercase tracking-widest font-bold text-xs sm:text-sm flex items-center gap-2">
                  ${ICONS.DISC3} <span class="hidden sm:inline">Оцененных </span>Синглов <span class="ml-1 text-zinc-900 dark:text-white">${scoredSingles.length}</span>
                </p>
                <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-xs bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                  СР. ОЦЕНКА: <span class="${avgSinglesScore >= 8.0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}">${avgSinglesScore}</span>
                </p>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Мобильный рейтинг (скрыт на ПК) -->
            ${
              getArtistValue(id) > 0
                ? `
            <div class="mt-2 md:hidden flex flex-col items-center w-full" title="Рейтинг артиста">
              <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-[10px] mb-3 text-center">Рейтинг артиста</p>
              <div class="text-4xl font-bold tracking-tighter w-20 h-20 flex items-center justify-center rounded-full border-4 shadow-xl hover:scale-110 hover:-rotate-6 transition-all duration-500 cursor-help ${getArtistValue(id) >= 8.0 ? 'border-red-50 bg-red-50 text-red-600 dark:border-red-950 dark:bg-red-950 dark:text-red-500' : 'border-zinc-100 bg-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100'}">
                ${getArtistValue(id).toFixed(1)}
              </div>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </header>

      
      ${latestReleaseHtml}
      ${topReleasesHtml}


      <section>
        <div class="flex flex-col sm:flex-row justify-between sm:items-end border-b border-black dark:border-zinc-700 pb-2 mb-8 gap-4">
          <h2 class="text-2xl font-bold uppercase tracking-wider text-sm text-zinc-900 dark:text-zinc-50 m-0 leading-none">Альбомы / EP</h2>
          <div class="flex gap-4 text-xs font-bold uppercase tracking-widest">
            <button id="sort-date-albums" class="text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5">По дате</button>
            <button id="sort-score-albums" class="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5">По оценке</button>
          </div>
        </div>
        <div id="discography-list-albums" class="flex flex-col">
          ${renderDiscographyList("date", albumsList)}
        </div>
      </section>

      ${
        singlesList.length > 0
          ? `
      <section class="mt-16">
        <div class="flex flex-col sm:flex-row justify-between sm:items-end border-b border-black dark:border-zinc-700 pb-2 mb-8 gap-4">
          <h2 class="text-2xl font-bold uppercase tracking-wider text-sm text-zinc-900 dark:text-zinc-50 m-0 leading-none">Синглы</h2>
          <div class="flex gap-4 text-xs font-bold uppercase tracking-widest">
            <button id="sort-date-singles" class="text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5">По дате</button>
            <button id="sort-score-singles" class="text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5">По оценке</button>
          </div>
        </div>
        <div id="discography-list-singles" class="flex flex-col">
          ${renderDiscographyList("date", singlesList)}
        </div>
      </section>
      `
          : ""
      }
    </div>
  `;

  setTimeout(() => {
    const subscribeBtn = document.getElementById("subscribe-btn");
    if (subscribeBtn) {
      const updateButtonState = () => {
        const subs = JSON.parse(localStorage.getItem("subscribedArtists") || "[]");
        const isSubbed = subs.includes(artist.id);
        const span = subscribeBtn.querySelector("span");
        if (isSubbed) {
          span.innerText = "Подписка оформлена";
          subscribeBtn.classList.remove("bg-zinc-900", "dark:bg-white", "text-white", "dark:text-zinc-900");
          subscribeBtn.classList.add("bg-red-100", "text-red-600", "dark:bg-red-950", "dark:text-red-400");
        } else {
          span.innerText = "Подписаться";
          subscribeBtn.classList.add("bg-zinc-900", "dark:bg-white", "text-white", "dark:text-zinc-900");
          subscribeBtn.classList.remove("bg-red-100", "text-red-600", "dark:bg-red-950", "dark:text-red-400");
        }
      };
      
      updateButtonState();
      
      subscribeBtn.addEventListener("click", () => {
        let subs = JSON.parse(localStorage.getItem("subscribedArtists") || "[]");
        if (subs.includes(artist.id)) {
          subs = subs.filter(id => id !== artist.id);
        } else {
          subs.push(artist.id);
        }
        localStorage.setItem("subscribedArtists", JSON.stringify(subs));
        updateButtonState();
      });
    }

    const btnDateAlbums = document.getElementById("sort-date-albums");
    const btnScoreAlbums = document.getElementById("sort-score-albums");
    const listAlbums = document.getElementById("discography-list-albums");

    if (btnDateAlbums && btnScoreAlbums && listAlbums) {
      btnDateAlbums.addEventListener("click", () => {
        btnDateAlbums.className =
          "text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5";
        btnScoreAlbums.className =
          "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5";
        listAlbums.innerHTML = renderDiscographyList("date", albumsList);
      });
      btnScoreAlbums.addEventListener("click", () => {
        btnScoreAlbums.className =
          "text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5";
        btnDateAlbums.className =
          "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5";
        listAlbums.innerHTML = renderDiscographyList("score", albumsList);
      });
    }

    const btnDateSingles = document.getElementById("sort-date-singles");
    const btnScoreSingles = document.getElementById("sort-score-singles");
    const listSingles = document.getElementById("discography-list-singles");

    if (btnDateSingles && btnScoreSingles && listSingles) {
      btnDateSingles.addEventListener("click", () => {
        btnDateSingles.className =
          "text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5";
        btnScoreSingles.className =
          "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5";
        listSingles.innerHTML = renderDiscographyList("date", singlesList);
      });
      btnScoreSingles.addEventListener("click", () => {
        btnScoreSingles.className =
          "text-zinc-900 border-b-2 border-black dark:text-white dark:border-white transition-colors pb-0.5";
        btnDateSingles.className =
          "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors border-b-2 border-transparent pb-0.5";
        listSingles.innerHTML = renderDiscographyList("score", singlesList);
      });
    }
  }, 0);
}

function renderBNM() {
  const bnmReviews = [...reviews]
    .filter((r) => {
      const score = getScore(r);
      return !r.isSingle && score >= 8.2 && !r.noAwards;
    })
    .sort((a, b) => {
      const diff =
        new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      return diff !== 0
        ? diff
        : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

  let listHtml = bnmReviews
    .map((review) => {
      const artist = getArtist(review.artistId);
      const score = getScore(review);
      return `
      <a href="#/reviews/${review.id}" class="group flex flex-col md:flex-row items-center border-b border-zinc-200 dark:border-zinc-800 py-8 px-4 -mx-4 rounded-xl hover:bg-[#fffcfc] dark:hover:bg-[#1a1414] transition-all duration-500 hover:scale-[1.02]">
        <div class="w-full md:w-48 h-48 md:h-48 flex-shrink-0 mb-6 md:mb-0 md:mr-8 overflow-hidden shadow-lg group-hover:shadow-red-500/20 dark:ring-1 dark:ring-white/10 rounded-lg transition-all duration-500 relative">
          <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <div class="flex-grow min-w-0 text-center md:text-left w-full">
          <div class="text-xs text-red-600 dark:text-red-500 uppercase tracking-[0.2em] font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
            ${ICONS.STAR} BEST NEW MUSIC
          </div>
          <h3 class="font-serif font-black text-3xl sm:text-4xl leading-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-2 break-words">
            ${review.title}
          </h3>
          <h4 class="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-4 font-medium uppercase tracking-wide">
            ${artist?.name}
          </h4>
          <p class="text-zinc-700 dark:text-zinc-300 line-clamp-2 text-sm sm:text-base leading-relaxed max-w-2xl">
            ${review.text}
          </p>
        </div>
        <div class="mt-6 md:mt-0 md:ml-8 flex-shrink-0 text-center">
          <div class="text-4xl sm:text-5xl font-bold tracking-tighter w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-4 border-red-50 bg-red-50 text-red-600 dark:border-red-950 dark:bg-red-950 dark:text-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
            ${score.toFixed(1)}
          </div>
        </div>
      </a>
    `;
    })
    .join("");

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-16 animate-slide-up">
      <header class="text-center mb-20">
        <div class="inline-flex items-center justify-center space-x-4 mb-6">
          <div class="h-px w-12 bg-red-600 dark:bg-red-500"></div>
          <span class="text-red-600 dark:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <div class="h-px w-12 bg-red-600 dark:bg-red-500"></div>
        </div>
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 uppercase">
          Лучшая Новая Музыка
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-serif italic">
          Самые выдающиеся релизы (альбомы и EP), получившие оценку 8.2 и выше. Тщательно отобранная коллекция музыки, которая формирует индустрию.
        </p>
      </header>

      <div class="flex flex-col gap-4">
        ${listHtml}
      </div>
    </div>
  `;
}

function renderBNT() {
  const bntReviews = [...reviews]
    .filter((r) => {
      const score = getScore(r);
      return r.isSingle && score >= 9.2 && !r.noAwards;
    })
    .sort((a, b) => {
      const diff =
        new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      return diff !== 0
        ? diff
        : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

  let listHtml = bntReviews
    .map((review) => {
      const artist = getArtist(review.artistId);
      const score = getScore(review);
      return `
      <a href="#/reviews/${review.id}" class="group flex flex-col md:flex-row items-center border-b border-zinc-200 dark:border-zinc-800 py-8 px-4 -mx-4 rounded-xl hover:bg-[#fffcfc] dark:hover:bg-[#1a1414] transition-all duration-500 hover:scale-[1.02]">
        <div class="w-full md:w-48 h-48 md:h-48 flex-shrink-0 mb-6 md:mb-0 md:mr-8 overflow-hidden shadow-lg group-hover:shadow-red-500/20 dark:ring-1 dark:ring-white/10 rounded-lg transition-all duration-500 relative">
          <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <div class="flex-grow min-w-0 text-center md:text-left w-full">
          <div class="text-xs text-red-600 dark:text-red-500 uppercase tracking-[0.2em] font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
            ${ICONS.STAR} BEST NEW TRACK
          </div>
          <h3 class="font-serif font-black text-3xl sm:text-4xl leading-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-2 break-words">
            ${review.title}
          </h3>
          <h4 class="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-4 font-medium uppercase tracking-wide">
            ${artist?.name}
          </h4>
          <p class="text-zinc-700 dark:text-zinc-300 line-clamp-2 text-sm sm:text-base leading-relaxed max-w-2xl">
            ${review.text}
          </p>
        </div>
        <div class="mt-6 md:mt-0 md:ml-8 flex-shrink-0 text-center">
          <div class="text-4xl sm:text-5xl font-bold tracking-tighter w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-4 border-red-50 bg-red-50 text-red-600 dark:border-red-950 dark:bg-red-950 dark:text-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
            ${score.toFixed(1)}
          </div>
        </div>
      </a>
    `;
    })
    .join("");

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-16 animate-slide-up">
      <header class="text-center mb-20">
        <div class="inline-flex items-center justify-center space-x-4 mb-6">
          <div class="h-px w-12 bg-red-600 dark:bg-red-500"></div>
          <span class="text-red-600 dark:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <div class="h-px w-12 bg-red-600 dark:bg-red-500"></div>
        </div>
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 uppercase">
          Лучший Новый Трек
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-serif italic">
          Самые выдающиеся синглы, получившие оценку 9.2 и выше. Тщательно отобранная коллекция.
        </p>
      </header>

      <div class="flex flex-col gap-4">
        ${listHtml}
      </div>
    </div>
  `;
}

function renderHall() {
  const hallReviews = [...reviews]
    .filter((r) => {
      const criteriaList = r.isSingle ? r.singleCriteria : r.criteria;
      if (!criteriaList) return false;
      const viz = criteriaList.find((c) => c.title.toLowerCase() === "визуал");
      return viz && viz.score === 10;
    })
    .sort((a, b) => {
      return (
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    });

  let listHtml = hallReviews
    .map((review, index) => {
      const artist = getArtist(review.artistId);
      const score = getScore(review);
      const delay = index * 100;
      return `
      <a href="#/reviews/${review.id}" onclick="window.animateDive(event, this, '#/reviews/${review.id}')" class="group flex flex-col h-full relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.97] active:shadow-inner transition-all duration-500 md:duration-700 md:hover:-translate-y-2 md:hover:scale-[1.02] animate-slide-up focus:outline-none" style="animation-duration: 0.8s; animation-delay: ${Math.min(delay, 500)}ms; animation-fill-mode: both; -webkit-tap-highlight-color: transparent;">
        <div class="aspect-square w-full overflow-hidden relative border-b border-zinc-200 dark:border-zinc-800 shrink-0 p-6 sm:p-8 bg-zinc-50 dark:bg-[#111] flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent opacity-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
          <div class="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent mobile-shimmer-anim z-20 pointer-events-none" style="animation-delay: ${Math.min(delay, 800)}ms;"></div>
          <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover rounded shadow-md group-active:scale-[1.03] md:group-hover:scale-110 md:group-hover:rotate-1 transition-transform duration-500 md:duration-1000 ease-out ring-1 ring-black/5 dark:ring-white/10 mobile-pan-anim" style="animation-delay: ${Math.min(delay, 500)}ms;" />
        </div>
        <div class="p-6 sm:p-8 flex flex-col items-center text-center flex-grow relative z-20">
            <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-500 mb-3 md:group-hover:text-red-500 dark:md:group-hover:text-red-400 transition-colors">
              Визуал — 10
            </h4>
            <h3 class="font-serif font-black text-2xl sm:text-3xl leading-tight text-zinc-900 dark:text-zinc-50 mb-2 break-words line-clamp-2 md:group-hover:text-red-600 dark:md:group-hover:text-red-500 transition-colors" title="${review.title}">
              ${review.title}
            </h3>
            <div class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-6 truncate w-full" title="${artist?.name}">
              ${artist?.name}
            </div>
            <div class="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 w-full text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium md:group-hover:border-red-200 dark:md:group-hover:border-red-900/50 transition-colors">
               Общая оценка: <span class="text-zinc-900 dark:text-white font-bold ml-1">${score.toFixed(1)}</span>
            </div>
        </div>
      </a>
      `;
    })
    .join("");

  if (hallReviews.length === 0) {
    listHtml = `<div class="col-span-full text-center text-zinc-500 font-serif italic text-lg py-16">В зале пока нет экспонатов.</div>`;
  }

  app.innerHTML = `
    <style>
      @keyframes mobilePan {
        0% { transform: scale(1) translateY(0); }
        100% { transform: scale(1.05) translateY(-2%); }
      }
      @keyframes mobileShimmer {
        0% { transform: translateX(-150%) skewX(-15deg); }
        50%, 100% { transform: translateX(250%) skewX(-15deg); }
      }
      .mobile-pan-anim { animation: mobilePan 6s ease-in-out infinite alternate; }
      .mobile-shimmer-anim { animation: mobileShimmer 4s infinite linear; }
      @media (min-width: 768px) {
        .mobile-pan-anim { animation: none !important; }
        .mobile-shimmer-anim { display: none !important; }
      }
    </style>
    <div class="max-w-7xl mx-auto px-4 py-16 animate-slide-up">
      <header class="text-center mb-16 md:mb-24 relative">
        <div class="inline-block relative">
           <h1 class="font-serif font-black text-5xl md:text-7xl xl:text-8xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 uppercase relative z-10">
             Зал Визуала
           </h1>
           <div class="absolute -inset-4 bg-red-100 dark:bg-red-900/30 blur-3xl -z-10 rounded-full opacity-50"></div>
        </div>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-serif italic">
          Галерея релизов, чьё визуальное оформление достигло абсолютного идеала. 10 из 10.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        ${listHtml}
      </div>
    </div>
  `;
}


function getTiers(arr, getVal) {
  const total = arr.length;
  const tiers = { "S+": [], S: [], A: [], B: [], C: [], D: [] };
  if (total === 0) return tiers;
  
  const p1 = Math.round(total * 0.05);
  const p2 = Math.round(total * 0.15);
  const p3 = Math.round(total * 0.35);
  const p4 = Math.round(total * 0.65);
  const p5 = Math.round(total * 0.85);

  const getInitialTier = (idx) => {
    if (idx < p1) return "S+";
    if (idx < p2) return "S";
    if (idx < p3) return "A";
    if (idx < p4) return "B";
    if (idx < p5) return "C";
    return "D";
  };

  let currentTier = getInitialTier(0);
  let previousVal = getVal(arr[0]);

  for (let i = 0; i < total; i++) {
      const val = getVal(arr[i]);
      const initialTier = getInitialTier(i);
      
      if (val !== previousVal) {
           currentTier = initialTier;
      }
      
      tiers[currentTier].push(arr[i]);
      previousVal = val;
  }
  
  return tiers;
}

function renderTiers() {
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() + THREE_DAYS;

  const oldReviews = reviews.filter((r) => r.reviewDate && new Date(r.reviewDate).getTime() <= cutoff);

  const scoredAlbums = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));

  const scoredSingles = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));

  const activeArtists = [...artists]
    .filter((a) => !a.isGlobal && a.id !== "various-artists" && getArtistValue(a.id) > 0)
    .sort((a, b) => getArtistValue(b.id) - getArtistValue(a.id));

  const oldAlbumsList = oldReviews
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b, true) - getScore(a, true));
  
  const oldAlbumsMap = {};
  oldAlbumsList.forEach((r, idx) => (oldAlbumsMap[r.id] = idx + 1));

  const oldSinglesList = oldReviews
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b, true) - getScore(a, true));

  const oldSinglesMap = {};
  oldSinglesList.forEach((r, idx) => (oldSinglesMap[r.id] = idx + 1));

  const oldArtistsList = [...artists]
    .filter((a) => {
      if (a.id === "various-artists") return false;
      if (a.isGlobal) return false;
      return getArtistValue(a.id, oldReviews, true) > 0;
    })
    .sort((a, b) => getArtistValue(b.id, oldReviews, true) - getArtistValue(a.id, oldReviews, true));

  const oldArtistsMap = {};
  oldArtistsList.forEach((a, idx) => (oldArtistsMap[a.id] = idx + 1));

  const oldAlbumTiers = getTiers(oldAlbumsList, r => getScore(r, true));
  const oldSingleTiers = getTiers(oldSinglesList, r => getScore(r, true));
  const oldArtistTiers = getTiers(oldArtistsList, a => getArtistValue(a.id, oldReviews, true));

  const createOldTiersMap = (tierObj) => {
    const map = {};
    Object.entries(tierObj).forEach(([tier, items]) => {
      items.forEach(item => {
        map[item.id] = tier;
      });
    });
    return map;
  };

  const oldAlbumTiersMap = createOldTiersMap(oldAlbumTiers);
  const oldSingleTiersMap = createOldTiersMap(oldSingleTiers);
  const oldArtistTiersMap = createOldTiersMap(oldArtistTiers);


  const albumTiers = getTiers(scoredAlbums, getScore);
  const singleTiers = getTiers(scoredSingles, getScore);
  const artistTiers = getTiers(activeArtists, a => getArtistValue(a.id));

  const colors = {
    "S+": "bg-red-700 text-white dark:bg-red-800",
    "S": "bg-red-600 text-white dark:bg-red-700",
    "A": "bg-red-500 text-white dark:bg-red-600",
    "B": "bg-red-400 text-white dark:bg-red-500",
    "C": "bg-red-300 text-zinc-900 dark:bg-red-400 dark:text-zinc-900",
    "D": "bg-red-200 text-zinc-900 dark:bg-red-300 dark:text-zinc-900"
  };

  const renderTierGroupSection = (title, tiersMap, allSortedItems, oldRanksMap, oldTiersMap, isArtistLine=false) => {
    const tierLevels = { "S+": 6, "S": 5, "A": 4, "B": 3, "C": 2, "D": 1 };
    let rows = "";
    Object.entries(tiersMap).forEach(([tierName, items]) => {
      if (items.length === 0) return;
      const colorClass = colors[tierName];
      const itemsHtml = items.map((item, idx) => {
        const _id = item.id;
        const currentRank = allSortedItems.findIndex(x => x.id === _id) + 1;
        const oldRank = oldRanksMap[_id];
        const oldTier = oldTiersMap[_id];

        let indicator = "";
        if (oldRank) {
          let rose = false;
          let fell = false;

          if (oldTier && tierLevels[tierName] > tierLevels[oldTier]) {
            rose = true;
          } else if (oldTier && tierLevels[tierName] < tierLevels[oldTier]) {
            fell = true;
          }

          if (rose) {
            indicator = `<div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white rounded-full p-0.5 sm:p-1 shadow-sm border-2 border-white dark:border-zinc-900 z-10" title="Поднялся">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
                             <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                           </svg>
                         </div>`;
          } else if (fell) {
            indicator = `<div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 shadow-sm border-2 border-white dark:border-zinc-900 z-10" title="Упал">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
                             <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                           </svg>
                         </div>`;
          }
        } else {
          indicator = `<div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 text-black rounded-full p-0.5 sm:p-1 shadow-sm border-2 border-white dark:border-zinc-900 z-10" title="Новинка">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 sm:h-3 sm:w-3" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                         </svg>
                       </div>`;
        }

        let warningBadge = "";
        if (tierName !== "D" && items.length > 2 && idx === items.length - 1) {
          warningBadge = `<div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-yellow-500 bg-white dark:bg-zinc-900 rounded-full shadow-sm z-10 border-2 border-white dark:border-zinc-900" title="На грани вылета из тира">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                              <path d="M12 9v4"/>
                              <path d="M12 17h.01"/>
                            </svg>
                          </div>`;
        }

        if (isArtistLine) {
          const img = item.photo || item.banner || "https://i.postimg.cc/FKxyCBhy/IMG-20260508-160333-769.jpg";
          return `<a href="#/artists/${_id}" class="group relative w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0" title="${item.name} - ${parseFloat(getArtistValue(item.id).toFixed(1))}">` +
                 indicator + warningBadge +
                 `<img src="${img}" class="w-full h-full object-cover rounded-full border-2 border-transparent group-hover:border-red-500 transition-all shadow-sm" />` +
                 `</a>`;
        } else {
          const img = item.cover;
          return `<a href="#/reviews/${_id}" class="group relative w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0" title="${item.title} - ${parseFloat(getScore(item).toFixed(1))}">` +
                 indicator + warningBadge +
                 `<img src="${img}" class="w-full h-full object-cover rounded-md sm:rounded-lg border border-zinc-200 dark:border-zinc-800 group-hover:border-red-500 transition-all shadow-sm" />` +
                 `</a>`;
        }
      }).join("");

      rows += `
        <div class="flex flex-row mb-2 sm:mb-3 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-[#111] shadow-sm transform transition-all hover:shadow-md">
          <div class="${colorClass} p-2 w-16 sm:w-24 md:w-28 flex items-center justify-center font-serif font-black text-xl sm:text-3xl md:text-4xl tracking-tighter shrink-0 border-r border-black/10 dark:border-white/10">
            ${tierName}
          </div>
          <div class="p-2 sm:p-4 md:p-6 flex flex-wrap gap-2 sm:gap-3 md:gap-4 items-center w-full bg-zinc-50 dark:bg-[#111]">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    return `
      <div class="mb-20">
        <h2 class="text-3xl md:text-4xl font-serif font-black mb-8 uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 border-b border-black dark:border-zinc-700 pb-4">${title}</h2>
        ${rows}
      </div>
    `;

  };

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-12 md:py-16 animate-slide-up">
      <header class="text-center mb-16 relative">
        <h1 class="font-serif font-black text-5xl md:text-6xl tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase mb-4">Тир-листы</h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed">Все релизы и артисты распределены по тирам на основе своих итоговых баллов и успешности.</p>
      </header>
      ${renderTierGroupSection("Альбомы", albumTiers, scoredAlbums, oldAlbumsMap, oldAlbumTiersMap)}
      ${renderTierGroupSection("Синглы", singleTiers, scoredSingles, oldSinglesMap, oldSingleTiersMap)}
      ${renderTierGroupSection("Артисты", artistTiers, activeArtists, oldArtistsMap, oldArtistTiersMap, true)}
    </div>
  `;
}

function renderTop() {
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() + THREE_DAYS;

  const oldReviews = reviews.filter((r) => r.reviewDate && new Date(r.reviewDate).getTime() <= cutoff);

  const oldAlbumsMap = {};
  oldReviews
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b, true) - getScore(a, true))
    .forEach((r, idx) => (oldAlbumsMap[r.id] = idx + 1));

  const oldSinglesMap = {};
  oldReviews
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b, true) - getScore(a, true))
    .forEach((r, idx) => (oldSinglesMap[r.id] = idx + 1));

  const oldArtistsMap = {};
  [...artists]
    .filter((a) => {
      if (a.id === "various-artists") return false;
      if (a.isGlobal) return false;
      return getArtistValue(a.id, oldReviews, true) > 0;
    })
    .sort((a, b) => getArtistValue(b.id, oldReviews, true) - getArtistValue(a.id, oldReviews, true))
    .forEach((a, idx) => (oldArtistsMap[a.id] = idx + 1));

  const scoredAlbums = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));

  const scoredSingles = [...reviews]
    .filter((r) => {
      if (r.isUpcoming) return false;
      if (!r.isSingle) return false;
      if (r.noTop) return false;
      const artist = getArtist(r.artistId);
      if (artist && artist.isGlobal) return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));

  const scoredArtists = [...artists]
    .filter((a) => {
      if (a.id === "various-artists") return false;
      if (a.isGlobal) return false;
      const val = getArtistValue(a.id);
      return val > 0;
    })
    .sort((a, b) => getArtistValue(b.id) - getArtistValue(a.id));

  const renderTopList = (listToRender, oldRanksMap) => {
    return listToRender
      .map((review, idx) => {
        const score = getScore(review);
        const artist = getArtist(review.artistId);
        const rank = idx + 1;
        const oldRank = oldRanksMap[review.id];
        
        let indicator = "";
        if (!oldRank) {
          indicator = `<div class="text-[9px] font-bold text-yellow-500 uppercase tracking-widest mt-1.5 flex items-center justify-center">NEW</div>`;
        } else if (rank < oldRank) {
          indicator = `<div class="text-emerald-500 font-bold flex items-center justify-center mt-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg><span class="text-xs ml-0.5">${oldRank - rank}</span></div>`;
        } else if (rank > oldRank) {
          indicator = `<div class="text-rose-500 font-bold flex items-center justify-center mt-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg><span class="text-xs ml-0.5">${rank - oldRank}</span></div>`;
        } else {
          indicator = `<div class="text-zinc-300 dark:text-zinc-700 font-bold flex items-center justify-center mt-1.5"><span class="w-3 h-0.5 bg-current rounded-full"></span></div>`;
        }

        return `
        <a href="#/reviews/${review.id}" class="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-5 px-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300">
          <div class="w-16 flex-shrink-0 flex flex-col items-center justify-center mr-2 md:mr-4">
            <div class="font-serif italic text-3xl text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors leading-none">
              ${rank}
            </div>
            ${indicator}
          </div>
          <div class="w-16 h-16 sm:w-20 sm:h-20 relative bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mr-4 overflow-hidden shadow-sm dark:ring-1 dark:ring-white/10 rounded-lg">
            <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="font-serif font-bold text-lg sm:text-xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-0.5 truncate">
              ${review.title}
            </h3>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              ${artist?.name}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 text-center">
            <div class="text-xl sm:text-2xl font-bold tracking-tighter w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 transition-colors ${score >= 8.0 ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500" : "border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"}">
              ${score.toFixed(1)}
            </div>
          </div>
        </a>
      `;
      })
      .join("");
  };

  const renderTopArtistsList = (listToRender, oldRanksMap) => {
    const listHtml = listToRender
      .map((artist, idx) => {
        const val = getArtistValue(artist.id);
        const rank = idx + 1;
        const oldRank = oldRanksMap[artist.id];

        let indicator = "";
        if (!oldRank) {
          indicator = `<div class="text-[9px] font-bold text-yellow-500 uppercase tracking-widest mt-1.5 flex items-center justify-center">NEW</div>`;
        } else if (rank < oldRank) {
          indicator = `<div class="text-emerald-500 font-bold flex items-center justify-center mt-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg><span class="text-xs ml-0.5">${oldRank - rank}</span></div>`;
        } else if (rank > oldRank) {
          indicator = `<div class="text-rose-500 font-bold flex items-center justify-center mt-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg><span class="text-xs ml-0.5">${rank - oldRank}</span></div>`;
        } else {
          indicator = `<div class="text-zinc-300 dark:text-zinc-700 font-bold flex items-center justify-center mt-1.5"><span class="w-3 h-0.5 bg-current rounded-full"></span></div>`;
        }

        return `
        <a href="#/artists/${artist.id}" class="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-5 px-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300">
          <div class="w-16 flex-shrink-0 flex flex-col items-center justify-center mr-2 md:mr-4">
            <div class="font-serif italic text-3xl text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors leading-none">
              ${rank}
            </div>
            ${indicator}
          </div>
          <div class="w-16 h-16 sm:w-20 sm:h-20 relative bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mr-4 overflow-hidden shadow-sm rounded-full">
            <img src="${artist.photo}" alt="${artist.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="font-serif font-bold text-lg sm:text-xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-0.5 truncate">
              ${artist.name}
            </h3>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              Ценность дискографии (вместе с оценкой): ${val.toFixed(2)}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 text-center flex items-center gap-2">
            <div class="text-xl sm:text-2xl font-bold tracking-tighter w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 transition-colors ${val >= 8.0 ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500" : "border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"}">
              ${val.toFixed(1)}
            </div>
          </div>
        </a>
      `;
      })
      .join("");

    return (
      listHtml +
      `
      <div class="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
        <h4 class="font-bold mb-2 text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Как формируется рейтинг артистов?</h4>
        <p class="leading-relaxed space-y-2">
          Оценка — это гибрид <strong>среднего балла</strong> и <strong>ценности дискографии</strong>.<br><br>
          1. <strong>Вес релизов:</strong> Альбомы сильно масштабнее синглов, поэтому они "весят" в 5 раз больше, чем синглы.<br>
          2. <strong>Базовая оценка:</strong> Чтобы 1 релиз на 10.0 не выводил артиста в топ-1, применяется "сглаживание". Мы смешиваем оценки с базовыми 7.5 баллами. Чем больше релизов, тем быстрее влияние старта исчезает.<br>
          3. <strong>Бонус за объем:</strong> Если средняя оценка артиста выше 7.0, за каждый релиз начисляется бонус. Бонус зависит от качества: чем выше средний балл (на пути от 7.0 к 10.0), тем большую долю бонуса получает артист. Итоговая цифра никогда не превысит 10.0.<br><br>
          <em>Именно поэтому артист с 3 крепкими альбомами может обогнать артиста с 10 синглами: объем и вес дискографии играют ключевую роль.</em>
        </p>
      </div>
    `
    );
  };

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-12 md:py-16 animate-slide-up">
      <header class="text-center mb-16">
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 uppercase">
          Топ HueFork
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-serif italic mb-6">
          Рейтинг лучших релизов по версии платформы
        </p>
        <div class="mb-12">
          <a href="#/tiers" class="inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white text-black dark:text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
             Тир-листы
          </a>
        </div>
        <div class="flex justify-center gap-4 text-sm font-bold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800">
          <button id="tab-albums" class="text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors">Альбомы</button>
          <button id="tab-singles" class="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors">Синглы</button>
          <button id="tab-artists" class="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors">Артисты</button>
        </div>
      </header>

      <div id="top-content" class="flex flex-col">
        ${renderTopList(scoredAlbums, oldAlbumsMap)}
      </div>
    </div>
  `;

  setTimeout(() => {
    const tabAlbums = document.getElementById("tab-albums");
    const tabSingles = document.getElementById("tab-singles");
    const tabArtists = document.getElementById("tab-artists");
    const topContent = document.getElementById("top-content");

    if (tabAlbums && tabSingles && tabArtists && topContent) {
      tabAlbums.addEventListener("click", () => {
        tabAlbums.className =
          "text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors";
        tabSingles.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        tabArtists.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        topContent.innerHTML = renderTopList(scoredAlbums, oldAlbumsMap);
      });

      tabSingles.addEventListener("click", () => {
        tabSingles.className =
          "text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors";
        tabAlbums.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        tabArtists.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        topContent.innerHTML = renderTopList(scoredSingles, oldSinglesMap);
      });

      tabArtists.addEventListener("click", () => {
        tabArtists.className =
          "text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors";
        tabAlbums.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        tabSingles.className =
          "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        topContent.innerHTML = renderTopArtistsList(scoredArtists, oldArtistsMap);
      });
    }
  }, 0);
}

function renderSpringTop() {
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const springReviews = [...reviews].filter((r) => {
    if (r.isUpcoming) return false;
    if (r.noTop) return false;
    if (!r.releaseDate) return false;
    const rd = r.releaseDate;
    return rd >= '2026-03-01' && rd <= '2026-05-31';
  });

  const scoredAlbums = springReviews
    .filter((r) => !r.isSingle)
    .sort((a, b) => getScore(b) - getScore(a));

  const scoredSingles = springReviews
    .filter((r) => r.isSingle)
    .sort((a, b) => getScore(b) - getScore(a));

  const albumTiers = getTiers(scoredAlbums, getScore);
  const singleTiers = getTiers(scoredSingles, getScore);

  const renderSimpleList = (listToRender) => {
    return listToRender
      .map((review, idx) => {
        const score = getScore(review);
        const artist = getArtist(review.artistId);
        const rank = idx + 1;

        return `
        <a href="#/reviews/${review.id}" class="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-3 md:py-4 -mx-4 px-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div class="w-8 md:w-12 text-center text-zinc-400 dark:text-zinc-500 font-serif font-black text-xl md:text-2xl italic flex-shrink-0 group-hover:text-emerald-500 transition-colors">
            ${rank}
          </div>
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 mr-4 overflow-hidden rounded-md sm:rounded-lg shadow-sm">
            <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div class="flex-grow min-w-0">
            <h3 class="font-serif font-bold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors mb-0.5 truncate leading-tight">
              ${review.title}
            </h3>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              ${artist?.name}
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 text-center">
            <div class="text-xl sm:text-2xl font-bold tracking-tighter w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 transition-colors ${score >= 8.0 ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500" : "border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"}">
              ${score.toFixed(1)}
            </div>
          </div>
        </a>
      `;
      })
      .join("");
  };

  const renderSimpleTierGroup = (title, groupedTiers, items) => {
    if (!items.length) return "";
    let rows = "";
    Object.keys(groupedTiers).forEach((tierName) => {
      const tierItems = groupedTiers[tierName];
      if (!tierItems || tierItems.length === 0) return;
      
      let colorClass = "bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white";
      if (tierName === "S") colorClass = "bg-orange-400 text-white dark:bg-orange-500";
      if (tierName === "A") colorClass = "bg-rose-400 text-white dark:bg-rose-500";
      if (tierName === "B") colorClass = "bg-emerald-400 text-white dark:bg-emerald-500";
      if (tierName === "C") colorClass = "bg-sky-400 text-white dark:bg-sky-500";
      if (tierName === "D") colorClass = "bg-zinc-800 text-white dark:bg-zinc-700";

      const itemsHtml = tierItems.map((item, idx) => {
        let warningBadge = "";
        if (tierName !== "D" && tierItems.length > 2 && idx === tierItems.length - 1) {
          warningBadge = `<div class="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-yellow-500 bg-white dark:bg-zinc-900 rounded-full shadow-sm z-10 border-2 border-white dark:border-zinc-900" title="На грани вылета">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 p-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                              <path d="M12 9v4"/>
                              <path d="M12 17h.01"/>
                            </svg>
                          </div>`;
        }
        return `<a href="#/reviews/${item.id}" class="group relative w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0" title="${item.title} - ${parseFloat(getScore(item).toFixed(1))}">` +
                 warningBadge +
                 `<img src="${item.cover}" class="w-full h-full object-cover rounded-md sm:rounded-lg border border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-500 transition-all shadow-sm" />` +
                 `</a>`;
      }).join("");

      rows += `
        <div class="flex flex-row mb-2 sm:mb-3 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl overflow-hidden bg-white dark:bg-[#111] shadow-sm transition-all hover:shadow-md">
          <div class="${colorClass} p-2 w-16 sm:w-24 flex items-center justify-center font-serif font-black text-xl sm:text-3xl tracking-tighter shrink-0 border-r border-black/10 dark:border-white/10">
            ${tierName}
          </div>
          <div class="p-2 sm:p-4 flex flex-wrap gap-2 sm:gap-3 items-center w-full bg-zinc-50 dark:bg-[#111]">
            ${itemsHtml}
          </div>
        </div>
      `;
    });

    return `
      <div class="mb-12">
        <h3 class="text-2xl font-serif font-black mb-4 uppercase tracking-tighter border-b border-zinc-200 dark:border-zinc-800 pb-2">${title}</h3>
        ${rows}
      </div>
    `;
  };

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-8 md:py-16 animate-slide-up">
      <button class="back-button mb-8 flex items-center gap-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
        ${ICONS.ARROW_LEFT} Назад
      </button>

      <header class="mb-10 text-center md:text-left">
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4 uppercase text-emerald-900 dark:text-emerald-100">
          Топ Весны 2026
        </h1>
        <p class="text-emerald-700 dark:text-emerald-400 max-w-2xl text-lg leading-relaxed font-serif italic mx-auto md:mx-0">
          Итоги весеннего сезона. На этой странице собраны лучшие синглы и альбомы весны, а также тир-лист этих релизов.
        </p>
      </header>

      <div class="flex gap-4 mb-8 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 hide-scrollbar" id="spring-tabs">
        <button id="tab-spring-tiers" class="text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap">Тир-лист</button>
        <button id="tab-spring-albums" class="text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap">Альбомы</button>
        <button id="tab-spring-singles" class="text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap">Синглы</button>
      </div>

      <div id="spring-content" class="animate-fade-in bg-white dark:bg-zinc-950">
        ${renderSimpleTierGroup("Альбомы", albumTiers, scoredAlbums)}
        ${renderSimpleTierGroup("Синглы", singleTiers, scoredSingles)}
      </div>
    </div>
  `;

  setTimeout(() => {
    const tabTiers = document.getElementById("tab-spring-tiers");
    const tabAlbums = document.getElementById("tab-spring-albums");
    const tabSingles = document.getElementById("tab-spring-singles");
    const content = document.getElementById("spring-content");

    if (tabTiers && tabAlbums && tabSingles && content) {
      tabTiers.addEventListener("click", () => {
        tabTiers.className = "text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabAlbums.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabSingles.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        content.innerHTML = renderSimpleTierGroup("Альбомы", albumTiers, scoredAlbums) + renderSimpleTierGroup("Синглы", singleTiers, scoredSingles);
      });

      tabAlbums.addEventListener("click", () => {
        tabAlbums.className = "text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabTiers.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabSingles.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        content.innerHTML = renderSimpleList(scoredAlbums);
      });

      tabSingles.addEventListener("click", () => {
        tabSingles.className = "text-emerald-600 border-b-2 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabTiers.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        tabAlbums.className = "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 border-b-2 border-transparent font-bold uppercase tracking-widest text-sm pb-3 px-2 transition-colors whitespace-nowrap";
        content.innerHTML = renderSimpleList(scoredSingles);
      });
    }
  }, 0);
}

function renderNotes() {
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const allRatings = JSON.parse(localStorage.getItem("userRatings") || "{}");
  const subscribedArtistIds = JSON.parse(localStorage.getItem("subscribedArtists") || "[]");

  const savedReviews = [];
  const ratedReviews = [];

  const subscribedReviews = [...reviews].filter(r => {
    if (r.isUpcoming) return false;
    const isSubscribed = subscribedArtistIds.includes(r.artistId) || 
      (r.artistIds && r.artistIds.some(id => subscribedArtistIds.includes(id)));
    if (!isSubscribed) return false;
    
    // Max 1 month old
    const releaseDate = new Date(r.releaseDate);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return releaseDate >= oneMonthAgo && releaseDate <= new Date();
  }).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 20);

  Object.entries(allRatings).forEach(([revId, data]) => {
    const review = getReview(revId);
    if (!review) return;

    if (data.wantsToRate === true) {
      savedReviews.push(review);
    }

    let isRated = false;
    let sum = 0;
    let count = 0;
    Object.values(data.tracks || {}).forEach((v) => {
      if (v !== "" && !isNaN(parseInt(v))) {
        sum += parseInt(v);
        count++;
        isRated = true;
      }
    });
    Object.values(data.criteria || {}).forEach((v) => {
      if (v !== "" && !isNaN(parseInt(v))) {
        sum += parseInt(v);
        count++;
        isRated = true;
      }
    });

    if (isRated) {
      review.userAvgScore = (sum / count).toFixed(1);
      ratedReviews.push(review);
    }
  });

  const renderSection = (items, type) => {
    if (items.length === 0) {
      return `<p class="text-zinc-500 font-serif italic text-lg py-8 text-center bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">Список пуст.</p>`;
    }

    return items
      .map((review) => {
        const artist = getArtist(review.artistId);
        let scoreHtml = "";
        if (type === "rated") {
          scoreHtml = `<div class="font-bold text-3xl tracking-tighter ${parseFloat(review.userAvgScore) >= 8.0 ? "text-red-600 dark:text-red-500" : "text-zinc-600 dark:text-zinc-400"}">${review.userAvgScore}</div><div class="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">Оценка</div>`;
        } else if (type === "subscribed") {
          scoreHtml = `<div class="text-[10px] uppercase tracking-widest font-bold text-red-500 dark:text-red-400 text-center">Новый<br/>релиз</div>`;
        } else {
          scoreHtml = `<div class="text-xs uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">В заметках</div>`;
        }

        return `
        <a href="#/reviews/${review.id}" class="group flex items-center justify-between border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-16 h-16 relative bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 overflow-hidden shadow-sm dark:ring-1 dark:ring-white/10 rounded-lg">
              <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div class="flex-grow min-w-0">
              <h3 class="font-serif font-bold text-lg leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors truncate">
                ${review.title}
              </h3>
              <div class="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                ${artist?.name}
              </div>
            </div>
          </div>
          <div class="text-right flex flex-col items-end justify-center flex-shrink-0 ml-4 min-w-[4rem]">
            ${scoreHtml}
          </div>
        </a>
      `;
      })
      .join("");
  };

  app.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8 md:py-16 animate-slide-up">
      <button class="back-button mb-8 flex items-center gap-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
        ${ICONS.ARROW_LEFT} Назад
      </button>

       <header class="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 class="font-serif font-black text-4xl md:text-5xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-2">
          Мои Заметки
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg font-serif italic">
          Ваши ожидаемые и оцененные релизы.
        </p>
      </header>
      
      <div class="space-y-12">
        ${subscribedReviews.length > 0 ? `
        <section>
          <h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-2">Подписки на артистов (${subscribedArtistIds.length})</h2>
          <div class="flex flex-col gap-4">
            ${renderSection(subscribedReviews, "subscribed")}
          </div>
        </section>
        ` : ""}

        <section>
          <h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-2">Хочу оценить (${savedReviews.length})</h2>
          <div class="flex flex-col gap-4">
            ${renderSection(savedReviews, "saved")}
          </div>
        </section>

        <section>
          <h2 class="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 border-b border-zinc-100 dark:border-zinc-800/50 pb-2">Оцененные (${ratedReviews.length})</h2>
          <div class="flex flex-col gap-4">
            ${renderSection(ratedReviews, "rated")}
          </div>
        </section>
      </div>
    </div>
  `;
}

let appHistory = [];
let isNavigatingBack = false;

function router() {
  recentReviewsDisplayed = 4;
  const hash = window.location.hash || "#/";

  if (!isNavigatingBack && appHistory[appHistory.length - 1] !== hash) {
    appHistory.push(hash);
  }
  isNavigatingBack = false;

  window.scrollTo(0, 0);

  if (hash === "#/") {
    renderHome();
  } else if (hash.startsWith("#/reviews/")) {
    const id = hash.split("/")[2];
    renderReview(id);
  } else if (hash.startsWith("#/artists/")) {
    const id = hash.split("/")[2];
    renderArtist(id);
  } else if (hash === "#/bnm") {
    renderBNM();
  } else if (hash === "#/bnt") {
    renderBNT();
  } else if (hash === "#/hall") {
    renderHall();
  } else if (hash === "#/top") {
    renderTop();
  } else if (hash === "#/tiers") {
    renderTiers();
  } else if (hash === "#/request") {
    renderRequestReview();
  } else if (hash === "#/notes") {
    renderNotes();
  } else if (hash === "#/spring-2026") {
    renderSpringTop();
  } else if (hash === "#/madness") {
    renderMadness();
  } else {
    renderHome();
  }
  
  setTimeout(() => window.updateCompareUI(), 0);
}

document.body.addEventListener("click", (e) => {
  const backBtn = e.target.closest(".back-button");
  if (backBtn) {
    e.preventDefault();
    if (appHistory.length > 1) {
      appHistory.pop();
      const prev = appHistory[appHistory.length - 1];
      isNavigatingBack = true;
      window.location.hash = prev;
    } else {
      window.location.hash = "#/";
    }
  }
});

window.addEventListener("hashchange", router);
router();

window.animateDive = function(event, element, url) {
  event.preventDefault();
  
  const img = element.querySelector('img');
  if (!img) {
    window.location.hash = url;
    return;
  }
  
  const rect = img.getBoundingClientRect();
  
  // Create an overlay container
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '99999';
  overlay.style.pointerEvents = 'none';
  
  // Add dark backdrop
  const backdrop = document.createElement('div');
  backdrop.style.position = 'absolute';
  backdrop.style.inset = '0';
  backdrop.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#09090b' : '#fafafa';
  backdrop.style.opacity = '0';
  backdrop.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  
  // Clone image
  const clone = document.createElement('img');
  clone.src = img.src;
  clone.style.position = 'absolute';
  clone.style.top = rect.top + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.objectFit = 'cover';
  clone.style.borderRadius = window.getComputedStyle(img).borderRadius;
  clone.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  clone.style.boxShadow = '0 0 40px rgba(0,0,0,0.5)';
  
  overlay.appendChild(backdrop);
  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  
  element.style.opacity = '0';
  
  // Start animation
  requestAnimationFrame(() => {
    backdrop.style.opacity = '1';
    
    // Zoom in highly to dive through
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.max(scaleX, scaleY) * 1.5; 
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const imgCenterX = rect.left + rect.width / 2;
    const imgCenterY = rect.top + rect.height / 2;
    
    const dx = centerX - imgCenterX;
    const dy = centerY - imgCenterY;
    
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    clone.style.opacity = '0'; // fade out as we dive in
  });
  
  setTimeout(() => {
    window.location.hash = url;
    setTimeout(() => {
      overlay.remove();
      element.style.opacity = '1';
    }, 50);
  }, 600);
}
