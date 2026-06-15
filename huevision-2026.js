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

  // Voting
  html += `
        <section class="animate-slide-up" style="animation-delay: 150ms;">
          <div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div class="absolute -top-32 -right-32 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 class="text-3xl md:text-5xl font-black font-serif text-white uppercase tracking-tight mb-3 relative z-10 text-center">
              AWARDS <span class="text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-700">2026</span>
            </h2>
            <p class="text-zinc-400 text-center font-medium mb-10 relative z-10 text-sm md:text-base">
              Проголосуй за лучшие (и не очень) моменты конкурса!
            </p>

            <form id="huevision-vote-form" class="space-y-8 md:space-y-12 relative z-10">
  `;

  // Categories
  const categories = [
    {
      id: "nightmares",
      title: "«Спонсор моих кошмаров»",
      desc: "За самый экспериментальный трек",
      options: [
        { label: "Dollova — BIKINI", value: "dollova-bikini" },
        { label: "Pavlova Cookie — даяизворонежа", value: "cookie-daya" },
        { label: "SiCka — Revō", value: "sicka-revo" },
        { label: "Ksivat — Song #1", value: "ksivat-song1" }
      ]
    },
    {
      id: "hidden_gem",
      title: "«Скрытый бриллиант»",
      desc: "За самый недооценённый трек",
      options: [
        { label: "Dollova — BIKINI", value: "dollova-bikini" },
        { label: "Pavlova Cookie — даяизворонежа", value: "cookie-daya" },
        { label: "SiCka — Revō", value: "sicka-revo" },
        { label: "Ksivat — Song #1", value: "ksivat-song1" }
      ]
    },
    {
      id: "banger",
      title: "«Бэнгер»",
      desc: "За трек, который заел в голове надолго",
      options: [
        { label: "Dollova — BIKINI", value: "dollova-bikini" },
        { label: "Pavlova Cookie — даяизворонежа", value: "cookie-daya" },
        { label: "SiCka — Revō", value: "sicka-revo" },
        { label: "Ksivat — Song #1", value: "ksivat-song1" }
      ]
    },
    {
      id: "no_logic",
      title: "«Нет — здравому смыслу»",
      desc: "За текст",
      options: [
        { label: "Dollova — BIKINI", value: "dollova-bikini" },
        { label: "Pavlova Cookie — даяизворонежа", value: "cookie-daya" },
        { label: "SiCka — Revō", value: "sicka-revo" },
        { label: "Ksivat — Song #1", value: "ksivat-song1" }
      ]
    },
    {
      id: "performer",
      title: "«Performer You Are»",
      desc: "За лучший перформанс",
      options: [
        { label: "Dollova — BIKINI", value: "dollova-bikini" },
        { label: "Pavlova Cookie — даяизворонежа", value: "cookie-daya" },
        { label: "SiCka — Revō", value: "sicka-revo" },
        { label: "Ksivat — Song #1", value: "ksivat-song1" }
      ]
    },
    {
      id: "bad_moment",
      title: "«Хуйово»",
      desc: "За неудавшийся момент",
      options: [
        { label: "Наковальня Ksivat во время выступления SiCka", value: "nakovalnya" },
        { label: "Ksivat сломала ногу", value: "leg-break" },
        { label: "Сцена Pavlova Cookie", value: "cookie-stage" },
        { label: "Dollova утонула", value: "dollova-drowned" }
      ]
    }
  ];

  categories.forEach(cat => {
    html += `
              <div class="bg-black border border-zinc-800 rounded-2xl p-6 md:p-8">
                <div class="mb-5">
                  <h3 class="text-xl md:text-2xl font-black font-serif text-white mb-2 tracking-tight">${cat.title}</h3>
                  <p class="text-red-600 text-[10px] md:text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">${cat.desc}</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    `;
    cat.options.forEach(opt => {
      html += `
                  <label class="cursor-pointer group flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-all has-[:checked]:bg-red-950/20 has-[:checked]:border-red-600/50">
                    <input type="radio" name="${cat.id}" value="${opt.value}" class="peer sr-only" required>
                    <div class="w-5 h-5 rounded-full border-2 border-zinc-600 peer-checked:border-red-600 peer-checked:bg-red-600 flex items-center justify-center transition-all flex-shrink-0">
                      <div class="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span class="text-sm font-medium text-zinc-300 group-hover:text-white peer-checked:text-white transition-colors">${opt.label}</span>
                  </label>
      `;
    });
    html += `
                </div>
              </div>
    `;
  });

  html += `
              <button type="submit" id="submit-votes-btn" class="w-full bg-white text-black font-black uppercase text-sm md:text-base tracking-widest py-5 md:py-6 px-10 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 shadow-xl group relative flex justify-center items-center">
                <span class="relative z-10">Отправить голоса</span>
              </button>
              <div id="vote-form-status" class="text-center font-bold text-[10px] md:text-xs tracking-widest uppercase hidden mt-4"></div>
            </form>
          </div>
        </section>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Add event listener for voting
  const form = document.getElementById("huevision-vote-form");
  const submitBtn = document.getElementById("submit-votes-btn");
  const formStatus = document.getElementById("vote-form-status");

  // TO DO FOR USER:
  // 1. Create a Google Apps Script that accepts POST requests
  // 2. Paste the Script Deployment URL down below in \`SCRIPT_URL\`
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlLTchpQb2G8RpSsifCZ-en0Dh7wUckEL3aWXw4YnHYspAgaMi_w8ccbA6Z0_VBb4e/exec";

  const savedVote = localStorage.getItem("huevision_2026_voted");
  if (savedVote) {
    let resultHtml = `
      <div class="text-center p-8 md:p-12 bg-black rounded-2xl border border-zinc-800 mb-8">
        <h3 class="text-xl md:text-2xl font-black font-serif text-white mb-2 tracking-tight uppercase">Голос уже учтен</h3>
        <p class="text-zinc-500 font-medium text-sm md:text-base">Вы уже проголосовали. Спасибо за участие!</p>
      </div>
    `;
    try {
      const data = JSON.parse(savedVote);
      if (typeof data === "object" && data !== null) {
        resultHtml += `
          <div class="space-y-3">
            <h4 class="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">Ваши ответы:</h4>
        `;
        categories.forEach(cat => {
          const val = data[cat.id];
          const opt = cat.options.find(o => o.value === val);
          const label = opt ? opt.label : '—';
          resultHtml += `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl gap-2 hover:border-zinc-700 transition-colors">
               <span class="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">${cat.title}</span>
               <span class="text-zinc-200 font-medium text-sm">${label}</span>
            </div>
          `;
        });
        resultHtml += `</div>`;
      }
    } catch(e) {
      // legacy support for string "true"
    }
    form.innerHTML = resultHtml;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!SCRIPT_URL) {
      formStatus.innerText = "Внимание: Вставьте SCRIPT_URL в код для отправки данных (main.js/huevision.js).";
      formStatus.className = "text-center font-bold text-[10px] md:text-xs tracking-widest uppercase mt-6 text-yellow-500 block";
      return;
    }

    if (localStorage.getItem("huevision_2026_voted")) {
       return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Отправляется...";
    submitBtn.className = "w-full bg-zinc-800 text-zinc-500 font-black uppercase text-sm md:text-base tracking-widest py-5 md:py-6 px-10 rounded-xl cursor-not-allowed";

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // So it doesn't fail due to CORS on simple posts
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      localStorage.setItem("huevision_2026_voted", JSON.stringify(data));
      
      let resultHtml = `
        <div class="text-center p-8 md:p-12 bg-black rounded-2xl border border-red-900/50 mb-8">
          <h3 class="text-xl md:text-2xl font-black font-serif text-white mb-2 tracking-tight uppercase">Голос учтен!</h3>
          <p class="text-zinc-400 font-medium text-sm md:text-base">Спасибо, ваши ответы отправлены.</p>
        </div>
        <div class="space-y-3">
          <h4 class="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">Ваши ответы:</h4>
      `;
      categories.forEach(cat => {
        const val = data[cat.id];
        const opt = cat.options.find(o => o.value === val);
        const label = opt ? opt.label : '—';
        resultHtml += `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl gap-2 hover:border-zinc-700 transition-colors">
             <span class="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">${cat.title}</span>
             <span class="text-zinc-200 font-medium text-sm">${label}</span>
          </div>
        `;
      });
      resultHtml += `</div>`;
      form.innerHTML = resultHtml;
    } catch (err) {
      console.error(err);
      formStatus.innerText = "Произошла ошибка при отправке.";
      formStatus.className = "text-center font-bold text-[10px] md:text-xs tracking-widest uppercase mt-6 text-red-500 block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Отправить голоса";
      submitBtn.className = "w-full bg-white text-black font-black uppercase text-sm md:text-base tracking-widest py-5 md:py-6 px-10 rounded-xl hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 shadow-xl group relative flex justify-center items-center";
    }
  });

  window.scrollTo(0, 0);
}
