export function renderArchive() {
  const app = document.getElementById("app");
  window.scrollTo(0, 0);

  let html = `<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up">`;
  html += `
    <div class="mb-12 border-b-2 border-black dark:border-white pb-6 flex items-center gap-4">
      <a href="#/" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </a>
      <h1 class="font-serif font-black text-4xl sm:text-5xl uppercase tracking-tighter text-zinc-900 dark:text-white">Архив ивентов</h1>
    </div>
  `;

  html += `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- HueFork Madness Event Banner -->
      <a href="#/madness" class="group block relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
        
        <div class="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-40 gap-4 sm:gap-8 pointer-events-none overflow-hidden scale-110 group-hover:scale-100 transition-transform duration-700 delay-75">
           <div class="flex flex-col gap-6 sm:gap-12">
              <div class="w-12 h-6 sm:w-16 sm:h-8 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
              <div class="w-12 h-6 sm:w-16 sm:h-8 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
           </div>
           <div class="flex flex-col gap-12 sm:gap-24 ml-4 sm:ml-8">
              <div class="w-12 h-6 sm:w-16 sm:h-8 border-r-2 border-t-2 border-b-2 border-black dark:border-white rounded-r"></div>
           </div>
           <div class="ml-4 sm:ml-8 flex items-center h-full">
              <div class="w-12 h-8 sm:w-16 sm:h-12 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">WIN</div>
           </div>
        </div>

        <div class="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-white via-white/80 dark:from-zinc-950 dark:via-zinc-950/80 to-transparent">
           <div class="flex items-center justify-between w-full">
              <div>
                 <div class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 font-mono flex items-center gap-2">
                    <span class="inline-block w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></span>
                    Завершен
                 </div>
                 <h2 class="font-serif font-black text-3xl sm:text-4xl lg:text-5xl tracking-tighter text-zinc-900 dark:text-white uppercase leading-none drop-shadow-sm group-hover:text-red-500 transition-colors">
                    HueFork Madness
                 </h2>
              </div>
              <div class="bg-black dark:bg-white text-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all shadow-xl">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                 </svg>
              </div>
           </div>
        </div>
      </a>
    </div>
  `;

  html += `</div>`;
  app.innerHTML = html;
}
