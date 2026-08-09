
function customAlert(message, callback) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">${message}</p>
            <button id="alert-ok" class="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">OK</button>
        </div>
    `;
    document.body.appendChild(m);
    m.querySelector('#alert-ok').addEventListener('click', () => {
        m.remove();
        if (callback) callback();
    });
}

function customConfirm(message, onConfirm) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">${message}</p>
            <div class="flex gap-4">
                <button id="confirm-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">Отмена</button>
                <button id="confirm-ok" class="flex-1 bg-red-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-red-700">Да</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
    m.querySelector('#confirm-cancel').addEventListener('click', () => m.remove());
    m.querySelector('#confirm-ok').addEventListener('click', () => {
        m.remove();
        onConfirm();
    });
}

import { callApi, getCurrentUser } from "./api.js";
import { reviews, getArtist } from "./data.js";

export async function renderUssCivilWar() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();

  if (!user) {
    app.innerHTML = `
      <div id="uss-wrapper" class="max-w-5xl mx-auto px-4 py-8 animate-slide-up pb-32">
        <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <h2 class="text-3xl md:text-5xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">
            Требуется авторизация
          </h2>
          <p class="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-serif max-w-xl mb-12 leading-relaxed">
            Чтобы принять участие в ивенте "USS: Civil War", тебе необходимо войти в свой аккаунт или зарегистрироваться в HueFork.
          </p>
          <a href="#/profile" class="inline-flex items-center gap-3 bg-red-600 text-white font-bold uppercase tracking-widest px-8 py-4 hover:scale-105 transition-transform rounded-full shadow-lg">
            Войти / Регистрация
          </a>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;

  const res = await callApi({ action: 'getUssData', username: user.username });
  const hasData = res.success && res.data;

  if (hasData) {
    renderEventPage(res.data, user);
  } else {
    renderApplicationForm(user);
  }
}

