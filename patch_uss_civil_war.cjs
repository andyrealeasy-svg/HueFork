const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const oldRenderEventPageStart = `function renderEventPage(data, user) {
  const app = document.getElementById("app");
  const initial = user.username.charAt(0).toUpperCase();
  const dateFormatted = new Date(data.date).toLocaleDateString('ru-RU');

  app.innerHTML = \`
    <div id="uss-wrapper" class="max-w-4xl mx-auto px-4 py-12 animate-slide-up pb-32">`;

const newRenderEventPageStart = `function renderEventPage(data, user) {
  const app = document.getElementById("app");
  const initial = user.username.charAt(0).toUpperCase();
  const dateFormatted = new Date(data.date).toLocaleDateString('ru-RU');

  const isDeported = data.deported === true;
  const deportationBanner = isDeported ? \`<div class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div class="border-4 border-red-600 text-red-600 font-black text-3xl sm:text-5xl uppercase tracking-widest px-8 py-2 transform -rotate-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl">ДЕПОРТИРОВАН</div>
      </div>\` : '';
      
  const ransomHtml = isDeported ? \`
      <div class="max-w-2xl mx-auto text-center mb-16 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl p-6 shadow-sm">
         <h3 class="font-black text-xl text-red-800 dark:text-red-500 uppercase tracking-widest mb-4">Вы были депортированы</h3>
         <p class="text-zinc-700 dark:text-zinc-300 mb-6 text-sm">Вы отдали голосов больше чужим идеологиям, чем своей. Ваша грин-карта аннулирована. Выкупить право на участие в следующих фазах можно за 50 HueCoins.</p>
         <button id="btn-ransom" class="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-red-700 transition-colors shadow-md">
            Заплатить 50 HC
         </button>
      </div>\` : '';

  app.innerHTML = \`
    <div id="uss-wrapper" class="max-w-4xl mx-auto px-4 py-12 animate-slide-up pb-32">`;

code = code.replace(oldRenderEventPageStart, newRenderEventPageStart);

const oldCardStart = `<div class="bg-[#d5e8d4] dark:bg-[#2d3a2e] border-2 border-[#82b366] dark:border-[#527a3e] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-10 mx-auto max-w-3xl transform rotate-1 hover:rotate-0 transition-transform duration-500 text-black dark:text-white">`;

const newCardStart = `<div class="bg-[#d5e8d4] dark:bg-[#2d3a2e] border-2 border-[#82b366] dark:border-[#527a3e] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-10 mx-auto max-w-3xl transform rotate-1 hover:rotate-0 transition-transform duration-500 text-black dark:text-white">
          \${deportationBanner}`;

code = code.replace(oldCardStart, newCardStart);

const oldTimelineStart = `      <!-- Timeline -->
      <div class="text-center mb-8">`;
      
const newTimelineStart = `      \${ransomHtml}
      <!-- Timeline -->
      <div class="text-center mb-8">`;

code = code.replace(oldTimelineStart, newTimelineStart);

fs.writeFileSync('uss-civil-war.js', code);
