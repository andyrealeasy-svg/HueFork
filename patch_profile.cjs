const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const oldHtml = `                 <div class="space-y-3">
                    <button class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left" onclick="appAlert('Эта функция пока недоступна')">Смена ника</button>
                    <button class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left" onclick="appAlert('Эта функция пока недоступна')">Смена пароля</button>
                    <button class="w-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left" onclick="appAlert('Эта функция пока недоступна')">Удаление / заморозка аккаунта</button>
                 </div>`;

const newHtml = `                 <div class="space-y-3">
                    <button id="btn-change-username" class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Смена ника</button>
                    <button id="btn-change-password" class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Смена пароля</button>
                    <button id="btn-delete-account" class="w-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Удаление / заморозка аккаунта</button>
                 </div>`;

code = code.replace(oldHtml, newHtml);
fs.writeFileSync('profile.js', code);