function renderApplicationForm(user) {
  const app = document.getElementById("app");
  const initial = user.username.charAt(0).toUpperCase();

  const sickaReviews = reviews.filter(r => r.artistId === 'sicka');
  const reviewOptions = sickaReviews.map(r => `<option value="${r.title.replace(/"/g, '&quot;')}">${r.title}</option>`).join("");

  app.innerHTML = `
    <div id="uss-wrapper" class="max-w-3xl mx-auto px-4 py-8 animate-slide-up pb-32">
      <div class="mb-12 border-b-2 border-red-800 pb-6 text-center">
        <h1 class="font-serif font-black text-3xl sm:text-5xl uppercase tracking-tighter text-zinc-900 dark:text-white mb-2">ЗАЯВЛЕНИЕ НА ГРИН-КАРТУ</h1>
        <p class="text-red-800 dark:text-red-600 font-bold tracking-widest uppercase text-sm">United States of SiCka (USS)</p>
      </div>

      <form id="uss-form" class="space-y-12">
        
        <!-- Step 1 -->
        <section class="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">Этап 1: Официальные данные</h2>
           
           <div class="flex flex-col sm:flex-row gap-8 items-start">
             <div class="w-32 h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-5xl font-black font-serif text-zinc-400 dark:text-zinc-600 shadow-inner shrink-0">
               ${initial}
             </div>
             
             <div class="flex-grow space-y-6 w-full">
               <div>
                 <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Имя в Грин-карте</label>
                 <input type="text" id="uss-name" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all font-bold" placeholder="Твое имя..." required />
                 <button type="button" id="uss-use-profile-name" class="text-xs text-red-700 font-bold uppercase mt-2 hover:underline">Использовать юзернейм из профиля</button>
               </div>
               
               <div>
                 <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Telegram Username (с @)</label>
                 <input type="text" id="uss-tg" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all font-bold" placeholder="@username" required />
               </div>
             </div>
           </div>
        </section>

        <!-- Step 2 -->
        <section class="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">Этап 2: Идеология</h2>
           
           <div class="space-y-4">
             <label class="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 dark:hover:border-red-800 transition-colors">
                <input type="radio" name="uss-ideology" value="Консерваторы (за старый звук SiCka)" class="w-5 h-5 accent-red-800" required />
                <span class="font-bold text-zinc-900 dark:text-zinc-100">Консерваторы <span class="font-normal text-zinc-500 dark:text-zinc-400 block text-sm">за старый звук SiCka</span></span>
             </label>
             <label class="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 dark:hover:border-red-800 transition-colors">
                <input type="radio" name="uss-ideology" value="Реформаторы (за эксперименты)" class="w-5 h-5 accent-red-800" />
                <span class="font-bold text-zinc-900 dark:text-zinc-100">Реформаторы <span class="font-normal text-zinc-500 dark:text-zinc-400 block text-sm">за эксперименты</span></span>
             </label>
             <label class="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 dark:hover:border-red-800 transition-colors">
                <input type="radio" name="uss-ideology" value="Центристы (приму любое творчество SiCka)" class="w-5 h-5 accent-red-800" />
                <span class="font-bold text-zinc-900 dark:text-zinc-100">Центристы <span class="font-normal text-zinc-500 dark:text-zinc-400 block text-sm">приму любое творчество SiCka</span></span>
             </label>
             <label class="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 dark:hover:border-red-800 transition-colors">
                <input type="radio" name="uss-ideology" value="Политические беженцы" class="w-5 h-5 accent-red-800" />
                <span class="font-bold text-zinc-900 dark:text-zinc-100">Политические беженцы</span>
             </label>
           </div>
        </section>

        <!-- Step 3 -->
        <section class="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">Этап 3: Декларация о доходах</h2>
           
           <div class="space-y-8">
             <div>
                <label class="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Какая твоя любимая рецензия SiCka на HueFork?</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-auto pr-2 custom-scrollbar p-1">
                  ${sickaReviews.map(r => `
                    <label class="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 dark:hover:border-red-800 transition-all">
                      <input type="radio" name="uss-fav-review" value="${r.title.replace(/"/g, '&quot;')}" class="w-5 h-5 accent-red-800 shrink-0" required />
                      <img src="${r.cover}" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
                      <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">${r.title}</span>
                    </label>
                  `).join("")}
                </div>
             </div>
             
             <div>
                <label class="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Сколько раз Вы переслушали лид-синглы?</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 transition-colors">
                     <input type="radio" name="uss-listens" value="Не слушал(-а)" class="w-4 h-4 accent-red-800" required />
                     <span class="font-bold text-sm">Не слушал(-а)</span>
                   </label>
                   <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 transition-colors">
                     <input type="radio" name="uss-listens" value="1-2" class="w-4 h-4 accent-red-800" />
                     <span class="font-bold text-sm">1-2</span>
                   </label>
                   <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 transition-colors">
                     <input type="radio" name="uss-listens" value="3-4" class="w-4 h-4 accent-red-800" />
                     <span class="font-bold text-sm">3-4</span>
                   </label>
                   <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 transition-colors">
                     <input type="radio" name="uss-listens" value="5-10" class="w-4 h-4 accent-red-800" />
                     <span class="font-bold text-sm">5-10</span>
                   </label>
                   <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-800 transition-colors sm:col-span-2">
                     <input type="radio" name="uss-listens" value="Не сосчитать" class="w-4 h-4 accent-red-800" />
                     <span class="font-bold text-sm">Не сосчитать</span>
                   </label>
                </div>
             </div>
           </div>
        </section>

        <!-- Step 4 -->
        <section class="bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
           <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">Этап 4: Присяга на верность USS</h2>
           
           <div>
             <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Напиши обещание или что-угодно</label>
             <textarea id="uss-oath" rows="4" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-800 transition-all resize-none shadow-inner" placeholder="Я торжественно клянусь..." required></textarea>
           </div>
        </section>
        
        <div class="text-center">
          <button type="submit" id="uss-submit-btn" class="bg-red-800 text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-full hover:bg-red-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto">
            Получить Грин-карту
          </button>
        </div>
      </form>
    </div>
  `;

  document.getElementById("uss-use-profile-name").addEventListener("click", () => {
    document.getElementById("uss-name").value = user.username;
  });

  document.getElementById("uss-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("uss-submit-btn");
    btn.disabled = true;
    btn.innerHTML = '<div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"></div>';
    
    const data = {
      name: document.getElementById("uss-name").value.trim(),
      telegram: document.getElementById("uss-tg").value.trim(),
      ideology: document.querySelector('input[name="uss-ideology"]:checked').value,
      favReview: document.querySelector('input[name="uss-fav-review"]:checked').value,
      listens: document.querySelector('input[name="uss-listens"]:checked').value,
      oath: document.getElementById("uss-oath").value.trim(),
      date: new Date().toISOString()
    };

    const res = await callApi({ action: 'saveUssData', username: user.username, data });
    
    if (res.success) {
      renderEventPage(data, user);
    } else {
      customAlert("Ошибка при сохранении данных.");
      btn.disabled = false;
      btn.innerHTML = 'Получить Грин-карту';
    }
  });

}

