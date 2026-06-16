import { reviews, getArtist } from "./data.js";

const ARROW_LEFT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;

export function renderHuevision2026() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  let html = `
    <div class="relative w-full min-h-screen bg-black text-zinc-200">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.15)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div class="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20">
        <button class="back-button mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
          ${ARROW_LEFT_ICON} Назад
        </button>

        <header class="text-center mb-16 animate-slide-up">
          <div class="inline-flex justify-center mb-6">
            <div class="relative p-6 px-10 rounded-3xl bg-black border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] group">
               <div class="absolute inset-0 bg-red-600/10 blur-xl pointer-events-none"></div>
               <svg class="w-24 h-24 sm:w-32 sm:h-32 text-gray-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mx-auto relative z-10 transition-transform duration-700 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
               </svg>
            </div>
          </div>
          <h1 class="font-serif font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
            HUEVISION
          </h1>
          <p class="text-red-600 text-xl md:text-2xl font-black uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
            CONTEST
          </p>
          <p class="text-red-600 text-sm font-bold uppercase md:text-base tracking-[0.3em] flex items-center justify-center before:content-[''] before:w-12 before:h-[1px] before:bg-red-600 before:mr-4 after:content-[''] after:w-12 after:h-[1px] after:bg-red-600 after:ml-4 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)] mb-8">
            2026
          </p>
          <p class="text-zinc-400 text-base md:text-lg font-medium max-w-2xl mx-auto py-4 border-t border-zinc-800">
            Главное музыкальное событие года. Рецензии на официальный альбом конкурса и синглы участниц. Выбирайте своих фаворитов в HueFork X Huevision Awards.
          </p>
        </header>
  `;

  // Album Review (Big)
  const epReview = reviews.find(r => r.id === "various-artists-huevision-2026-ep");
  if (epReview) {
    html += `
        <section class="mb-16 animate-slide-up" style="animation-delay: 50ms;">
          <h2 class="text-2xl md:text-3xl font-black font-serif text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <span class="w-8 h-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span> Официальный Альбом
          </h2>
          <a href="#/reviews/${epReview.id}" class="group block relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-red-600/50 transition-all duration-500 shadow-2xl">
            <div class="flex flex-col md:flex-row">
              <div class="w-full md:w-2/5 aspect-[4/3] md:aspect-square relative bg-zinc-900 flex-shrink-0">
                <img src="${epReview.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Huevision Album" />
                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950"></div>
              </div>
              <div class="p-6 md:p-10 flex flex-col justify-center text-zinc-300 w-full md:w-3/5">
                <div class="text-red-500 font-bold tracking-widest uppercase text-[10px] md:text-xs mb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]"></span> Сборник конкурса</div>
                <h3 class="font-serif font-black text-3xl md:text-5xl tracking-tighter mb-4 leading-tight group-hover:text-white transition-colors">
                  ${epReview.title}
                </h3>
                <p class="text-zinc-400 line-clamp-4 text-sm md:text-base leading-relaxed mb-6 font-medium">
                  ${epReview.text}
                </p>
                <div class="text-white text-xs font-bold uppercase tracking-widest mt-auto group-hover:text-red-500 transition-colors">Читать полную рецензию &rarr;</div>
              </div>
            </div>
          </a>
        </section>
    `;
  }

  // Singles Reviews
  const singleIds = [
    "dollova-bikini-huevision-2026-single",
    "pavlova-cookie-dayaizvoronezha-huevision-2026-single",
    "sicka-revo-huevision-2026-single",
    "ksivat-song-1-huevision-2026-single"
  ];
  
  const singlesData = singleIds.map(id => reviews.find(r => r.id === id)).filter(Boolean);

  if (singlesData.length > 0) {
    html += `
        <section class="mb-20 animate-slide-up" style="animation-delay: 100ms;">
          <h2 class="text-2xl md:text-3xl font-black font-serif text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <span class="w-8 h-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span> Синглы Участниц
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    `;
    
    singlesData.forEach((review) => {
      const artist = getArtist(review.artistId);
      html += `
            <a href="#/reviews/${review.id}" class="group flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:bg-zinc-900 hover:border-red-600/50 transition-all duration-300 shadow-xl">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-zinc-800">
                   <img src="${review.cover}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                   <div class="text-red-500 font-bold text-[10px] md:text-xs uppercase tracking-widest leading-none mb-1">${artist ? artist.name : ''}</div>
                   <h3 class="font-serif font-black text-lg md:text-xl text-white leading-tight group-hover:text-red-400 transition-colors">${review.title.replace(' from Huevision 2026', '')}</h3>
                </div>
              </div>
              <p class="text-xs md:text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                 ${review.text}
              </p>
              <div class="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-auto flex justify-between items-center group-hover:text-white transition-colors">
                 <span>Читать &rarr;</span>
              </div>
            </a>
      `;
    });
    
    html += `
          </div>
        </section>
    `;
  }

  // Winners logic with broadcast animation
  const categoriesData = [
    {
      title: "«Спонсор моих кошмаров»",
      desc: "За самый экспериментальный трек",
      nominees: ["Dollova — BIKINI", "Pavlova Cookie — даяизворонежа", "SiCka — Revō", "Ksivat — Song #1"],
      winner: "Pavlova Cookie — даяизворонежа"
    },
    {
      title: "«Скрытый бриллиант»",
      desc: "За самый недооценённый трек",
      nominees: ["Dollova — BIKINI", "Pavlova Cookie — даяизворонежа", "SiCka — Revō", "Ksivat — Song #1"],
      winner: "Dollova — BIKINI"
    },
    {
      title: "«Бэнгер»",
      desc: "За трек, который заел в голове надолго",
      nominees: ["Dollova — BIKINI", "Pavlova Cookie — даяизворонежа", "SiCka — Revō", "Ksivat — Song #1"],
      winner: "Dollova — BIKINI"
    },
    {
      title: "«Нет — здравому смыслу»",
      desc: "За текст",
      nominees: ["Dollova — BIKINI", "Pavlova Cookie — даяизворонежа", "SiCka — Revō", "Ksivat — Song #1"],
      winner: "SiCka — Revō"
    },
    {
      title: "«Performer You Are»",
      desc: "За лучший перформанс",
      nominees: ["Dollova — BIKINI", "Pavlova Cookie — даяизворонежа", "SiCka — Revō", "Ksivat — Song #1"],
      winner: "SiCka — Revō"
    },
    {
      title: "«Хуйово»",
      desc: "За неудавшийся момент",
      nominees: [
        "Наковальня Ksivat во время выступления SiCka",
        "Ksivat сломала ногу",
        "Сцена Pavlova Cookie",
        "Dollova утонула"
      ],
      winner: "Сцена Pavlova Cookie"
    }
  ];

  html += `
        <section class="animate-slide-up" style="animation-delay: 150ms;">
          <div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center min-h-[400px] justify-center" id="broadcast-container">
            <div class="absolute -top-32 -right-32 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div id="broadcast-intro" class="w-full relative z-10 opacity-100 transition-opacity duration-1000 text-center flex flex-col items-center justify-center min-h-[200px]">
              <h2 class="text-3xl md:text-5xl font-black font-serif text-white uppercase tracking-tight mb-3 drop-shadow-lg">
                Итоги <span class="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800">AWARDS 2026</span>
              </h2>
              <p id="broadcast-status-text" class="text-zinc-400 font-medium mb-10 text-sm md:text-base">
                Вычисляем время трансляции...
              </p>
              <button id="start-broadcast-btn" style="display: none;" class="bg-white text-black font-black uppercase text-sm md:text-base tracking-widest py-4 md:py-5 px-10 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 shadow-xl group inline-flex justify-center items-center">
                <span class="relative z-10">Смотреть</span>
              </button>
            </div>

            <div id="broadcast-screen" class="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 opacity-0 pointer-events-none transition-opacity duration-1000 z-10 bg-zinc-950">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black z-0 pointer-events-none"></div>
              
              <div class="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 pointer-events-none z-10">
                <div id="b-category-title" class="text-white text-2xl md:text-5xl font-serif font-black transition-all duration-1000 opacity-0 transform translate-y-4 w-full max-w-3xl text-center leading-tight"></div>
              </div>
              
              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none z-10">
                <div id="b-nominees" class="text-zinc-400 text-lg md:text-2xl font-serif font-black opacity-0 transition-opacity duration-1000 space-y-4 md:space-y-6 w-full max-w-4xl text-center"></div>
              </div>

              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none z-10">
                <div id="b-suspense" class="text-red-500 text-xl md:text-3xl font-black tracking-[0.2em] uppercase opacity-0 transition-opacity duration-1000 w-full text-center">И победитель...</div>
              </div>

              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none z-10">
                <div id="b-winner" class="opacity-0 transition-all duration-1000 transform scale-95 w-full text-center">
                   <div class="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-4">Лауреат премии</div>
                   <div id="b-winner-name" class="text-white text-3xl md:text-5xl lg:text-6xl font-serif leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>
            </div>

            <div id="broadcast-final" class="w-full relative z-10 opacity-0 pointer-events-none transition-opacity duration-1000 absolute inset-0 p-6 md:p-12 bg-zinc-950 overflow-y-auto">
              <h2 class="text-3xl md:text-5xl font-black font-serif text-white uppercase tracking-tight mb-8 relative z-10 text-center drop-shadow-lg">
                ПОБЕДИТЕЛИ <span class="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800">AWARDS 2026</span>
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10" id="final-winners-grid">
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Initialize broadcast logic after DOM update
  const btnStart = document.getElementById("start-broadcast-btn");
  const intro = document.getElementById("broadcast-intro");
  const screen = document.getElementById("broadcast-screen");
  const final = document.getElementById("broadcast-final");
  const broadcastStatusText = document.getElementById("broadcast-status-text");

  const START_TIME = new Date("2026-06-16T18:00:00Z").getTime();
  const END_TIME = new Date("2026-06-16T18:01:50Z").getTime();
  let timerInterval = null;

  function showFinalGridFromData(data) {
    if (intro) intro.style.display = 'none';
    if (screen) screen.style.display = 'none';
    
    const grid = document.getElementById("final-winners-grid");
    if (grid) {
      grid.innerHTML = data.map(cat => `
        <div class="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 shadow-xl transition-all duration-500 rounded-2xl p-6 md:p-8 relative group overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black mb-3 relative z-10">Лауреат премии</div>
          <h3 class="text-xl md:text-2xl font-black font-serif text-white mb-1 tracking-tight relative z-10 group-hover:text-red-500 transition-colors">${cat.title}</h3>
          <p class="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 relative z-10">${cat.desc}</p>
          <div class="pt-5 border-t border-zinc-900 relative z-10">
            <span class="text-white font-serif italic text-lg md:text-xl leading-tight drop-shadow-sm">${cat.winner}</span>
          </div>
        </div>
      `).join('');
    }
    
    if (final) {
      final.classList.remove("absolute", "inset-0", "opacity-0", "pointer-events-none");
      final.classList.add("relative", "opacity-100");
    }
  }

  function checkBroadcastTime() {
    const now = Date.now();
    const hasWatched = localStorage.getItem("huev_2026_watched");

    if (now >= END_TIME) {
      if (timerInterval) clearInterval(timerInterval);
      if (hasWatched) {
        showFinalGridFromData(categoriesData);
      } else {
        if (btnStart) btnStart.style.display = 'inline-flex';
        if (broadcastStatusText) broadcastStatusText.innerText = "Голосование завершено. Вы можете посмотреть запись трансляции результатов.";
      }
    } else if (now >= START_TIME && now < END_TIME) {
      if (timerInterval) clearInterval(timerInterval);
      if (intro && !intro.classList.contains("opacity-0") && intro.style.display !== 'none') {
        runBroadcast(categoriesData);
      }
    } else {
      if (btnStart) btnStart.style.display = 'none';
      const diff = START_TIME - now;
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (broadcastStatusText) {
        broadcastStatusText.innerHTML = `Прямая трансляция результатов начнется через <strong>${m}:${s.toString().padStart(2, '0')}</strong><br><span class="text-xs text-zinc-600 mt-2 block uppercase tracking-widest">Не уходите со страницы</span>`;
      }
    }
  }

  if (Date.now() < END_TIME) {
    timerInterval = setInterval(checkBroadcastTime, 1000);
  }
  checkBroadcastTime();

  if (btnStart) {
    btnStart.addEventListener("click", () => {
      runBroadcast(categoriesData);
    });
  }

  function runBroadcast(data) {
    const intro = document.getElementById("broadcast-intro");
    const screen = document.getElementById("broadcast-screen");
    const final = document.getElementById("broadcast-final");
    
    // elements
    const elCatTitle = document.getElementById("b-category-title");
    const elNominees = document.getElementById("b-nominees");
    const elSuspense = document.getElementById("b-suspense");
    const elWinner = document.getElementById("b-winner");
    const elWinnerName = document.getElementById("b-winner-name");

    // hide intro, show screen
    intro.classList.replace("opacity-100", "opacity-0");
    intro.classList.add("pointer-events-none");
    
    setTimeout(() => {
      intro.style.display = 'none';
      screen.classList.replace("opacity-0", "opacity-100");
    }, 1000);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const playCategory = async (cat) => {
      // Show Category Title
      elCatTitle.innerHTML = `<span class="text-zinc-500 text-sm md:text-base font-bold uppercase tracking-widest block mb-2">${cat.desc}</span>${cat.title}`;
      elCatTitle.classList.replace("opacity-0", "opacity-100");
      elCatTitle.classList.replace("translate-y-4", "translate-y-0");
      
      await sleep(3000);
      
      elCatTitle.classList.replace("opacity-100", "opacity-0");
      elCatTitle.classList.replace("translate-y-0", "-translate-y-4");
      
      await sleep(1000);
      
      // Reset translation
      elCatTitle.classList.replace("-translate-y-4", "translate-y-4");

      // Show Nominees
      elNominees.innerHTML = '<div class="text-white text-xs md:text-sm font-bold uppercase tracking-widest mb-6 opacity-30">Номинанты:</div>' + cat.nominees.map(n => `<div class="opacity-80 scale-100 hover:scale-105 transition-transform">${n}</div>`).join('');
      elNominees.classList.replace("opacity-0", "opacity-100");
      
      await sleep(4000);
      
      elNominees.classList.replace("opacity-100", "opacity-0");
      
      await sleep(1000);

      // Show Suspense
      elSuspense.classList.replace("opacity-0", "opacity-100");
      
      await sleep(2500);
      
      elSuspense.classList.replace("opacity-100", "opacity-0");
      
      await sleep(1000);

      // Show Winner
      elWinnerName.innerText = cat.winner;
      elWinner.classList.replace("opacity-0", "opacity-100");
      elWinner.classList.replace("scale-95", "scale-100");
      
      await sleep(4500);
      
      elWinner.classList.replace("opacity-100", "opacity-0");
      elWinner.classList.replace("scale-100", "scale-95");
      
      await sleep(1000);
    };

    const playAll = async () => {
      await sleep(1000); // initial wait after screen fades in
      for (let i = 0; i < data.length; i++) {
        await playCategory(data[i]);
      }
      
      // End of broadcast, show final grid
      screen.classList.replace("opacity-100", "opacity-0");
      
      await sleep(1000);
      screen.style.display = "none";
      
      const grid = document.getElementById("final-winners-grid");
      grid.innerHTML = data.map(cat => `
        <div class="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 shadow-xl transition-all duration-500 rounded-2xl p-6 md:p-8 relative group overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-zinc-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black mb-3 relative z-10">Лауреат премии</div>
          <h3 class="text-xl md:text-2xl font-black font-serif text-white mb-1 tracking-tight relative z-10 group-hover:text-red-500 transition-colors">${cat.title}</h3>
          <p class="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 relative z-10">${cat.desc}</p>
          <div class="pt-5 border-t border-zinc-900 relative z-10">
            <span class="text-white font-serif italic text-lg md:text-xl leading-tight drop-shadow-sm">${cat.winner}</span>
          </div>
        </div>
      `).join('');
      
      final.classList.remove("absolute", "inset-0");
      final.classList.add("relative");
      final.classList.replace("opacity-0", "opacity-100");
      final.classList.remove("pointer-events-none");
      
      localStorage.setItem("huev_2026_watched", "true");
    };

    playAll();
  }
  window.scrollTo(0, 0);
}
