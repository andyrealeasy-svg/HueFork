const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Закрытый профиль</span>`;

const insertion = `                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Показывать статистику</span>
                       <div class="relative">
                          <input type="checkbox" id="settings-show-stats" class="sr-only" \${data.showStats !== false ? 'checked' : ''}>
                          <div class="block bg-zinc-200 dark:bg-zinc-800 w-10 h-6 rounded-full transition-colors toggle-bg"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot \${data.showStats !== false ? 'translate-x-4' : ''}"></div>
                       </div>
                    </label>
                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Закрытый профиль</span>`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
