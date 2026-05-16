import {
  reviews,
  artists,
  getScore,
  getArtist,
  getReview,
  getGlobalRank,
  getArtistRank,
  formatDate,
  formatYear,
} from "./data.js";
import { renderRequestReview } from "./request.js";

// Icons
const ICONS = {
  SUN: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  MOON: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  DISC3: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6 12c0-1.7.7-3.2 1.8-4.2"/><circle cx="12" cy="12" r="2"/><path d="M18 12c0 1.7-.7 3.2-1.8 4.2"/></svg>`,
  DISC: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>`,
  STAR: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  EXTERNAL_LINK: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  ARROW_LEFT: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`
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
    const diff =
      new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
    return diff !== 0
      ? diff
      : new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });
  const featuredReview = sortedReviews.find((r) => !r.isUpcoming);
  const otherReviewsAll = sortedReviews
    .filter((r) => r.id !== featuredReview?.id);
  const otherReviews = otherReviewsAll.slice(0, recentReviewsDisplayed);

  let html = `<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up">`;

  if (featuredReview) {
    const artistNames = (featuredReview.artistIds || [featuredReview.artistId]).map(id => getArtist(id)?.name).filter(Boolean).join(", ");
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

  if (otherReviews.length > 0) {
    html += `
      <section class="mb-16">
        <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Недавние рецензии</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          ${otherReviews
            .map((review) => {
              const artistNames = (review.artistIds || [review.artistId]).map(id => getArtist(id)?.name).filter(Boolean).join(", ");
              return `
              <a href="#/reviews/${review.id}" class="group flex flex-col p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                <div class="aspect-square w-full relative overflow-hidden mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  ${review.isCancelled ? `<div class="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Отменен</div>` : review.isUpcoming ? `<div class="absolute bottom-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Скоро</div>` : ""}
                </div>
                <h3 class="font-serif font-bold text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50">
                  ${artistNames}: <i>${review.title}</i>
                </h3>
              </a>
            `;
            })
            .join("")}
        </div>
        ${otherReviews.length < otherReviewsAll.length ? `
          <div class="mt-8 text-center flex justify-center">
            <button id="load-more-recent" class="border-2 border-black dark:border-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Больше
            </button>
          </div>
        ` : ""}
      </section>
    `;
  }

  const albums = sortedReviews.filter((r) => !r.isSingle);

  html += `
    <section class="mb-16">
      <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm flex items-center gap-3">
        Альбомы
      </h2>
      ${
        albums.length > 0
          ? `<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
              ${albums.slice(0, 6)
                .map((review) => {
                  const artist = getArtist(review.artistId);
                  return `
                  <a href="#/reviews/${review.id}" class="group flex flex-col p-2 sm:p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                    <div class="aspect-square w-full relative overflow-hidden mb-2 sm:mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                      ${review.isCancelled ? `<div class="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Отменен</div>` : review.isUpcoming ? `<div class="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 bg-yellow-400 text-black text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 sm:py-1 uppercase tracking-widest rounded-sm z-20 shadow-md">Скоро</div>` : ""}
                    </div>
                    <h3 class="font-serif font-bold text-xs sm:text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50">
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
              ${singles.slice(0, 6)
                .map((review) => {
                  const artist = getArtist(review.artistId);
                  return `
                  <a href="#/reviews/${review.id}" class="group flex flex-col p-2 sm:p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
                    <div class="aspect-square w-full relative overflow-hidden mb-2 sm:mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      <img src="${review.cover}" alt="${review.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                    </div>
                    <h3 class="font-serif font-bold text-xs sm:text-lg leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors flex-grow text-zinc-900 dark:text-zinc-50">
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

  html += `
    <section>
      <h2 class="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Артисты</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        ${[...artists]
          .filter((artist) => artist.id !== "various-artists")
          .sort((a, b) => {
            const getAvgScore = (artistId) => {
              const artistReviews = reviews.filter(
                (r) => (r.artistId === artistId || (r.artistIds && r.artistIds.includes(artistId))) && !r.isUpcoming,
              );
              const totalScore = artistReviews.reduce(
                (sum, r) => sum + getScore(r),
                0,
              );
              return artistReviews.length > 0
                ? totalScore / artistReviews.length
                : 0;
            };
            return getAvgScore(b.id) - getAvgScore(a.id);
          })
          .map((artist) => {
            const artistReviews = reviews.filter(
              (r) => (r.artistId === artist.id || (r.artistIds && r.artistIds.includes(artist.id))) && !r.isUpcoming,
            );
            const totalScore = artistReviews.reduce(
              (sum, r) => sum + getScore(r),
              0,
            );
            const avgScore =
              artistReviews.length > 0
                ? (totalScore / artistReviews.length).toFixed(1)
                : "-";
            return `
          <a href="#/artists/${artist.id}" class="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div class="aspect-square rounded-full overflow-hidden mb-4 max-w-[8rem] w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group-hover:shadow-md transition-all">
              <img src="${artist.photo}" alt="${artist.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
            </div>
            <h3 class="font-bold text-sm uppercase tracking-wide group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors text-zinc-900 dark:text-zinc-50 mb-1">${artist.name}</h3>
            <span class="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">СР. ОЦЕНКА: <span class="${avgScore >= 8.0 ? "text-red-600 dark:text-red-400" : ""}">${avgScore}</span></span>
          </a>
        `;
          })
          .join("")}
      </div>
    </section>

    <section class="mt-20 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-12 text-center animate-slide-up">
      <h2 class="font-serif font-black text-3xl sm:text-4xl mb-4 text-zinc-900 dark:text-zinc-50">Выпускаете новый материал?</h2>
      <p class="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
        Отправьте свой релиз на рассмотрение редакции. Мы слушаем всё, но рецензируем только то, что вызывает у нас эмоции.
      </p>
      <a href="#/request" class="inline-block bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
        Заказать рецензию
      </a>
    </section>
  </div>`;

  app.innerHTML = html;
  document.body.classList.remove("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");
  
  const moreBtn = document.getElementById("load-more-recent");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      recentReviewsDisplayed += 4;
      renderHome();
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
  const isBNT = !review.isUpcoming && review.isSingle && score >= 8.5;
  const globalRank = getGlobalRank(review.id, review.isSingle);
  const artistRank = getArtistRank(review.id, review.artistId, review.isSingle);

  if (isBNM || isBNT) {
    document.body.classList.add("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");
  } else {
    document.body.classList.remove("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");
  }

  const itemsToRender = review.isSingle && review.singleCriteria ? review.singleCriteria : (review.tracks || []);

  const tracklistHtml = itemsToRender
    .map((track, idx) => {
      const isHigh = track.score !== undefined && track.score >= 9;
      const numberStr =
        track.number !== undefined
          ? track.number
            ? `${track.number}.`
            : ""
          : `${idx + 1}.`;
      
      const singleReview = (!review.isSingle && review.artistId) 
        ? reviews.find(r => r.isSingle && r.artistId === review.artistId && r.title.toLowerCase() === track.title.toLowerCase())
        : null;

      return `
      <div class="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 group hover:bg-black/5 dark:hover:bg-white/5 px-2 -mx-2 transition-colors">
         <div class="flex items-center gap-4 flex-wrap">
           ${numberStr ? `<span class="text-zinc-400 dark:text-zinc-500 font-mono text-sm w-4 text-right inline-block">${numberStr}</span>` : ""}
           <span class="font-bold text-zinc-800 dark:text-zinc-200 ${!numberStr ? "pl-2" : ""} flex items-center gap-2">
             ${track.title}
           </span>
         </div>
         <div class="flex items-center gap-4">
           ${singleReview ? `<a href="#/reviews/${singleReview.id}" title="Читать разбор сингла" class="text-zinc-400 hover:text-black dark:text-zinc-500 dark:hover:text-white transition-colors">${ICONS.EXTERNAL_LINK}</a>` : ""}
           <span class="font-bold w-8 text-center rounded flex items-center justify-center h-7 text-sm ${isHigh ? "text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/10"}">
             ${track.score !== undefined && track.score !== null ? track.score : "-"}
           </span>
         </div>
      </div>
    `;
    })
    .join("");

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
              isBNM
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
            <div class="mt-2 flex flex-wrap gap-2 items-center">
            ${(review.artistIds || [review.artistId]).map(id => getArtist(id)).filter(Boolean).map((a, i, arr) => `
              <a href="#/artists/${a.id}" class="inline-block group w-max">
                <h3 class="font-bold text-xl md:text-2xl uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                  ${a.name}${i < arr.length - 1 ? '<span class="text-zinc-600 dark:text-zinc-400">,</span>' : ''}
                </h3>
              </a>
            `).join('')}
            </div>
            
            <div class="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              <div><span class="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Лейбл</span>${review.label}</div>
              ${review.releaseDate ? `<div><span class="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Год</span>${formatYear(review.releaseDate)}</div>` : ""}
            </div>
            
            <div class="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 grid grid-cols-2 gap-4">
               ${
                 !review.isUpcoming
                   ? `
                 <div>
                    <span class="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе ${review.isSingle ? 'синглов' : 'альбомов'} платформы</span>
                    <div class="font-serif italic text-xl dark:text-zinc-200">#${globalRank}</div>
                 </div>
               `
                   : ""
               }
               ${
                 !review.isUpcoming
                   ? `<div class="contents">
                        ${(review.artistIds || [review.artistId]).map(id => {
                           const a = getArtist(id);
                           const aRank = getArtistRank(review.id, id, review.isSingle);
                           if (a && aRank > 0) {
                             return `
                             <div>
                                <span class="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе ${review.isSingle ? 'синглов' : 'альбомов'} артиста</span>
                                <div class="font-serif italic text-xl dark:text-zinc-200">#${aRank} <span class="text-sm font-sans not-italic text-zinc-400 dark:text-zinc-600">/ ${a.name}</span></div>
                             </div>
                             `;
                           }
                           return "";
                        }).join("")}
                      </div>`
                   : ""
               }
            </div>
          </div>
          
          <div class="w-[calc(100%-2rem)] md:w-[calc(20rem-2rem)] lg:w-80 flex-shrink-0 order-1 md:order-2 mb-6 md:mb-0 mr-2 md:mr-6 lg:mr-4">
            <div class="relative group">
              <img src="${review.cover}" alt="${review.title}" class="w-full bg-zinc-100 dark:bg-zinc-900 aspect-square object-cover shadow-2xl dark:shadow-none dark:ring-1 dark:ring-white/10" />
              <div class="absolute -bottom-6 -right-6 md:-right-8 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-xl border-4 z-10 font-bold ${isBNM ? "bg-[#fff0f0] border-[#fff0f0] dark:bg-[#1f0f0f] dark:border-[#1f0f0f]" : "bg-white border-white dark:bg-zinc-950 dark:border-zinc-950"} group-hover:scale-105 transition-transform duration-500">
                 <div class="text-center">
                   ${
                     review.isUpcoming
                       ? `
                     <div class="text-4xl md:text-5xl font-black text-zinc-400 dark:text-zinc-600 tracking-tighter leading-none">?</div>
                   `
                       : `
                     <div class="score-animate text-4xl md:text-5xl tracking-tighter leading-none ${score >= 8.0 ? "text-red-600 dark:text-red-500" : "text-zinc-900 dark:text-zinc-100"}" data-target="${score.toFixed(1)}">
                       0.0
                     </div>
                   `
                   }
                 </div>
              </div>
            </div>
          </div>
        </header>

        <div class="prose prose-lg dark:prose-invert mx-auto md:mx-0 max-w-2xl font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed mb-16 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
          <p>${review.text}</p>
        </div>
        
        <section class="border-t border-black dark:border-zinc-700 pt-8">
           <h3 class="text-sm font-bold uppercase tracking-wider mb-6 flex justify-between items-end dark:text-zinc-200">
             <span>${review.isSingle ? 'Критерии' : 'Треклист'}</span>
             <span class="text-xs text-zinc-500 dark:text-zinc-400 font-normal normal-case">${review.isUpcoming ? "" : `Средняя оценка: ${score.toFixed(1)}`}</span>
           </h3>
           <div class="flex flex-col">
             ${tracklistHtml.length ? tracklistHtml : `<div class="text-zinc-500 italic py-4">${review.isSingle ? 'Критерии' : 'Треклист'} пока неизвестны</div>`}
           </div>
        </section>

        <footer class="mt-16 text-sm flex flex-col md:flex-row justify-between text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-8 gap-4 font-mono">
           ${review.isUpcoming || !review.reviewDate ? `<div>Оценено: TBD</div>` : `<div>Оценено: ${formatDate(review.reviewDate)}</div>`}
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

  const artistReviews = [...reviews.filter((r) => r.artistId === id || (r.artistIds && r.artistIds.includes(id)))];
  const albumsList = artistReviews.filter(r => !r.isSingle);
  const singlesList = artistReviews.filter(r => r.isSingle);
  
  const scoredAlbums = albumsList.filter((r) => !r.isUpcoming);
  const totalAlbumsScore = scoredAlbums.reduce((sum, r) => sum + getScore(r), 0);
  const avgAlbumsScore =
    scoredAlbums.length > 0
      ? (totalAlbumsScore / scoredAlbums.length).toFixed(1)
      : "-";

  const scoredSingles = singlesList.filter((r) => !r.isUpcoming);
  const totalSinglesScore = scoredSingles.reduce((sum, r) => sum + getScore(r), 0);
  const avgSinglesScore =
    scoredSingles.length > 0
      ? (totalSinglesScore / scoredSingles.length).toFixed(1)
      : "-";

  const topAlbums = albumsList.filter(r => !r.isUpcoming).sort((a, b) => getScore(b) - getScore(a)).slice(0, 3);
  const topSingles = singlesList.filter(r => !r.isUpcoming).sort((a, b) => getScore(b) - getScore(a)).slice(0, 3);

  document.body.classList.remove("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");

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
          <div class="flex-grow">
            <h3 class="font-serif font-bold text-xl sm:text-2xl leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-1">
              ${review.title}
            </h3>
            <div class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-mono">
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
    <div class="max-w-5xl mx-auto px-4 py-8 md:py-16 animate-slide-up">
      <button class="back-button mb-8 flex items-center gap-2 text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
        ${ICONS.ARROW_LEFT} Назад
      </button>
      <header class="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 border-b border-black dark:border-zinc-700 pb-12">
        <div class="w-48 h-48 md:w-64 md:h-64 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden flex-shrink-0 border-4 border-white dark:border-zinc-800 shadow-xl dark:shadow-none">
          <img src="${artist.photo}" alt="${artist.name}" class="w-full h-full object-cover" />
        </div>
        <div class="text-center md:text-left flex-grow">
          <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            ${artist.name}
          </h1>
          <div class="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4 md:gap-8">
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-sm flex items-center gap-2">
                ${ICONS.DISC} ${scoredAlbums.length} Оцененных альбомов
              </p>
              <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-sm bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                СР. ОЦЕНКА: <span class="${avgAlbumsScore >= 8.0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}">${avgAlbumsScore}</span>
              </p>
            </div>
            ${scoredSingles.length > 0 ? `
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-sm flex items-center gap-2">
                ${ICONS.DISC3} ${scoredSingles.length} Оцененных синглов
              </p>
              <p class="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-sm bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                СР. ОЦЕНКА: <span class="${avgSinglesScore >= 8.0 ? 'text-red-600 dark:text-red-400' : 'text-zinc-800 dark:text-zinc-200'}">${avgSinglesScore}</span>
              </p>
            </div>
            ` : ""}
          </div>
        </div>
      </header>

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

      ${singlesList.length > 0 ? `
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
      ` : ""}
    </div>
  `;

  setTimeout(() => {
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
      return !r.isSingle && score >= 8.2;
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
        <div class="flex-grow text-center md:text-left w-full">
          <div class="text-xs text-red-600 dark:text-red-500 uppercase tracking-[0.2em] font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
            ${ICONS.STAR} BEST NEW MUSIC
          </div>
          <h3 class="font-serif font-black text-3xl sm:text-4xl leading-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-2">
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
          <div class="text-4xl sm:text-5xl font-bold tracking-tighter w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-4 border-[#fff0f0] bg-[#fff0f0] text-red-600 dark:border-[#1f0f0f] dark:bg-[#1f0f0f] dark:text-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
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
      return r.isSingle && score >= 8.5;
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
        <div class="flex-grow text-center md:text-left w-full">
          <div class="text-xs text-red-600 dark:text-red-500 uppercase tracking-[0.2em] font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
            ${ICONS.STAR} BEST NEW TRACK
          </div>
          <h3 class="font-serif font-black text-3xl sm:text-4xl leading-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-2">
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
          <div class="text-4xl sm:text-5xl font-bold tracking-tighter w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-4 border-[#fff0f0] bg-[#fff0f0] text-red-600 dark:border-[#1f0f0f] dark:bg-[#1f0f0f] dark:text-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500">
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
          Самые выдающиеся синглы, получившие оценку 8.5 и выше. Тщательно отобранная коллекция.
        </p>
      </header>

      <div class="flex flex-col gap-4">
        ${listHtml}
      </div>
    </div>
  `;
}

function renderTop() {
  document.body.classList.remove("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");

  const scoredAlbums = [...reviews].filter((r) => !r.isUpcoming && !r.isSingle).sort((a, b) => getScore(b) - getScore(a));
  const scoredSingles = [...reviews].filter((r) => !r.isUpcoming && r.isSingle).sort((a, b) => getScore(b) - getScore(a));

  const renderTopList = (listToRender) => {
    return listToRender.map((review, idx) => {
        const score = getScore(review);
        const artist = getArtist(review.artistId);
        const rank = idx + 1;
        return `
        <a href="#/reviews/${review.id}" class="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-5 px-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-300">
          <div class="font-serif italic text-3xl text-zinc-300 dark:text-zinc-700 w-12 flex-shrink-0 text-center mr-2 md:mr-4 group-hover:text-red-500 transition-colors">
            ${rank}
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
            <div class="text-xl sm:text-2xl font-bold tracking-tighter w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 transition-colors ${score >= 8.0 ? 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-500' : 'border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200'}">
              ${score.toFixed(1)}
            </div>
          </div>
        </a>
      `;
    }).join("");
  };

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-12 md:py-16 animate-slide-up">
      <header class="text-center mb-16">
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6 uppercase">
          Топ HueFork
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-serif italic mb-8">
          Рейтинг лучших релизов по версии платформы
        </p>
        <div class="flex justify-center gap-4 text-sm font-bold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800">
          <button id="tab-albums" class="text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors">Альбомы</button>
          <button id="tab-singles" class="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors">Синглы</button>
        </div>
      </header>

      <div id="top-content" class="flex flex-col">
        ${renderTopList(scoredAlbums)}
      </div>
    </div>
  `;

  setTimeout(() => {
    const tabAlbums = document.getElementById("tab-albums");
    const tabSingles = document.getElementById("tab-singles");
    const topContent = document.getElementById("top-content");

    if (tabAlbums && tabSingles && topContent) {
      tabAlbums.addEventListener("click", () => {
        tabAlbums.className = "text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors";
        tabSingles.className = "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        topContent.innerHTML = renderTopList(scoredAlbums);
      });

      tabSingles.addEventListener("click", () => {
        tabSingles.className = "text-black border-b-2 border-black dark:text-white dark:border-white pb-3 px-2 transition-colors";
        tabAlbums.className = "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white border-b-2 border-transparent pb-3 px-2 transition-colors";
        topContent.innerHTML = renderTopList(scoredSingles);
      });
    }
  }, 0);
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
  } else if (hash === "#/top") {
    renderTop();
  } else if (hash === "#/request") {
    renderRequestReview();
  } else {
    renderHome();
  }
}

document.body.addEventListener('click', (e) => {
  const backBtn = e.target.closest('.back-button');
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
