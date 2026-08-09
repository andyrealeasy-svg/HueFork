const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const phase2Old = `        <!-- Phase 2 -->
        <div class="relative flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12 sm:mb-16 gap-6 sm:gap-0 opacity-50 grayscale">
          <div class="hidden sm:block sm:w-[45%] order-1 text-right pr-8"></div>
          <div class="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-zinc-400 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white z-10 shadow-lg order-1 sm:order-2">
            <span class="font-black text-lg">2</span>
          </div>
          <div class="w-full sm:w-[45%] text-left pl-12 sm:pl-8 order-2 sm:order-3">
             <h3 class="font-black text-xl text-zinc-600 uppercase tracking-widest mb-2">Фаза 2</h3>
             <p class="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Засекречено. Ожидайте дальнейших указаний.</p>
          </div>
        </div>`;

const phase2New = `        <!-- Phase 2 -->
        <div class="relative flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12 sm:mb-16 gap-6 sm:gap-0">
          <div class="hidden sm:block sm:w-[45%] order-1 text-right pr-8"></div>
          <div class="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-red-800 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white z-10 shadow-lg order-1 sm:order-2">
            <span class="font-black text-lg">2</span>
          </div>
          <div class="w-full sm:w-[45%] text-left pl-12 sm:pl-8 order-2 sm:order-3">
             <h3 class="font-black text-xl text-red-800 uppercase tracking-widest mb-2">Фаза 2</h3>
             <p class="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4">Выборы и борьба за территории. Распределите свои голоса между штатами.</p>
             <button id="btn-open-map" class="inline-flex bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-md">
               Карта штатов
             </button>
          </div>
        </div>`;

code = code.replace(phase2Old, phase2New);
fs.writeFileSync('uss-civil-war.js', code);