function renderEventPage(data, user) {
  const app = document.getElementById("app");
  const initial = user.username.charAt(0).toUpperCase();
  const dateFormatted = new Date(data.date).toLocaleDateString('ru-RU');

  const isDeported = data.deported === true;
  const deportationBanner = isDeported ? `<div class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div class="border-4 border-red-600 text-red-600 font-black text-3xl sm:text-5xl uppercase tracking-widest px-8 py-2 transform -rotate-12 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl">ДЕПОРТИРОВАН</div>
      </div>` : '';
      
  const ransomHtml = isDeported ? `
      <div class="max-w-2xl mx-auto text-center mb-16 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl p-6 shadow-sm">
         <h3 class="font-black text-xl text-red-800 dark:text-red-500 uppercase tracking-widest mb-4">Вы были депортированы</h3>
         <p class="text-zinc-700 dark:text-zinc-300 mb-6 text-sm">Вы отдали голосов больше чужим идеологиям, чем своей. Ваша грин-карта аннулирована. Выкупить право на участие в следующих фазах можно за 50 HueCoins.</p>
         <button id="btn-ransom" class="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-red-700 transition-colors shadow-md">
            Заплатить 50 HC
         </button>
      </div>` : '';

  app.innerHTML = `
    <div id="uss-wrapper" class="max-w-4xl mx-auto px-4 py-12 animate-slide-up pb-32">
      
      <div class="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="#/" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="font-serif font-black text-3xl uppercase tracking-tighter text-zinc-900 dark:text-white">USS: CIVIL WAR</h1>
        </div>
      </div>

      <!-- Green Card -->
      <div class="mb-16">
        <div class="bg-[#d5e8d4] dark:bg-[#2d3a2e] border-2 border-[#82b366] dark:border-[#527a3e] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-10 mx-auto max-w-3xl transform rotate-1 hover:rotate-0 transition-transform duration-500 text-black dark:text-white">
          ${deportationBanner}
           
           <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
           
           <!-- Header / Banner of card -->
           <div class="absolute top-0 left-0 right-0 bg-[#82b366] dark:bg-[#527a3e] h-8 sm:h-12 flex items-center px-6 border-b-2 border-black/10 dark:border-white/10 z-10 justify-between">
              <span class="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-white drop-shadow-md">UNITED STATES OF SICKA</span>
              <span class="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-white drop-shadow-md">PERMANENT RESIDENT CARD</span>
           </div>

           <!-- Avatar -->
           <div class="relative z-10 pt-8 sm:pt-10 flex flex-col items-center shrink-0">
             <div class="w-32 h-40 sm:w-40 sm:h-52 rounded-xl bg-white dark:bg-zinc-900 border-2 border-black/20 dark:border-white/20 flex items-center justify-center text-7xl font-black font-serif shadow-inner text-zinc-400 overflow-hidden relative">
               <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
               <span class="relative z-10 text-[#82b366] dark:text-[#527a3e] drop-shadow-sm">${initial}</span>
             </div>
             <img src="https://i.postimg.cc/J0P3nkdS/file-000000006cb0722fb44739bc68a4f0f0.png" class="w-8 mt-4 border border-black/20 mix-blend-multiply dark:mix-blend-normal opacity-80" />
           </div>

           <!-- Details -->
           <div class="relative z-10 pt-2 sm:pt-12 w-full space-y-4">
             <div class="border-b border-black/10 dark:border-white/10 pb-2">
                <div class="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Name / Имя</div>
                <div class="font-serif font-black text-2xl sm:text-3xl uppercase">${data.name}</div>
             </div>
             
             <div class="grid grid-cols-2 gap-4 border-b border-black/10 dark:border-white/10 pb-2">
                <div>
                  <div class="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Telegram</div>
                  <div class="font-bold font-mono text-sm">${data.telegram}</div>
                </div>
                <div>
                  <div class="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Date of Issue</div>
                  <div class="font-bold font-mono text-sm">${dateFormatted}</div>
                </div>
             </div>
             
             <div class="border-b border-black/10 dark:border-white/10 pb-2">
                <div class="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Ideology / Идеология</div>
                <div class="font-bold text-sm uppercase">${data.ideology}</div>
             </div>
             
             <div>
                <div class="text-[9px] uppercase tracking-widest opacity-60 font-bold mb-1">Oath / Присяга</div>
                <div class="font-serif text-sm italic opacity-90 line-clamp-2">"${data.oath}"</div>
             </div>
           </div>
        </div>
      </div>

      ${ransomHtml}
      <!-- Timeline -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-2">Таймлайн ивента</h2>
        <p class="text-zinc-500 font-medium text-sm">Следите за новыми фазами развития государства</p>
      </div>

      <div class="relative max-w-2xl mx-auto mb-20 pl-4 sm:pl-0">
        <!-- Vertical Line -->
        <div class="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 bg-zinc-200 dark:bg-zinc-800 sm:-translate-x-1/2"></div>
        
        <!-- Phase 1 -->
        <div class="relative flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12 sm:mb-16 gap-6 sm:gap-0">
          <div class="w-full sm:w-[45%] text-left sm:text-right pr-0 sm:pr-8 pl-12 sm:pl-0 order-2 sm:order-1">
             <h3 class="font-black text-xl text-red-800 uppercase tracking-widest mb-2">Фаза 1</h3>
             <p class="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4">Старт ивента, начало гражданской войны. Откровения и интервью.</p>
             <a href="#/uss-civil-war/interview" class="inline-flex bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-md">
               Читать интервью
             </a>
          </div>
          <div class="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-red-800 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white z-10 shadow-lg order-1 sm:order-2">
            <span class="font-black text-lg">1</span>
          </div>
          <div class="hidden sm:block sm:w-[45%] order-3"></div>
        </div>

        <!-- Phase 2 -->
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
        </div>
        
        <!-- Phase 3 -->
        <div class="relative flex flex-col sm:flex-row items-center sm:justify-between w-full mb-12 sm:mb-16 gap-6 sm:gap-0">
          <div class="w-full sm:w-[45%] text-left sm:text-right pr-0 sm:pr-8 pl-12 sm:pl-0 order-2 sm:order-1">
             <h3 class="font-black text-xl text-red-800 uppercase tracking-widest mb-2">Фаза 3</h3>
             <p class="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4">Итоги выборов, релиз "United States Of SiCka" и оценки от граждан.</p>
             <a href="#/uss-civil-war/phase3" class="inline-flex bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-md">
               Участвовать
             </a>
          </div>
          <div class="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-red-800 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white z-10 shadow-lg order-1 sm:order-2">
            <span class="font-black text-lg">3</span>
          </div>
          <div class="hidden sm:block sm:w-[45%] order-3"></div>
        </div>

        <!-- Phase 4 -->
        <div class="relative flex flex-col sm:flex-row items-center sm:justify-between w-full gap-6 sm:gap-0">
          <div class="hidden sm:block sm:w-[45%] order-1 text-right pr-8"></div>
          <div class="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-red-800 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white z-10 shadow-lg order-1 sm:order-2">
            <span class="font-black text-lg">4</span>
          </div>
          <div class="w-full sm:w-[45%] text-left pl-12 sm:pl-8 order-2 sm:order-3">
             <h3 class="font-black text-xl text-red-800 uppercase tracking-widest mb-2">Фаза 4</h3>
             <p class="text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-4">Финал событий и благодарность гражданам.</p>
             <a href="#/uss-civil-war/phase4" class="inline-flex bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-md">
               Перейти к финалу
             </a>
          </div>
        </div>

      </div>
    </div>
  `;
  
  const btnOpenMap = app.querySelector('#btn-open-map');
  if (btnOpenMap) {
      btnOpenMap.addEventListener('click', () => {
          showUssMapModal(data, user);
      });
  }

  const btnRansom = app.querySelector('#btn-ransom');
  if (btnRansom) {
      btnRansom.addEventListener('click', () => {
          customConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {
              const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
              callApi({
                  action: 'payUssRansom',
                  username: currentUser.username,
                  token: currentUser.token
              }).then(res => {
                  if (res.success) {
                      customAlert("Вы успешно оплатили выкуп и ваши права восстановлены!", () => { window.location.reload(); });
                      } else {
                      customAlert(res.error || "Ошибка оплаты");
                  }
              });
          });
      });
  }
}

