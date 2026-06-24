import { callApi, getCurrentUser, syncUserLocalData } from "./api.js";
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

  const targetReviews = reviewIds.map(id => reviews.find(r => r.id === id)).filter(Boolean);

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

  const user = getCurrentUser();

  if (!user) {
    html += `
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">
          Требуется авторизация
        </h2>
        <p class="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-serif max-w-xl mb-12 leading-relaxed">
          Чтобы проголосовать во втором этапе ивента, тебе необходимо войти в свой аккаунт или зарегистрироваться.
        </p>
        <a href="#/login" class="inline-flex items-center gap-3 bg-red-600 text-white font-bold uppercase tracking-widest px-8 py-4 hover:scale-105 transition-transform rounded-full shadow-lg">
          Войти
        </a>
      </div>
    </div>`;
    app.innerHTML = html;
    return;
  }

  app.innerHTML = html + `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div></div>`;

  const res = await callApi({ action: 'getMGRVotes', username: user.username });
  const serverTotalVotes = (res.success && res.totalVotes) ? res.totalVotes : {};
  let likesState = (res.success && res.myVotes) ? res.myVotes : {};
  
  if (Object.keys(likesState).length === 0) {
    reviewIds.forEach(id => likesState[id] = 0);
  }

  // Calculate base likes (total - my previous votes)
  const BASE_LIKES = {};
  reviewIds.forEach(id => {
    BASE_LIKES[id] = (serverTotalVotes[id] || 0) - (likesState[id] || 0);
    if (BASE_LIKES[id] < 0) BASE_LIKES[id] = 0;
  });

  html = `<div id="mgr-wrapper" class="max-w-5xl mx-auto px-4 py-8 animate-slide-up pb-32">`;
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

  html += `
    <div class="mb-12 text-center">
      <h2 class="text-4xl sm:text-5xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">
        Голосование
      </h2>
      <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-serif max-w-2xl mx-auto">
        Распредели 15 лайков между четырьмя лучшими рецензиями пользователей. 
        Ты можешь отдать все лайки одной рецензии или распределить их как хочешь.
      </p>
    </div>

    <div class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 md:px-8 md:py-6 mb-12 flex flex-col sm:flex-row items-center justify-between shadow-inner">
      <div class="text-center sm:text-left mb-4 sm:mb-0">
        <div class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Осталось лайков</div>
        <div class="text-4xl font-black font-serif tracking-tighter text-red-600 dark:text-red-500" id="likes-remaining">
          15
        </div>
      </div>
      <button id="mgr-submit-votes" class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-[0.1em] text-sm px-8 py-3 rounded-xl transition-all shadow-xl hover:shadow-red-500/20 active:scale-[0.98]">
        Сохранить голоса
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  `;

  targetReviews.forEach(review => {
    const artist = getArtist(review.artistId);
    const score = getScore(review);
    const likeCount = likesState[review.id] || 0;
    const baseLike = BASE_LIKES[review.id] || 0;
    const totalLikes = baseLike + likeCount;

    let artistName = artist ? artist.name : "";
    if (review.artistIds) {
       artistName = review.artistIds.map(id => getArtist(id) ? getArtist(id).name : "").filter(Boolean).join(", ");
    }

    html += `
      <div class="flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all group">
        <a href="#/reviews/${review.id}" class="relative aspect-square overflow-hidden block">
          <img src="${review.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="${review.title}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div class="text-white drop-shadow-md">
              <h3 class="font-serif font-black text-2xl leading-tight mb-1 line-clamp-2">${review.title}</h3>
              <p class="font-bold text-sm tracking-wide opacity-80 uppercase line-clamp-1">${artistName}</p>
            </div>
            
            <div class="w-16 h-16 rounded-full border-4 border-white dark:border-zinc-900 bg-black text-white flex items-center justify-center font-black text-xl shadow-xl shrink-0">
              ${score.toFixed(1)}
            </div>
          </div>
        </a>
        
        <div class="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm text-zinc-500 uppercase tracking-widest">Твои лайки</span>
            
            <div class="flex items-center gap-4">
              <button class="mgr-like-minus w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500 text-zinc-600 dark:text-zinc-300 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-50" data-id="${review.id}">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>
              </button>
              <div class="flex flex-col items-center justify-center w-12">
                <span class="text-center font-black text-3xl font-serif text-zinc-900 dark:text-white" id="likes-count-${review.id}">${likeCount}</span>
              </div>
              <button class="mgr-like-plus w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-red-500 text-zinc-600 dark:text-zinc-300 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-50" data-id="${review.id}">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
             <span class="font-bold text-xs text-zinc-400 uppercase tracking-widest">Общие лайки</span>
             <span class="font-bold text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span id="total-likes-count-${review.id}">${totalLikes}</span>
             </span>
          </div>
        </div>
      </div>
    `;
  });

  html += `
    </div>
  </div>`;
  
  app.innerHTML = html;

  const remainingEl = document.getElementById("likes-remaining");
  const wrapper = document.getElementById("mgr-wrapper");
  const submitBtn = document.getElementById("mgr-submit-votes");

  const MAX_LIKES = 15;

  function updateRemaining() {
    let totalAssigned = 0;
    Object.values(likesState).forEach(val => totalAssigned += val);
    const rem = MAX_LIKES - totalAssigned;
    remainingEl.innerText = rem;
    
    if (rem === 0) {
      remainingEl.classList.add("text-zinc-400", "dark:text-zinc-600");
      remainingEl.classList.remove("text-red-600", "dark:text-red-500");
    } else {
      remainingEl.classList.remove("text-zinc-400", "dark:text-zinc-600");
      remainingEl.classList.add("text-red-600", "dark:text-red-500");
    }
    
    // update buttons states
    document.querySelectorAll(".mgr-like-plus").forEach(btn => {
      btn.disabled = rem <= 0;
    });
    document.querySelectorAll(".mgr-like-minus").forEach(btn => {
      const id = btn.dataset.id;
      btn.disabled = likesState[id] <= 0;
    });
  }

  wrapper.addEventListener("click", (e) => {
    const minusBtn = e.target.closest(".mgr-like-minus");
    const plusBtn = e.target.closest(".mgr-like-plus");

    if (minusBtn) {
      const id = minusBtn.dataset.id;
      if (likesState[id] > 0) {
        likesState[id]--;
        document.getElementById("likes-count-" + id).innerText = likesState[id];
        document.getElementById("total-likes-count-" + id).innerText = (BASE_LIKES[id] || 0) + likesState[id];
        updateRemaining();
      }
    } else if (plusBtn) {
      const id = plusBtn.dataset.id;
      let totalAssigned = 0;
      Object.values(likesState).forEach(val => totalAssigned += val);
      if (totalAssigned < MAX_LIKES) {
        likesState[id]++;
        document.getElementById("likes-count-" + id).innerText = likesState[id];
        document.getElementById("total-likes-count-" + id).innerText = (BASE_LIKES[id] || 0) + likesState[id];
        updateRemaining();
      }
    }
  });

  submitBtn.addEventListener("click", async () => {
    // Show saving toast
    const savingToast = document.createElement("div");
    savingToast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl animate-slide-up flex items-center gap-3";
    savingToast.innerHTML = '<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Сохраняем...';
    document.body.appendChild(savingToast);
    submitBtn.disabled = true;

    const res = await callApi({ action: 'submitMGRVotes', username: user.username, votes: likesState });

    savingToast.remove();
    submitBtn.disabled = false;

    if (res.success) {
      // Show success toast
      const toast = document.createElement("div");
      toast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl animate-slide-up flex items-center gap-3";
      toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Голоса сохранены!';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } else {
      alert("Ошибка при сохранении: " + (res.error || "Неизвестная ошибка"));
    }
  });

  updateRemaining();
}
