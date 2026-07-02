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
      <!-- Huevision Event Banner -->
      <a href="#/huevision-2026" class="group block relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-red-900/30 transition-colors duration-500">
        
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden scale-110 group-hover:scale-100 transition-transform duration-700 delay-75">
           <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]"></div>
        </div>

        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white drop-shadow-sm">
          <div class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 font-mono flex items-center gap-2">
             <span class="inline-block w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></span>
             Завершен
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight tracking-tight group-hover:scale-105 transition-transform duration-500 bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            HUEVISION
          </h2>
          <p class="mt-1 text-sm md:text-base font-black text-red-600 tracking-[0.2em] uppercase flex items-center gap-2 justify-center drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            CONTEST
          </p>
          <p class="mt-1 text-xs font-bold text-red-600 tracking-[0.3em] uppercase flex items-center justify-center before:content-[''] before:w-8 before:h-[1px] before:bg-red-600 before:mr-3 after:content-[''] after:w-8 after:h-[1px] after:bg-red-600 after:ml-3 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
            2026
          </p>
        </div>
      </a>

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
      
      <!-- My Global Review Event Banner -->
      <a href="#/my-global-review" class="group block relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-black border border-blue-900/30 transition-colors duration-500">
        
        <div class="absolute inset-0 z-0">
          <img src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUybzVwanZmdWNrMnhvdThxZGF0Zm13eGxzOThnemF0d2d2bHgyZGY1cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7aCTfyhYawdOXcFW/200.gif" class="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="My Global Review bg" style="object-position: center 30%;" />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white drop-shadow-sm">
          <div class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 font-mono flex items-center gap-2">
             <span class="inline-block w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></span>
             Завершен
          </div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight tracking-tight group-hover:scale-105 transition-transform duration-500 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            MY GLOBAL REVIEW
          </h2>
          <p class="mt-2 text-sm font-bold text-blue-400 tracking-[0.2em] uppercase flex items-center justify-center drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
            РЕЗУЛЬТАТЫ
          </p>
        </div>
      </a>
    </div>
  `;

  html += `</div>`;
  app.innerHTML = html;
}