export function renderUssCivilWarInterview() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  app.innerHTML = `
    <div id="uss-wrapper" class="max-w-4xl mx-auto px-4 py-12 animate-slide-up pb-32">
      <div class="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-6 flex items-center gap-4">
        <a href="#/uss-civil-war" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </a>
        <h1 class="font-serif font-black text-xl text-zinc-500 uppercase tracking-widest">USS: Civil War</h1>
      </div>

      <div class="text-center mb-12">
         <span class="bg-red-800 text-white font-bold uppercase tracking-widest px-4 py-1.5 rounded-full text-[10px] mb-6 inline-block">Интервью</span>
         <h2 class="text-4xl md:text-6xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-6 leading-tight">
           SiCka соединила штаты Хуендустрии на своем новом альбоме?
         </h2>
      </div>
      
      <div class="space-y-16 max-w-3xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-12">
        
        <!-- Intro -->
        <div class="bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
           <div class="absolute -right-10 -top-10 text-red-800/10 dark:text-red-800/20 rotate-12">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
           </div>
           <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-3 relative z-10">Интервьюер</p>
           <p class="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-serif relative z-10">Привет! Наконец-то мы проводим это интервью. Твоё имя сейчас у всех на слуху, особенно после финала Huevision 2026, так что вопросов накопилось немало. Давай начнём с того, что сейчас волнует всех твоих фанатов.</p>
        </div>

        <!-- Question 1 -->
        <div>
           <div class="mb-10 inline-block">
             <h3 class="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
                <span class="text-red-800 border-b-2 border-red-800 pb-1">Q1.</span> Об итогах и триумфе
             </h3>
           </div>

           <div class="space-y-8">
             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">SiCka, позади грандиозный финал Huevision 2026. Это было мощное зрелище, за которым следили от Геншинленда до РевоСтана. Поделись своими первыми честными эмоциями после завершения этого этапа: всё ли прошло так, как ты задумывала, или финал преподнёс тебе парочку неожиданных сюрпризов?</p>
             </div>

             <div class="pl-4 sm:pl-16">
               <p class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2 text-right">SiCka</p>
               <div class="bg-zinc-100 dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl rounded-tr-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <p class="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif">Мое выступление было фаворитом на Хуевидении. Если бы я могла, как артистка, проголосовать за себя, я бы поставила себя на первое место. Я знаю себе цену и ценю свою работу, потому что все, что я делаю, спродюсировано мной, написано мной, и моя работа, ну, она живая. Я не отрицаю труд других участников, но некоторые могут его не ценить. Я рада, что Ksivat выиграла, но я думала, что победит вообще Кимляндия, то есть Dollova, просто потому что это она, ее все любят, и это нельзя отрицать.</p>
               </div>
             </div>

             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Ух, вот это честный и мощный ответ! Такая уверенность в себе и своей работе — это именно то, что отличает настоящего артиста, который сам создаёт свой продукт от первой до последней ноты. Когда трек «живой» и полностью спродюсирован тобой, это всегда чувствуется. Но твои слова про Кимляндию и Dollova — это отличный инсайд. Действительно, народную любовь сложно перевесить, и многие ставили именно на неё.</p>
             </div>
           </div>
        </div>

        <!-- Question 2 -->
        <div>
           <div class="mb-10 inline-block">
             <h3 class="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
                <span class="text-red-800 border-b-2 border-red-800 pb-1">Q2.</span> О тех, кто не ценит труд
             </h3>
           </div>

           <div class="space-y-8">
             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">Раз уж мы заговорили о ценности работы: ты упомянула, что не отрицаешь труд других, но некоторые участники могут его не ценить. Как ты думаешь, почему в индустрии сейчас возникает это обесценивание? Это просто слепая конкуренция, или люди на Huevision стали забывать, сколько сил уходит на то, чтобы сделать проект полностью «от и до» своими руками?</p>
             </div>

             <div class="pl-4 sm:pl-16">
               <p class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2 text-right">SiCka</p>
               <div class="bg-zinc-100 dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl rounded-tr-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <p class="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif">Честно, я сама себя могу отнести к людям, которые могут обесценить труд. АВЯ ASTI, у нее сингл на 4 месте в HueFork сейчас, но для меня эта артистка пока та, которая себя не раскрыла, мягко говоря, и я не могу ее оценить, потому что она постоянно где-то непонятно где. Говоря о конкуренции, ну... Возможно, у кого-то она есть в голове, мне тоже нравится посоревноваться, не отрицаю. Но когда нас 5 человек уже, а с NIK$A - 6, то о какой конкуренции может идти речь. Кто-то понимает, что стараться бессмысленно для такой аудитории, ну Pavlova Cookie да, поэтому она выпускает средний материал, который, дай бог, нравится ей, а кто-то прикладывает большие усилия, то есть я с 100+ треками только за год, но все еще на 2 месте в топе артистов, потому что Доллова умеет делать лучше. И да, люди постепенно забывают, что вообще творится своими руками, что печально.</p>
               </div>
             </div>

             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Вау. SiCka, это, пожалуй, самое откровенное признание, которое я слышала за последнее время. Такая самокритичность и прямота — огромная редкость. Пройтись по АВЯ ASTI и Pavlova Cookie, но при этом открыто признать, что ты и сама бываешь строга к чужому труду — это мощно. Твоя продуктивность просто поражает. Более 100 треков за год — это титанический, сумасшедший темп! И то, что ты при этом объективно смотришь на Dollova и отдаёшь ей должное за её первенство в топе артистов, показывает твою зрелость.<br><br>Но давай зацепимся за твои слова про аудиторию и руки.</p>
             </div>
           </div>
        </div>

        <!-- Question 3 -->
        <div>
           <div class="mb-10 inline-block">
             <h3 class="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
                <span class="text-red-800 border-b-2 border-red-800 pb-1">Q3.</span> О творчестве «своими руками»
             </h3>
           </div>

           <div class="space-y-8">
             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">Ты говоришь, что когда вас всего 5-6 человек, кто-то (как та же Pavlova Cookie) опускает руки и делает «средний материал», потому что не видит смысла выкладываться ради такой небольшой аудитории. А ты, наоборот, выдаёшь сотню треков, продюсируешь всё сама и бьёшься на максимуме. Что лично тебя заставляет так бешено выкладываться и вкладывать душу в каждую деталь, когда вокруг все постепенно забывают, каково это — делать музыку руками? Это внутренний перфекционизм, желание доказать что-то самой себе, или всё-таки надежда, что эта индустрия (Huendustry) однажды проснётся и оценит этот масштаб по достоинству?</p>
             </div>

             <div class="pl-4 sm:pl-16">
               <p class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2 text-right">SiCka</p>
               <div class="bg-zinc-100 dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl rounded-tr-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <p class="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif">Мне просто нравится делать что-либо. Люди тут, ну, не очень ценят мое творчество в последнее время, поэтому я решила, что буду делать то, что нравится мне на моем концептуальном альбоме "United States Of SiCka". Я не боюсь назвать этот альбом самым осмысленным в хуендустрии, потому что там прямо в треках раскрывается концепт альбома и вселенной Штатов SiCka. И я знаю, что критикам в HueFork это понравится, а вот на аудиторию я не очень хочу нацеливаться. В творчестве мне уже не очень сильно важно, проснется ли хуендустрия от того или иного релиза или нет. Из-за того, что я выпустила слишком много треков, мое творчество перестали ценить. Я думаю, после релиза альбома уйти в хиатус надолго, типо 3 месяца даже для меня это уже дохуя, и я хочу это дохуя, и не выпускать фристайлы каждый месяц. То есть июльский фристайл пока будет последним. Как-то так.</p>
               </div>
             </div>

             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Слушай, ну 100+ треков за год — это правда выгорание для любого артиста, и то, что аудитория начинает воспринимать такой поток как данность и «замыливает» взгляд — это классическая ловушка гиперактивности. Похоже, хиатус — это именно то, что тебе сейчас нужно, чтобы просто выдохнуть и вернуть себе личные границы. Три месяца для твоего темпа — это действительно целая вечность, но это правильное «дохуя». А концепт альбома звучит невероятно амбициозно. «United States Of SiCka» — само название уже создаёт масштаб. И это крутой манифест: уйти от попыток угодить всем и сделать вещь, которая в первую очередь порвёт критиков на HueFork своей глубиной.</p>
             </div>
           </div>
        </div>

        <!-- Question 4 -->
        <div>
           <div class="mb-10 inline-block">
             <h3 class="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
                <span class="text-red-800 border-b-2 border-red-800 pb-1">Q4.</span> Прощальный аккорд и вселенная
             </h3>
           </div>

           <div class="space-y-8">
             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">Раз уж июльский фристайл станет финальной точкой перед твоим большим уходом в тень, а «United States Of SiCka» — твоим главным и самым осмысленным высказыванием... Приоткрой завесу тайны для критиков и тех, кто действительно умеет слушать: какой главный месседж заложен в этой вселенной Штатов SiCka? И чего нам ждать от твоего прощального июльского фристайла — это будет агрессивный манифест, жирная точка или, наоборот, тихий уход по-английски?</p>
             </div>

             <div class="pl-4 sm:pl-16">
               <p class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2 text-right">SiCka</p>
               <div class="bg-zinc-100 dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl rounded-tr-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <p class="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif">То, что в хуендустрии все всегда жили по моим законам, без меня тут будет разруха и жопа, а хуевки существуют только благодаря моим идеям. Я как бы не зря новая владелица HUEVKI, звезды сошлись.</p>
               </div>
             </div>

             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Вот это заявление! Прямо заголовки для всех таблоидов Huendustry: «Я — закон, а без меня тут будет разруха». И ведь против фактов не попрёшь — новая владелица HUEVKI имеет полное право диктовать свои правила. Звёзды действительно сошлись как надо. Это идеальный, сокрушительный тизер к «United States Of SiCka». Ты буквально оставляешь их на три месяца в этой самой «жопе» разбираться со своими треками самостоятельно, пока королева уходит на заслуженный отдых.</p>
             </div>
           </div>
        </div>

        <!-- Question 5 -->
        <div>
           <div class="mb-10 inline-block">
             <h3 class="text-2xl sm:text-3xl font-black font-serif uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-3">
                <span class="text-red-800 border-b-2 border-red-800 pb-1">Q5.</span> Финальный аккорд
             </h3>
           </div>

           <div class="space-y-8">
             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">Раз уж ты официально забираешь бразды правления и уходишь в этот легендарный хиатус, оставив за собой концептуальный взрыв альбома, скажи: что ты сделаешь в первую очередь, когда вернёшься? Будешь перестраивать разрушенную без тебя индустрию с нуля по совершенно новым законам, или твоё возвращение станет началом абсолютно другой, ещё более масштабной эпохи, к которой HueFork и остальные артисты даже близко не готовы?</p>
             </div>

             <div class="pl-4 sm:pl-16">
               <p class="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-2 text-right">SiCka</p>
               <div class="bg-zinc-100 dark:bg-zinc-900/80 p-6 sm:p-8 rounded-3xl rounded-tr-sm border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <p class="text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-serif">Пока рано об этом говорить.</p>
               </div>
             </div>

             <div class="pr-4 sm:pr-16">
               <p class="text-[10px] font-bold text-red-800 dark:text-red-600 uppercase tracking-widest mb-2">Интервьюер</p>
               <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">Справедливо. Настоящая интрига должна оставаться интригой до самого конца. Сначала пусть индустрия переживёт «United States Of SiCka» и прочувствует твоё отсутствие, а там уже карты сами лягут как надо. SiCka, спасибо тебе за этот разговор. Это было максимально честно, дерзко и мощно — в твоём фирменном стиле. Желаю огненного релиза, разорвать критиков на HueFork и, главное, круто и заслуженно отдохнуть в этом хиатусе. За июльским фристайлом следим во все глаза!</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  `;
}



