import { callApi, getCurrentUser, syncUserLocalData } from "./api.js";

export function renderMyGlobalReview() {
  const app = document.getElementById("app");
  window.scrollTo(0, 0);

  const submitted = localStorage.getItem("myGlobalReviewSubmitted_v6") === "true";

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

  if (!getCurrentUser()) {
    html += `
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">
          Требуется авторизация
        </h2>
        <p class="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-serif max-w-xl mb-12 leading-relaxed">
          Чтобы принять участие в ивенте, тебе необходимо войти в свой аккаунт или зарегистрироваться.
        </p>
        <a href="#/login" class="inline-flex items-center gap-3 bg-red-600 text-white font-bold uppercase tracking-widest px-8 py-4 hover:scale-105 transition-transform rounded-full shadow-lg">
          Войти
        </a>
      </div>
    </div>`;
    app.innerHTML = html;
    return;
  }

  if (submitted) {
    html += `
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">
          Рецензия отправлена!
        </h2>
        <p class="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-serif max-w-xl mb-12 leading-relaxed">
          Спасибо за участие! Твой отзыв записан. Ожидай публикации результатов ивента.
        </p>
        <a href="#/" class="inline-flex items-center gap-3 bg-red-600 text-white font-bold uppercase tracking-widest px-8 py-4 hover:scale-105 transition-transform rounded-full shadow-lg">
          На главную
        </a>
      </div>
    </div>`;
    app.innerHTML = html;
    return;
  }

  const state = {
    type: "single",
    tracks: [
      { id: 1, title: "", score: null },
      { id: 2, title: "", score: null },
      { id: 3, title: "", score: null },
      { id: 4, title: "", score: null }
    ],
    cSingle: [
      { id: "s-1", title: "Куплеты", score: null },
      { id: "s-2", title: "Припев", score: null },
      { id: "s-3", title: "Дополнительно", score: null },
      { id: "s-4", title: "Бит", score: null },
      { id: "s-5", title: "Флоу", score: null },
      { id: "s-6", title: "Потенциал хита", score: null },
      { id: "s-7", title: "Визуал", score: null }
    ],
    cAlbum: [
      { id: "a-1", title: "Биты", score: null },
      { id: "a-2", title: "Флоу", score: null },
      { id: "a-3", title: "Потенциал хита", score: null },
      { id: "a-4", title: "Визуал", score: null }
    ]
  };

  html += `
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 relative">
      <div class="col-span-1 xl:col-span-2 space-y-8">
        <!-- Title & Artist -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="block font-bold uppercase tracking-widest text-xs text-zinc-500 ml-1">Название релиза</label>
            <input type="text" id="mgr-title" class="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none" placeholder="Введи название..." required />
          </div>
          <div class="space-y-3">
            <label class="block font-bold uppercase tracking-widest text-xs text-zinc-500 ml-1">Артист</label>
            <input type="text" id="mgr-artist" class="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none" placeholder="Имя исполнителя..." required />
          </div>
        </div>

        <!-- Type & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="block font-bold uppercase tracking-widest text-xs text-zinc-500 ml-1">Тип релиза</label>
            <div class="flex bg-zinc-100 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <button type="button" id="mgr-type-single" class="flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors bg-white dark:bg-zinc-800 shadow text-red-600 dark:text-red-500">Сингл</button>
              <button type="button" id="mgr-type-album" class="flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800/50">Альбом</button>
            </div>
            <input type="hidden" id="mgr-type" value="single" />
          </div>
          <div class="space-y-3">
            <label class="block font-bold uppercase tracking-widest text-xs text-zinc-500 ml-1">Дата релиза</label>
            <input type="date" id="mgr-date" class="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none" required />
          </div>
        </div>

        <!-- Review Text -->
        <div class="space-y-3">
          <label class="block font-bold uppercase tracking-widest text-xs text-zinc-500 ml-1">Мини-ревью</label>
          <textarea id="mgr-review" rows="4" class="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none resize-y" placeholder="Коротко о своих впечатлениях (1-3 предложения)..." required></textarea>
        </div>

        <!-- Tracks -->
        <div id="mgr-tracks-container" class="hidden space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 class="font-serif font-black uppercase text-2xl dark:text-white drop-shadow-sm flex items-center gap-3">
            Треклист
            <span class="text-xs tracking-widest text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 px-3 py-1 rounded-full font-sans">Обязательно (Мин. 4 трека)</span>
          </h3>
          <div id="mgr-tracks-list" class="space-y-4"></div>
          <button id="mgr-add-track" class="text-red-600 dark:text-red-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
             Добавить трек
          </button>
        </div>

        <!-- Criteria -->
        <div class="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 class="font-serif font-black uppercase text-2xl dark:text-white drop-shadow-sm flex items-center gap-3">
            Критерии 
            <span class="text-xs tracking-widest text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full font-sans">1–10</span>
          </h3>
          <div id="mgr-criteria-single" class="space-y-4">
             ${renderCriteriaHTML(state.cSingle, 'single')}
          </div>
          <div id="mgr-criteria-album" class="hidden space-y-4">
             ${renderCriteriaHTML(state.cAlbum, 'album')}
          </div>
        </div>
        
        <div class="pt-10">
           <button id="mgr-submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl transition-all shadow-xl hover:shadow-red-500/20 active:scale-[0.98]">
             Отправить рецензию
           </button>
        </div>
      </div>
      
      <!-- Score Circle Sidebar -->
      <div class="col-span-1 pt-12 xl:pt-0 relative">
        <div class="sticky top-28 flex flex-col items-center">
           <p class="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-8 text-center animate-pulse">Твоя итоговая оценка</p>
           
           <div id="mgr-score-circle" class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex flex-col items-center justify-center rounded-fill border-[8px] border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 transition-colors duration-500 shadow-xl" style="border-radius: 50%;">
             <span id="mgr-total-score" class="text-7xl sm:text-8xl md:text-[7rem] font-bold tracking-tighter leading-none mt-2 transition-colors duration-500">
               —
             </span>
           </div>
        </div>
      </div>
    </div>
  </div>`;
  
  app.innerHTML = html;
  
  const wrapper = document.getElementById("mgr-wrapper");
  const typeInput = document.getElementById("mgr-type");
  const btnTypeSingle = document.getElementById("mgr-type-single");
  const btnTypeAlbum = document.getElementById("mgr-type-album");
  const tracksContainer = document.getElementById("mgr-tracks-container");
  const criteriaSingle = document.getElementById("mgr-criteria-single");
  const criteriaAlbum = document.getElementById("mgr-criteria-album");
  const tracksList = document.getElementById("mgr-tracks-list");
  const addTrackBtn = document.getElementById("mgr-add-track");
  const totalScoreEl = document.getElementById("mgr-total-score");
  const scoreCircle = document.getElementById("mgr-score-circle");
  const submitBtn = document.getElementById("mgr-submit");

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl animate-slide-up flex items-center gap-3";
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function renderCriteriaHTML(criteriaArray, typeStr) {
    return criteriaArray.map(c => `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-red-900/50 transition-colors shadow-sm">
        <span class="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs mb-4 sm:mb-0">${c.title}</span>
        <div class="flex items-center gap-5">
          <button type="button" class="mgr-btn-minus w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-all disabled:opacity-50" data-type="${typeStr}" data-id="${c.id}">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
          </button>
          <span class="w-8 text-center font-black text-2xl text-zinc-900 dark:text-white font-serif tracking-tighter" id="val-${c.id}">${c.score === null ? '—' : c.score}</span>
          <button type="button" class="mgr-btn-plus w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-all disabled:opacity-50" data-type="${typeStr}" data-id="${c.id}">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    `).join("");
  }

  function renderTracksList() {
    tracksList.innerHTML = state.tracks.map((t, idx) => `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-red-900 transition-colors shadow-sm relative group overflow-hidden">
        
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-500 transition-colors"></div>
        
        <div class="flex-grow flex items-center gap-3 pl-3">
           <span class="text-zinc-400 dark:text-zinc-600 font-black font-mono text-xs w-5">${idx + 1}.</span>
           <input type="text" class="mgr-track-title bg-transparent border-none outline-none font-bold text-zinc-900 dark:text-white w-full placeholder-zinc-400 p-2 focus:bg-zinc-50 dark:focus:bg-zinc-900/50 rounded-lg transition-colors" placeholder="Название трека" data-id="${t.id}" value="${t.title}" />
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="mgr-btn-minus w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors" data-type="track" data-id="${t.id}">-</button>
          <span class="w-8 text-center font-black text-xl text-zinc-900 dark:text-white font-serif tracking-tighter" id="val-t-${t.id}">${t.score === null ? '—' : t.score}</span>
          <button type="button" class="mgr-btn-plus w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors" data-type="track" data-id="${t.id}">+</button>
          <div class="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
          <button type="button" class="mgr-btn-del w-10 h-10 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center justify-center transition-colors" data-id="${t.id}" title="Удалить трек">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    `).join("");
  }

  renderTracksList();

  function updateScore() {
    let meanCrit = 0;
    let meanTracks = 0;
    let scoreStr = "—";

    if (state.type === "single") {
      const scored = state.cSingle.filter(c => c.score !== null);
      if (scored.length > 0) {
        meanCrit = scored.reduce((a, b) => a + b.score, 0) / scored.length;
        scoreStr = meanCrit.toFixed(1);
      }
    } else {
      const scoredCrit = state.cAlbum.filter(c => c.score !== null);
      const scoredTrack = state.tracks.filter(t => t.score !== null);
      
      let hasCrit = scoredCrit.length > 0;
      let hasTrack = scoredTrack.length > 0;

      if (hasCrit) meanCrit = scoredCrit.reduce((a, b) => a + b.score, 0) / scoredCrit.length;
      if (hasTrack) meanTracks = scoredTrack.reduce((a, b) => a + b.score, 0) / scoredTrack.length;

      if (hasCrit && hasTrack) {
        scoreStr = ((meanCrit + meanTracks) / 2).toFixed(1);
      } else if (hasCrit) {
        scoreStr = meanCrit.toFixed(1);
      } else if (hasTrack) {
        scoreStr = meanTracks.toFixed(1);
      }
    }
    
    totalScoreEl.innerText = scoreStr;
    totalScoreEl.className = "text-7xl sm:text-8xl md:text-[7rem] font-bold tracking-tighter leading-none mt-2 transition-colors duration-500";
    
    if (scoreStr !== "—") {
       const s = parseFloat(scoreStr);
       let borderColor = "border-zinc-200 dark:border-zinc-800";
       let textColor = "text-zinc-800 dark:text-zinc-200";
       if (s >= 8) {
          borderColor = "border-red-600 dark:border-red-500";
          textColor = "text-red-600 dark:text-red-500";
       }
       scoreCircle.className = `w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex flex-col items-center justify-center rounded-full border-[8px] ${borderColor} ${textColor} bg-white dark:bg-zinc-900 transition-colors duration-500 shadow-xl`;
    } else {
       scoreCircle.className = `w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex flex-col items-center justify-center rounded-full border-[8px] border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 bg-white dark:bg-zinc-900 transition-colors duration-500 shadow-xl`;
    }
  }

  function setType(type) {
    state.type = type;
    typeInput.value = type;
    if (type === "album") {
      btnTypeAlbum.className = "flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors bg-white dark:bg-zinc-800 shadow text-red-600 dark:text-red-500";
      btnTypeSingle.className = "flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800/50";
      tracksContainer.classList.remove("hidden");
      criteriaAlbum.classList.remove("hidden");
      criteriaSingle.classList.add("hidden");
    } else {
      btnTypeSingle.className = "flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors bg-white dark:bg-zinc-800 shadow text-red-600 dark:text-red-500";
      btnTypeAlbum.className = "flex-1 py-3 px-4 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800/50";
      tracksContainer.classList.add("hidden");
      criteriaAlbum.classList.add("hidden");
      criteriaSingle.classList.remove("hidden");
    }
    updateScore();
  }

  btnTypeSingle.addEventListener("click", () => setType("single"));
  btnTypeAlbum.addEventListener("click", () => setType("album"));

  addTrackBtn.addEventListener("click", () => {
    const newId = state.tracks.length > 0 ? Math.max(...state.tracks.map(t => t.id)) + 1 : 1;
    state.tracks.push({ id: newId, title: "", score: null });
    renderTracksList();
    updateScore();
  });

  wrapper.addEventListener("click", (e) => {
    const minusBtn = e.target.closest(".mgr-btn-minus");
    const plusBtn = e.target.closest(".mgr-btn-plus");
    const delBtn = e.target.closest(".mgr-btn-del");

    if (delBtn) {
       const id = parseInt(delBtn.dataset.id);
       state.tracks = state.tracks.filter(t => t.id !== id);
       renderTracksList();
       updateScore();
       return;
    }

    if (minusBtn || plusBtn) {
      const btn = minusBtn || plusBtn;
      const type = btn.dataset.type;
      const id = btn.dataset.id;
      const isPlus = !!plusBtn;

      let item = null;
      let valEl = null;

      if (type === "single") {
        item = state.cSingle.find(c => c.id === id);
        valEl = document.getElementById("val-" + id);
      } else if (type === "album") {
        item = state.cAlbum.find(c => c.id === id);
        valEl = document.getElementById("val-" + id);
      } else if (type === "track") {
        item = state.tracks.find(t => t.id === parseInt(id));
        valEl = document.getElementById("val-t-" + id);
      }

      if (item && valEl) {
         if (item.score === null) {
            item.score = 5;
         } else {
            if (isPlus && item.score < 10) item.score++;
            else if (!isPlus && item.score > 1) item.score--;
            else if (!isPlus && item.score === 1) item.score = null;
         }
         valEl.innerText = item.score === null ? "—" : item.score;
         updateScore();
      }
    }
  });

  wrapper.addEventListener("input", (e) => {
    if (e.target.classList.contains("mgr-track-title")) {
       const id = parseInt(e.target.dataset.id);
       const t = state.tracks.find(t => t.id === id);
       if (t) t.title = e.target.value;
    }
  });

  submitBtn.addEventListener("click", async () => {
    const title = document.getElementById("mgr-title").value.trim();
    const artist = document.getElementById("mgr-artist").value.trim();
    const date = document.getElementById("mgr-date").value;
    const review = document.getElementById("mgr-review").value.trim();

    if (!title || !artist || !date || !review) {
      showToast("Заполни все текстовые поля");
      return;
    }

    if (state.type === "album") {
      const validTracks = state.tracks.filter(t => t.title.trim().length > 0);
      if (validTracks.length < 4) {
        showToast("Укажи минимум 4 трека для альбома");
        return;
      }
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Отправка...";

    const reviewData = {
      artist,
      title,
      date,
      type: state.type,
      reviewText: review,
      tracks: state.tracks,
      scores: state.type === "single" ? state.cSingle : state.cAlbum
    };

    // Save to local storage
    localStorage.setItem("myGlobalReview", JSON.stringify(reviewData));

    // Send to backend
    const currentUser = getCurrentUser();
    
    try {
        const result = await callApi({
          action: 'submitEventReview',
          username: currentUser ? currentUser.username : "Anonymous",
          token: currentUser ? currentUser.token : null,
          review: reviewData
        });
        
        if (!result.success) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Отправить";
            showToast(result.error || "Ошибка при отправке");
            return;
        }

        if (currentUser) {
            await syncUserLocalData();
        }
    } catch (e) {
        console.error("Failed to submit review online", e);
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Отправить";
        showToast("Ошибка соединения с сервером");
        return;
    }

    // Mark as submitted locally to prevent multiple reviews from same browser
    localStorage.setItem("myGlobalReviewSubmitted_v6", "true");
    
    // Rerender page to show success message
    renderMyGlobalReview();
  });
}
