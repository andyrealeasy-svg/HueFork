export function renderMyGlobalReview() {
  const app = document.getElementById("app");
  window.scrollTo(0, 0);

  let html = `<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up">`;
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
    <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div class="relative w-48 h-48 sm:w-64 sm:h-64 mb-8">
        <!-- Paper and Pen Design -->
        <div class="absolute inset-0 bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 transform -rotate-3 rounded-lg flex flex-col justify-between p-4">
          <div class="w-full h-px bg-red-500/30 mb-2"></div>
          <div class="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <div class="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <div class="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <div class="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
          <div class="w-full h-px bg-zinc-300 dark:bg-zinc-700"></div>
        </div>
        <div class="absolute -right-4 -bottom-4 w-12 h-32 bg-gradient-to-b from-zinc-800 to-black dark:from-zinc-300 dark:to-white transform rotate-12 rounded-t-full shadow-2xl flex items-end justify-center pb-2">
          <!-- Pen Tip -->
          <div class="w-4 h-6 border-b-8 border-transparent border-t-zinc-400 dark:border-t-zinc-600"></div>
        </div>
      </div>
      
      <h2 class="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase drop-shadow-md text-zinc-900 dark:text-white mb-4 animate-pulse">
        Скоро
      </h2>
      <p class="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-serif max-w-lg mb-8">
        Готовьте свои ручки и черновики. Грядет самый масштабный обзор в истории HueFork.
      </p>

      <a href="#/" class="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded shadow-lg">
        На главную
      </a>
    </div>
  </div>`;

  app.innerHTML = html;
}