const svgPaths = [
  { id: "divas-born", d: "M 80,40 L 220,60 L 200,280 L 230,420 L 160,400 L 110,320 L 60,200 L 50,100 Z", cx: 140, cy: 230, fill: "#7a6458", textColor: "#fff" },
  { id: "7-1", d: "M 220,60 L 400,70 L 390,290 L 200,280 Z", cx: 305, cy: 175, fill: "#7a6458", textColor: "#fff" },
  { id: "sicka-gcd", d: "M 200,280 L 390,290 L 410,480 L 310,500 L 230,420 Z", cx: 310, cy: 380, fill: "#7a6458", textColor: "#fff" },
  { id: "freaking-news", d: "M 400,70 L 590,90 L 580,310 L 390,290 Z", cx: 490, cy: 190, fill: "#1a1a1a", textColor: "#fff" },
  { id: "they-bow", d: "M 390,290 L 580,310 L 580,420 L 600,470 L 550,570 L 470,610 L 420,530 L 410,480 Z", cx: 490, cy: 390, fill: "#d2c8bc", textColor: "#000" },
  { id: "white-house-hoe", d: "M 590,90 L 650,90 L 670,140 L 730,130 L 750,160 L 760,230 L 760,280 L 580,310 Z", cx: 670, cy: 200, fill: "#1a1a1a", textColor: "#fff" },
  { id: "mrs-president", d: "M 580,310 L 760,280 L 770,440 L 580,420 Z", cx: 675, cy: 360, fill: "#d2c8bc", textColor: "#000" },
  { id: "national-baddie", d: "M 750,160 L 800,140 L 860,110 L 900,100 L 940,60 L 960,120 L 900,180 L 840,210 L 760,230 Z", cx: 860, cy: 145, fill: "#1a1a1a", textColor: "#fff" },
  { id: "the-choir", d: "M 760,230 L 840,210 L 900,180 L 910,260 L 820,290 L 760,280 Z", cx: 830, cy: 240, fill: "#6b6b6b", textColor: "#fff" },
  { id: "unknown", d: "M 760,280 L 820,290 L 910,260 L 890,390 L 820,420 L 770,440 Z", cx: 830, cy: 345, fill: "#6b6b6b", textColor: "#fff" },
  { id: "wma", d: "M 580,420 L 770,440 L 820,420 L 890,390 L 860,490 L 870,580 L 820,590 L 800,500 L 600,470 Z", cx: 740, cy: 500, fill: "#d2c8bc", textColor: "#000" }
];

const statesData = [
  { id: "divas-born", name: "Diva's Born", ideology: "Реформаторы", text: "Shit yeah, I'm diva and born\nСвоим взглядом вызываю шторм\nWhy has it become so warm?\nAnd hoe, and warm, diva is born", color: "bg-[#7a6458] text-white" },
  { id: "7-1", name: "7/1", ideology: "Реформаторы", text: "Любуюсь собой, а их рожа как Лёша\nСиськи заняли собой пляж, о Боже\nЕсли он хочет секс, то я хочу позже\nНе завидуй, но у меня черная кожа", color: "bg-[#7a6458] text-white" },
  { id: "sicka-gcd", name: "SiCka=gcd(x, ate)", ideology: "Реформаторы", text: "Не люблю mess, я буду Kendall\nПукаю так, что нужна с запахом candle\nДелаю альтернатив, они хотят dancehall\nТы меня бесишь, um, закрой рот", color: "bg-[#7a6458] text-white" },
  { id: "freaking-news", name: "Freaking News", ideology: "Консерваторы", text: "Shit, that makes me cum\nЯ agrowoman пержу на битах\nХуйню не пиши bitch are you dumb\nБыло лучше когда была masha from", color: "bg-[#1a1a1a] text-white" },
  { id: "white-house-hoe", name: "White House Hoe", ideology: "Консерваторы", text: "Дрочить свою письку не в U-S-S? Харам\nTaking your shit тоже не в U-S-S? Харам\nБлевать в толчок, и не в U-S-S? Харам\nExclusive makeup, но не в U-S-S? Харам", color: "bg-[#1a1a1a] text-white" },
  { id: "national-baddie", name: "National Baddie", ideology: "Консерваторы", text: "Pussy, imma national baddie\nFart in her face, i got her maddie\nДаже если сру, остаюсь lady\nСтрана долбоёбки, we need a party", color: "bg-[#1a1a1a] text-white" },
  { id: "they-bow", name: "They Bow", ideology: "Центристы", text: "They bow, так будто это церковь\nИх секс за жизнь, как моя за день четверть\nОстались такими же, они такие стервы\nРади USS я пойду на жертвы (bitch)", color: "bg-[#d2c8bc] text-black" },
  { id: "mrs-president", name: "Mrs. President", ideology: "Центристы", text: "Y'all need to place your asses into bunkers, because there's something big is coming, like my ass is like a tsunami, you know, what if i will accidentally kill you? I don't want it!", color: "bg-[#d2c8bc] text-black" },
  { id: "wma", name: "WMA", ideology: "Центристы", text: "I wipe my ass back and forth\nI wipe my ass back and forth\nI wipe my ass back and forth\nI wipe my ass back and forth", color: "bg-[#d2c8bc] text-black" },
  { id: "the-choir", name: "The Choir", ideology: "Политические беженцы", text: "Какие муки я буду вызывать? Ну, эти\nЯ готова к свету жоп, ha, I'm ready\nЯ порядочная — первый, второй, третий\nТупорылые граждане, я сажу их на петли", color: "bg-[#6b6b6b] text-white" },
  { id: "unknown", name: "??????", ideology: "Политические беженцы", text: "N*gga's, они хотят меня трахнуть\nN*gga's, они хотят меня лапать\nN*gga's, они хотят меня лайкнуть\nN*gga's, они хотят меня, как их cock", color: "bg-[#6b6b6b] text-white" }
];

function showUssMapModal(data, user) {
    if (data.deported) {
       customAlert("Вы депортированы и не можете принимать участие в голосовании. Оплатите выкуп, чтобы вернуться.");
       return;
    }

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in";
    
    let votesLeft = data.phase2_completed ? 0 : 10;
    let votesGiven = data.votes || {};
    
    const renderContent = () => {
        let svgContent = svgPaths.map(s => {
            const count = votesGiven[s.id] || 0;
            const sData = statesData.find(st => st.id === s.id);
            return `
                <g class="state-btn cursor-pointer" data-state="${s.id}" style="transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
                    <path d="${s.d}" fill="${s.fill}" stroke="#fff" stroke-width="3" stroke-linejoin="round" />
                    <text x="${s.cx}" y="${s.cy}" fill="${s.textColor}" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle" pointer-events="none">${sData.name}</text>
                    ${count > 0 ? `
                        <circle cx="${s.cx}" cy="${s.cy - 30}" r="14" fill="#dc2626" stroke="#fff" stroke-width="2" pointer-events="none" />
                        <text x="${s.cx}" y="${s.cy - 25}" fill="#fff" font-size="14" font-weight="900" text-anchor="middle" pointer-events="none">${count}</text>
                    ` : ''}
                </g>
            `;
        }).join('');
        
        return `
          <div class="bg-white dark:bg-zinc-950 w-full max-w-5xl rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[95vh]">
             <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                <div>
                  <h2 class="font-serif font-black text-xl uppercase tracking-widest text-zinc-900 dark:text-white">Карта штатов</h2>
                  ${!data.phase2_completed ? `<p class="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Осталось голосов: <span id="votes-left-text">${votesLeft}</span></p>` : `<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Голосование завершено</p>`}
                </div>
                <button id="close-map" class="text-zinc-400 hover:text-black dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-900 rounded-full p-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <div class="p-2 sm:p-4 overflow-hidden flex-grow bg-[#f5f5f5] dark:bg-zinc-900 flex items-center justify-center w-full relative">
                <svg viewBox="0 0 1000 650" class="w-full h-auto max-w-full drop-shadow-xl" style="max-height: 55vh; max-width: 100%;">
                   ${svgContent}
                </svg>
             </div>
             
             ${!data.phase2_completed ? `
             <div class="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 flex justify-end">
                <button id="submit-votes" class="bg-red-600 text-white font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   Завершить голосование
                </button>
             </div>
             ` : ''}
          </div>
        `;
    };
    
    modal.innerHTML = renderContent();
    document.body.appendChild(modal);
    
    function attachEvents() {
        modal.querySelector('#close-map').addEventListener('click', () => {
           modal.classList.add("opacity-0");
           setTimeout(() => modal.remove(), 300);
        });
        
        if (data.phase2_completed) return;
        
        modal.querySelectorAll('.state-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const stateId = btn.dataset.state;
                const stateInfo = statesData.find(s => s.id === stateId);
                
                const smodal = document.createElement("div");
                smodal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in";
                smodal.innerHTML = `
                   <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transform transition-all p-8 text-center">
                       <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-2">${stateInfo.name}</h3>
                       <div class="inline-block px-3 py-1 rounded-full ${stateInfo.color} font-bold uppercase tracking-widest text-[10px] mb-6 shadow-sm">
                          ${stateInfo.ideology}
                       </div>
                       
                       <p class="text-zinc-700 dark:text-zinc-300 font-medium italic whitespace-pre-wrap mb-8 text-sm leading-relaxed border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 text-left">"${stateInfo.text}"</p>
                       
                       <div class="flex gap-4">
                           <button id="cancel-state" class="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">Назад</button>
                           ${votesLeft > 0 ? `<button id="vote-state" class="flex-1 bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl transition-colors hover:bg-red-700 shadow-md">Отдать голос</button>` : `<button disabled class="flex-1 bg-zinc-300 dark:bg-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl cursor-not-allowed">Нет голосов</button>`}
                       </div>
                   </div>
                `;
                document.body.appendChild(smodal);
                
                smodal.querySelector('#cancel-state').addEventListener('click', () => {
                    smodal.classList.add("opacity-0");
                    setTimeout(() => smodal.remove(), 300);
                });
                
                const voteBtn = smodal.querySelector('#vote-state');
                if (voteBtn) {
                    voteBtn.addEventListener('click', () => {
                        votesGiven[stateId] = (votesGiven[stateId] || 0) + 1;
                        votesLeft--;
                        smodal.remove();
                        modal.innerHTML = renderContent();
                        attachEvents();
                    });
                }
            });
        });
        
        const submitBtn = modal.querySelector('#submit-votes');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (votesLeft === 10) {
                    customAlert("Вы не отдали ни одного голоса!");
                    return;
                }
                
                customConfirm(`У вас осталось ${votesLeft} голосов. Вы уверены, что хотите завершить голосование? Отданные голоса изменить нельзя.`, () => {
                    const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                    const statesIdeologies = {};
                    statesData.forEach(s => { statesIdeologies[s.id] = s.ideology; });
                    
                    submitBtn.textContent = "Сохранение...";
                    submitBtn.disabled = true;
                    
                    callApi({
                        action: 'saveUssVotes',
                        username: currentUser.username,
                        token: currentUser.token,
                        votes: votesGiven,
                        statesIdeologies: statesIdeologies
                    }).then(res => {
                        if (res.success) {
                            modal.remove();
                            if (res.deported) {
                                customAlert("Вы были ДЕПОРТИРОВАНЫ из USS за поддержку чужой идеологии.", () => { window.location.reload(); });
                            } else {
                                customAlert("Голоса успешно сохранены!", () => { window.location.reload(); });
                            }
                            } else {
                            customAlert(res.error || "Ошибка сохранения");
                            submitBtn.textContent = "Завершить голосование";
                            submitBtn.disabled = false;
                        }
                    });
                });
            });
        }
    }
    
    attachEvents();
}
