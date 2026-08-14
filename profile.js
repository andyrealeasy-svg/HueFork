import { supabase } from "./supabaseClient.js";
import { callApi, getCurrentUser, setCurrentUser, syncUserLocalData, logoutUser, refreshSession } from './api.js';
import { checkEconomyPopups, resetEconomyReminderSession } from './economy.js';

import { artists, reviews, getReview, getArtist } from './data.js';

let publicDataCache = null;

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

window.appAlert = function(message) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
  modal.innerHTML = `
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up">
      <h3 class="font-serif font-black text-2xl mb-4 tracking-tighter uppercase text-red-600">Внимание</h3>
      <p class="text-zinc-500 font-medium text-sm mb-8">${message}</p>
      <button id="modal-ok" class="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md">ОК</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("#modal-ok").addEventListener("click", () => modal.remove());
};


window.appPrompt = function(title, placeholder, isPassword, onSubmit) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in";
  modal.innerHTML = `
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up">
      <h3 class="font-serif font-black text-xl mb-4 tracking-tighter uppercase text-zinc-900 dark:text-white">${title}</h3>
      <input type="${isPassword ? 'password' : 'text'}" id="prompt-input" placeholder="${placeholder}" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm font-medium">
      <div class="flex gap-4">
        <button id="modal-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Отмена</button>
        <button id="modal-submit" class="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md">ОК</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const input = modal.querySelector('#prompt-input');
  input.focus();
  
  const submit = () => {
    const val = input.value.trim();
    if (!val) return;
    modal.remove();
    onSubmit(val);
  };
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
  
  modal.querySelector("#modal-cancel").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-submit").addEventListener("click", submit);
};

window.appConfirm = function(message, onConfirm) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
  modal.innerHTML = `
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up">
      <h3 class="font-serif font-black text-2xl mb-4 tracking-tighter uppercase text-zinc-900 dark:text-white">Подтверждение</h3>
      <p class="text-zinc-500 font-medium text-sm mb-8">${message}</p>
      <div class="flex gap-4">
        <button id="modal-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Отмена</button>
        <button id="modal-confirm" class="flex-1 bg-red-600 text-white py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md">Да</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("#modal-cancel").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-confirm").addEventListener("click", () => {
    modal.remove();
    onConfirm();
  });
};

export async function fetchPublicData(force = false) {
  if (publicDataCache && !force) return publicDataCache;
  const res = await callApi({ action: 'getPublicData' });
  if (res.success) {
    publicDataCache = res.data; // { artists: { artistId: { description, pinnedReleaseId } }, comments: { reviewId: [ { artistId, text } ] }, verifiedArtists: [...] }
    window._cachedVerifiedArtists = publicDataCache.verifiedArtists || [];
    return publicDataCache;
  }
  return { artists: {}, comments: {} };
}

export function renderArtistCard() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();

  if (!user) {
    renderLogin();
    return;
  }

  // Refresh session in background
  refreshSession().then(async changed => {
    if (changed) {
      await fetchPublicData(true);
      renderProfile();
    }
  });

  const initial = user.username.charAt(0).toUpperCase();

  let artistInfoHtml = "";
  let adminBtnHtml = "";

  if (user.role === 'moderator') {
    adminBtnHtml = `
      <div class="mt-8 flex flex-col items-center gap-4">
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#/admin" class="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">Админ-панель</a>
          <button id="resign-btn" class="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">Снять права</button>
        </div>
        <div id="transfer-mod-container" class="hidden w-full max-w-sm mt-4 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-xl relative text-left">
           <h4 class="font-serif font-black text-xl uppercase tracking-tighter mb-4 text-center">Передача прав</h4>
           <div class="relative mb-6" id="custom-transfer-select-container">
             <input type="text" id="transfer-mod-input" placeholder="Поиск пользователя..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 shadow-inner text-zinc-900 dark:text-zinc-100 font-medium" autocomplete="off"/>
             <input type="hidden" id="transfer-mod-target" value=""/>
             <div id="transfer-mod-dropdown" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden max-h-60 overflow-y-auto overflow-x-hidden"></div>
           </div>
           <div class="flex gap-3">
               <button id="transfer-mod-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors hover:text-zinc-900 dark:hover:text-white">Отмена</button>
               <button id="transfer-mod-confirm" class="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors shadow-md">Передать</button>
           </div>
        </div>
      </div>
    `;
  }

  let avatarHtml = `<div class="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex items-center justify-center text-7xl font-serif font-black shadow-inner border-4 border-white dark:border-black mb-8">${initial}</div>`;
  
  if (user.linkedArtistId) {
    const artist = getArtist(user.linkedArtistId);
    if (artist) {
      avatarHtml = `<img src="${artist.photo}" alt="${artist.name}" class="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto object-cover shadow-2xl border-4 border-white dark:border-black mb-8">`;
      
      const artistReleases = reviews.filter(r => r.artistId === user.linkedArtistId || (r.artistIds && r.artistIds.includes(user.linkedArtistId)));
      
      const releasesLinksHtml = artistReleases.length > 0 
        ? `<div class="mt-4 space-y-2">` + artistReleases.map(r => `
            <a href="#/reviews/${r.id}" class="flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
              <img src="${r.cover}" class="w-10 h-10 object-cover rounded shadow-sm" />
              <div class="flex-grow min-w-0">
                 <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">${r.title}</div>
                 <div class="text-[10px] text-zinc-500 uppercase tracking-widest">${r.isSingle ? 'Сингл' : 'Альбом'}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400 mr-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          `).join('') + `</div>`
        : `<div class="text-sm text-zinc-500 mt-2">Нет привязанных релизов</div>`;

      artistInfoHtml = `
        <div class="mt-16 sm:mt-24 lg:mt-32 max-w-4xl mx-auto">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h2 class="font-serif font-black text-3xl md:text-4xl tracking-tighter uppercase text-zinc-900 dark:text-white">Панель Артиста</h2>
              <p class="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Настройки профиля: ${artist.name}</p>
            </div>
            <a href="#/artists/${artist.id}" class="inline-flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
               К странице артиста
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
          
          <div class="space-y-12">
            <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden group">
              <div class="absolute -right-20 -top-20 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <div class="w-64 h-64 rounded-full bg-red-600 blur-3xl"></div>
              </div>
              <div class="relative z-10">
                <label class="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Описание профиля</label>
                <textarea id="artist-desc" rows="4" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all resize-none shadow-inner text-zinc-900 dark:text-zinc-100" placeholder="Расскажите о себе..."></textarea>
              </div>
              
              <div class="relative mt-8" id="custom-pinned-select-container">
                <label class="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Закрепленный релиз</label>
                <input type="text" id="custom-pinned-input" placeholder="Найти релиз для закрепления..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white font-medium shadow-inner" autocomplete="off"/>
                <input type="hidden" id="pinned-release" value=""/>
                <div id="custom-pinned-dropdown" class="absolute top-[80px] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden max-h-60 overflow-y-auto overflow-x-hidden"></div>
              </div>
              
              <button id="save-artist-info" class="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold uppercase tracking-widest text-sm px-10 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 mt-10">Обновить информацию</button>
            </div>
            
            <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 sm:p-10 shadow-sm">
              <h4 class="font-serif font-black text-2xl uppercase tracking-tighter mb-2">Комментарий к релизу</h4>
              <p class="text-sm font-medium text-zinc-500 mb-8">Оставьте послание слушателям. Выберите релиз, напишите комментарий и сохраните.</p>
              
              <div class="relative mb-6" id="custom-comment-select-container">
                <label class="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Релиз</label>
                <input type="text" id="custom-comment-input" placeholder="Найти релиз..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white font-medium shadow-inner" autocomplete="off"/>
                <input type="hidden" id="comment-release-select" value=""/>
                <div id="custom-comment-dropdown" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden max-h-60 overflow-y-auto overflow-x-hidden"></div>
              </div>
              
              <label class="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Сообщение</label>
              <textarea id="comment-text" rows="3" disabled placeholder="Сначала выберите релиз..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all resize-none shadow-inner mb-6 disabled:opacity-50"></textarea>
              
              <button id="save-comment-btn" disabled class="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-0.5">Сохранить комментарий</button>
            </div>
            
            <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 sm:p-10 shadow-sm">
              <h4 class="font-serif font-black text-2xl uppercase tracking-tighter mb-6">Ваши релизы</h4>
              ${releasesLinksHtml}
            </div>
          </div>
        </div>
      `;
    }
  } else {
    // Option to request link
    artistInfoHtml = `
      <div class="mt-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 sm:p-12 shadow-sm relative overflow-hidden group max-w-3xl mx-auto">
        <div class="absolute -left-20 -top-20 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <div class="w-64 h-64 rounded-full bg-red-600 blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h3 class="font-serif font-black uppercase tracking-tighter text-2xl md:text-4xl mb-4 text-center sm:text-left text-zinc-900 dark:text-white">Привязать карточку</h3>
          <p class="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-8 text-center sm:text-left">Если вы являетесь артистом, вы можете отправить запрос модератору на привязку профиля. Это откроет доступ к редактированию карточки и добавлению комментариев к релизам.</p>
          
          <div class="flex flex-col sm:flex-row gap-4 relative">
            <div class="relative flex-grow" id="custom-artist-select-container">
              <input type="text" id="custom-artist-input" placeholder="Введите имя артиста..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-zinc-900 dark:text-white font-bold shadow-inner" autocomplete="off"/>
              <input type="hidden" id="request-artist-id" value=""/>
              
              <div id="custom-artist-dropdown" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden max-h-60 overflow-y-auto overflow-x-hidden">
              </div>
            </div>
            <button id="request-link-btn" disabled class="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50 disabled:hover:translate-y-0">Отправить запрос</button>
          </div>
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-16 md:py-24 animate-slide-up">
      <a href="#/profile" class="inline-flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white mb-6 font-bold uppercase tracking-widest text-xs transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Назад</a>
      <div class="text-center">
        ${avatarHtml}
        <h1 class="font-serif font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter mb-4 drop-shadow-sm">${user.username}</h1>
        <p class="text-zinc-500 font-bold tracking-widest text-xs sm:text-sm mb-10">
          ${user.role === 'moderator' ? 'Модератор' : (user.linkedArtistId ? 'Подтвержденный профиль' : 'Пользователь')}
        </p>
        <button id="logout-btn" class="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-sm text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transform active:scale-95 duration-300">Выйти</button>
        ${adminBtnHtml}
      </div>

      ${artistInfoHtml}
    </div>
  `;

  document.getElementById("logout-btn").addEventListener("click", () => {
    logoutUser();
    location.hash = "#/";
  });

  if (user.role === 'moderator' && document.getElementById("resign-btn")) {
    let allUsers = [];
    document.getElementById("resign-btn").addEventListener("click", async () => {
      const container = document.getElementById("transfer-mod-container");
      const input = document.getElementById("transfer-mod-input");
      const hidden = document.getElementById("transfer-mod-target");
      
      const res = await callApi({ action: 'getUsersList', username: user.username, token: user.token });
      if (res.success) {
          allUsers = res.data;
          container.classList.remove("hidden");
          input.value = "";
          hidden.value = "";
      } else {
          window.appAlert("Ошибка загрузки списка пользователей: " + res.error);
      }
    });

    const input = document.getElementById("transfer-mod-input");
    const dropdown = document.getElementById("transfer-mod-dropdown");
    const hidden = document.getElementById("transfer-mod-target");

    function renderUserOptions(query) {
        dropdown.innerHTML = '';
        const filtered = allUsers.filter(u => u.toLowerCase().includes(query.toLowerCase()));
        if (filtered.length === 0) {
            dropdown.innerHTML = `<div class="p-3 text-sm text-zinc-500">Пользователи не найдены</div>`;
            return;
        }
        filtered.forEach(u => {
            const div = document.createElement("div");
            div.className = "p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-100 last:border-0";
            div.textContent = u;
            div.addEventListener("click", () => {
                input.value = u;
                hidden.value = u;
                dropdown.classList.add("hidden");
            });
            dropdown.appendChild(div);
        });
    }

    if (input) {
        input.addEventListener("focus", () => {
             renderUserOptions(input.value);
             dropdown.classList.remove("hidden");
        });
        
        input.addEventListener("input", (e) => {
             renderUserOptions(e.target.value);
             hidden.value = "";
             dropdown.classList.remove("hidden");
        });

        document.addEventListener("click", (e) => {
             if (document.getElementById("custom-transfer-select-container") && !document.getElementById("custom-transfer-select-container").contains(e.target)) {
                 dropdown.classList.add("hidden");
             }
        });
    }

    document.getElementById("transfer-mod-cancel").addEventListener("click", () => {
      document.getElementById("transfer-mod-container").classList.add("hidden");
    });

    document.getElementById("transfer-mod-confirm").addEventListener("click", () => {
        const targetUser = document.getElementById("transfer-mod-target").value || document.getElementById("transfer-mod-input").value;
        if (!targetUser) {
            window.appConfirm('Нет других пользователей. Просто снять права модератора с себя?', async () => {
              const res = await callApi({ action: 'resignModerator', username: user.username, token: user.token });
              if(res.success) {
                  user.role = 'user';
                  setCurrentUser(user);
                  renderProfile();
              } else window.appAlert("Ошибка: " + res.error);
            });
            return;
        }
        
        window.appConfirm(`Вы уверены, что хотите передать права модератора пользователю ${targetUser}? Вы станете обычным пользователем.`, async () => {
            const res = await callApi({ action: 'transferModerator', username: user.username, token: user.token, targetUser });
            if (res.success) {
                user.role = 'user';
                setCurrentUser(user);
                renderProfile();
            } else {
                window.appAlert("Ошибка: " + res.error);
            }
        });
    });
  }

  if (document.getElementById("request-link-btn")) {
    const input = document.getElementById("custom-artist-input");
    const dropdown = document.getElementById("custom-artist-dropdown");
    const hiddenId = document.getElementById("request-artist-id");
    const btn = document.getElementById("request-link-btn");
    
    function renderCustomOptions(query) {
       dropdown.innerHTML = '';
       const filtered = artists.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) && a.id !== "various-artists");
       if (filtered.length === 0) {
           dropdown.innerHTML = `<div class="p-4 text-sm text-zinc-500">Артисты не найдены</div>`;
           return;
       }
       filtered.forEach(a => {
           const div = document.createElement("div");
           div.className = "flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0";
           div.innerHTML = `<img src="${a.photo}" class="w-8 h-8 rounded-full py-0 object-cover" /> <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">${a.name}</span>`;
           div.addEventListener("click", () => {
              hiddenId.value = a.id;
              input.value = a.name;
              dropdown.classList.add("hidden");
              btn.disabled = false;
           });
           dropdown.appendChild(div);
       });
    }

    input.addEventListener("focus", () => {
       renderCustomOptions(input.value);
       dropdown.classList.remove("hidden");
    });
    
    input.addEventListener("input", (e) => {
       hiddenId.value = "";
       btn.disabled = true;
       renderCustomOptions(e.target.value);
       dropdown.classList.remove("hidden");
    });
    
    document.addEventListener("click", (e) => {
       const container = document.getElementById("custom-artist-select-container");
       if (container && !container.contains(e.target)) {
           dropdown.classList.add("hidden");
       }
    });

    btn.addEventListener("click", async (e) => {
      const artistId = hiddenId.value;
      if (!artistId) return;
      btn.disabled = true;
      btn.textContent = "Отправка...";
      const res = await callApi({ action: 'requestLink', username: user.username, token: user.token, artistId });
      if(res.success) {
        window.appAlert("Запрос отправлен модератору!");
      } else {
        window.appAlert("Ошибка: " + res.error);
        btn.disabled = false;
      }
      btn.textContent = "Отправить запрос";
    });
  }

  if (document.getElementById("save-artist-info")) {
    const artistDesc = document.getElementById("artist-desc");
    const pinnedRelease = document.getElementById("pinned-release");
    
    const releaseSelect = document.getElementById("comment-release-select");
    const commentText = document.getElementById("comment-text");
    const saveCommentBtn = document.getElementById("save-comment-btn");

    const artistReleases = reviews.filter(r => r.artistId === user.linkedArtistId || (r.artistIds && r.artistIds.includes(user.linkedArtistId)));

    function setupReleaseDropdown(inputId, hiddenId, dropdownId, containerId, onSelectCallback) {
        const input = document.getElementById(inputId);
        const hidden = document.getElementById(hiddenId);
        const dropdown = document.getElementById(dropdownId);
        
        function renderOptions(query) {
           dropdown.innerHTML = '';
           const filtered = artistReleases.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
           if (filtered.length === 0) {
               dropdown.innerHTML = `<div class="p-4 text-sm text-zinc-500">Релизы не найдены</div>`;
               return;
           }
           // Add empty option
           const emptyDiv = document.createElement("div");
           emptyDiv.className = "p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500 font-medium";
           emptyDiv.textContent = "Не выбрано / Очистить";
           emptyDiv.addEventListener("click", () => {
              hidden.value = "";
              input.value = "";
              dropdown.classList.add("hidden");
              if(onSelectCallback) onSelectCallback("");
           });
           dropdown.appendChild(emptyDiv);

           filtered.forEach(r => {
               const div = document.createElement("div");
               div.className = "flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0";
               div.innerHTML = `<img src="${r.cover}" class="w-8 h-8 rounded py-0 object-cover" /> 
               <div class="flex-grow min-w-0"><div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">${r.title}</div><div class="text-[10px] text-zinc-500 uppercase tracking-widest">${r.isSingle ? 'Сингл' : 'Альбом'}</div></div>`;
               div.addEventListener("click", () => {
                  hidden.value = r.id;
                  input.value = r.title;
                  dropdown.classList.add("hidden");
                  if(onSelectCallback) onSelectCallback(r.id);
               });
               dropdown.appendChild(div);
           });
        }

        input.addEventListener("focus", () => {
           renderOptions(input.value);
           dropdown.classList.remove("hidden");
        });
        
        input.addEventListener("input", (e) => {
           hidden.value = "";
           if(onSelectCallback) onSelectCallback("");
           renderOptions(e.target.value);
           dropdown.classList.remove("hidden");
        });
        
        document.addEventListener("click", (e) => {
           const container = document.getElementById(containerId);
           if (container && !container.contains(e.target)) {
               dropdown.classList.add("hidden");
           }
        });
    }

    setupReleaseDropdown("custom-pinned-input", "pinned-release", "custom-pinned-dropdown", "custom-pinned-select-container");

    let currentData = null;

    setupReleaseDropdown("custom-comment-input", "comment-release-select", "custom-comment-dropdown", "custom-comment-select-container", (revId) => {
       if (!revId) {
         commentText.disabled = true;
         saveCommentBtn.disabled = true;
         commentText.value = '';
         return;
       }
       commentText.disabled = false;
       saveCommentBtn.disabled = false;
       
       let existingComment = '';
       if (currentData && currentData.comments && currentData.comments[revId]) {
         const c = currentData.comments[revId].find(x => x.artistId === user.linkedArtistId);
         if (c) existingComment = c.text;
       }
       commentText.value = existingComment;
    });

    // Load existing data
    fetchPublicData().then(data => {
      currentData = data;
      if(data.artists[user.linkedArtistId]) {
        artistDesc.value = data.artists[user.linkedArtistId].description || '';
        const pid = data.artists[user.linkedArtistId].pinnedReleaseId;
        pinnedRelease.value = pid || '';
        if (pid) {
           const r = reviews.find(x => x.id === pid);
           if(r) document.getElementById("custom-pinned-input").value = r.title;
        }
      }
    });

    document.getElementById("save-artist-info").addEventListener("click", async (e) => {
      const btn = e.target;
      const oldText = btn.textContent;
      btn.textContent = "Сохранение...";
      btn.disabled = true;

      const res = await callApi({ 
        action: 'updateArtistInfo', 
        username: user.username, 
        token: user.token, 
        description: artistDesc.value, 
        pinnedReleaseId: pinnedRelease.value 
      });

      if (res.success) {
        if(publicDataCache) {
          if (!publicDataCache.artists[user.linkedArtistId]) publicDataCache.artists[user.linkedArtistId] = {};
          publicDataCache.artists[user.linkedArtistId].description = artistDesc.value;
          publicDataCache.artists[user.linkedArtistId].pinnedReleaseId = pinnedRelease.value;
        }
        btn.textContent = "Сохранено!";
        setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 2000);
      } else {
        window.appAlert("Ошибка: " + res.error);
        btn.textContent = oldText;
        btn.disabled = false;
      }
    });
    
    saveCommentBtn.addEventListener("click", async (e) => {
      const btn = e.target;
      const revId = releaseSelect.value;
      if (!revId) return;
      
      const oldText = btn.textContent;
      btn.textContent = "Сохранение...";
      btn.disabled = true;

      const res = await callApi({ 
        action: 'addComment', 
        username: user.username, 
        token: user.token, 
        reviewId: revId,
        commentText: commentText.value 
      });

      if (res.success) {
        if(publicDataCache) {
          if (!publicDataCache.comments) publicDataCache.comments = {};
          if (!publicDataCache.comments[revId]) publicDataCache.comments[revId] = [];
          
          publicDataCache.comments[revId] = publicDataCache.comments[revId].filter(x => x.artistId !== user.linkedArtistId);
          if (commentText.value.trim() !== '') {
            publicDataCache.comments[revId].push({ artistId: user.linkedArtistId, text: commentText.value });
          }
        }
        btn.textContent = "Сохранено!";
        setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 2000);
      } else {
        window.appAlert("Ошибка: " + res.error);
        btn.textContent = oldText;
        btn.disabled = false;
      }
    });
  }
}

function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="max-w-md mx-auto px-4 py-20 mt-10 animate-slide-up bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-2xl relative overflow-hidden group">
      <div class="absolute -right-20 -top-20 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <div class="w-64 h-64 rounded-full bg-red-600 blur-3xl"></div>
      </div>
      
      <div class="relative z-10 text-center mb-10">
        <h1 class="font-serif font-black text-4xl uppercase tracking-tighter mb-2">Авторизация</h1>
        <p class="text-zinc-500 font-medium text-sm">Синхронизация данных профиля</p>
      </div>

      <form id="auth-form" class="relative z-10 space-y-5">
        <div>
          <input type="text" id="auth-username" required placeholder="Имя пользователя" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-bold text-zinc-900 dark:text-zinc-50 shadow-inner">
        </div>
        <div>
          <input type="password" id="auth-pass" required placeholder="Пароль" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-bold text-zinc-900 dark:text-zinc-50 shadow-inner">
        </div>
        
        <div id="auth-error" class="text-red-500 font-bold text-xs uppercase tracking-widest hidden text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50"></div>

        <button type="submit" id="auth-login-btn" class="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest py-4 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-300 mt-4">Войти</button>
        
        <div class="text-center mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <button type="button" id="auth-register-btn" class="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors">Или зарегистрироваться</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById("auth-form");
  const errEl = document.getElementById("auth-error");

  const getLocalData = () => {
    return {
      userRatings: localStorage.getItem("userRatings") || "{}",
      subscribedArtists: localStorage.getItem("subscribedArtists") || "[]",
      huev_2026_watched: localStorage.getItem("huev_2026_watched") || "",
      reviewNotes: localStorage.getItem("reviewNotes") || "{}",
      myGlobalReview: localStorage.getItem("myGlobalReview") || "{}",
      personalProfile: localStorage.getItem("personalProfile") || "{}"
    };
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.classList.add("hidden");
    const btn = document.getElementById("auth-login-btn");
    btn.disabled = true;
    btn.textContent = "Вход...";
    
    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-pass").value;

    const localData = getLocalData();
    const res = await callApi({ action: 'login', username, password, localData: JSON.stringify(localData) });
    
    if (res.success) {
      if (res.userData) {
          try {
              const data = typeof res.userData === 'string' ? JSON.parse(res.userData) : res.userData;
              if (data.userRatings) localStorage.setItem("userRatings", data.userRatings);
              if (data.subscribedArtists) localStorage.setItem("subscribedArtists", data.subscribedArtists);
              if (data.huev_2026_watched) localStorage.setItem("huev_2026_watched", data.huev_2026_watched);
              if (data.reviewNotes) localStorage.setItem("reviewNotes", data.reviewNotes);
              if (data.myGlobalReview) localStorage.setItem("myGlobalReview", data.myGlobalReview);
              if (data.personalProfile) localStorage.setItem("personalProfile", data.personalProfile);
          } catch(e) { console.error(e); }
      }
      setCurrentUser(res.user);
      renderProfile();
      resetEconomyReminderSession(res.user.username);
      checkEconomyPopups();
      
    } else {
      errEl.textContent = res.error;
      errEl.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = "Войти";
    }
  });

  document.getElementById("auth-register-btn").addEventListener("click", async () => {
     errEl.classList.add("hidden");
     const username = document.getElementById("auth-username").value;
     const password = document.getElementById("auth-pass").value;
     if(!username || !password) {
       errEl.textContent = "Введите имя и пароль для регистрации";
       errEl.classList.remove("hidden");
       return;
     }

     const btn = document.getElementById("auth-register-btn");
     btn.disabled = true;
     btn.textContent = "Регистрация...";

     const localData = getLocalData();
     
     const res = await callApi({ action: 'register', username, password, localData: JSON.stringify(localData) });

     if (res.success) {
       if (res.userData) {
          try {
              const data = typeof res.userData === 'string' ? JSON.parse(res.userData) : res.userData;
              if (data.userRatings) localStorage.setItem("userRatings", data.userRatings);
              if (data.subscribedArtists) localStorage.setItem("subscribedArtists", data.subscribedArtists);
              if (data.huev_2026_watched) localStorage.setItem("huev_2026_watched", data.huev_2026_watched);
              if (data.reviewNotes) localStorage.setItem("reviewNotes", data.reviewNotes);
              if (data.myGlobalReview) localStorage.setItem("myGlobalReview", data.myGlobalReview);
              if (data.personalProfile) localStorage.setItem("personalProfile", data.personalProfile);
          } catch(e) { console.error(e); }
       }
       setCurrentUser(res.user);
      renderProfile();
      resetEconomyReminderSession(res.user.username);
      checkEconomyPopups();
      
     } else {
       errEl.textContent = res.error;
       errEl.classList.remove("hidden");
       btn.disabled = false;
       btn.textContent = "Или зарегистрироваться";
     }
  });
}

export function renderAdmin() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();
  if(!user || user.role !== 'moderator') {
    app.innerHTML = `<div class="p-20 text-center font-bold text-red-500 uppercase tracking-widest">Доступ запрещен</div>`;
    return;
  }

  // Refresh session in background
  refreshSession().then(async changed => {
    if (changed) {
      await fetchPublicData(true);
      renderAdmin();
    }
  });

  app.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-16 md:py-24 animate-slide-up">
      <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-12">
        <h1 class="font-serif font-black text-5xl md:text-7xl tracking-tighter uppercase drop-shadow-sm">Админка</h1>
        <a href="#/profile" class="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors">← В профиль</a>
      </div>
      
      <div id="admin-content" class="text-zinc-500 text-sm font-medium">Загрузка данных...</div>
    </div>
  `;

  loadAdminData(user);
}

async function loadAdminData(user) {
  const cnt = document.getElementById("admin-content");
  const res = await callApi({ action: 'getAdminData', username: user.username, token: user.token });
  
  if(!res.success) {
    cnt.innerHTML = `<div class="text-red-500">Ошибка загрузки: ${res.error}</div>`;
    return;
  }

  const requests = res.requests || [];
  const linkedUsers = res.linked || [];

  let reqHtml = "<div class='text-zinc-500 my-4'>Новых заявок нет</div>";
  if (requests.length > 0) {
    reqHtml = `<div class="space-y-4">` + requests.map(req => {
      const aId = req.artistId;
      const reqUser = req.username;
      const artist = getArtist(aId);
      const aTitle = artist ? artist.name : aId;
      return `
        <div class="flex flex-col sm:flex-row items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
          <div class="text-center sm:text-left mb-6 sm:mb-0"><strong class="text-zinc-900 dark:text-white text-2xl font-black tracking-tight block mb-1">${reqUser}</strong><span class="text-zinc-500 text-sm uppercase tracking-widest font-bold">запрос на: <span class="text-red-500">${aTitle}</span></span></div>
          <div class="flex gap-3 w-full sm:w-auto">
            <button class="approve-btn flex-1 sm:flex-none bg-black dark:bg-white text-white dark:text-black px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform" data-user="${reqUser}" data-artist="${aId}">Принять</button>
            <button class="reject-btn flex-1 sm:flex-none bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform" data-user="${reqUser}">Отказ</button>
          </div>
        </div>
      `;
    }).join("") + `</div>`;
  }

  let linkedHtml = "<div class='text-zinc-500 my-4'>Нет привязанных аккаунтов</div>";
  if (linkedUsers.length > 0) {
    linkedHtml = `<div class="space-y-4">` + linkedUsers.map(linked => {
      const aId = linked.artistId;
      const uName = linked.username;
      const artist = getArtist(aId);
      const aTitle = artist ? artist.name : aId;
      return `
        <div class="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm">
          <div class="text-center sm:text-left mb-6 sm:mb-0"><strong class="text-zinc-900 dark:text-white text-2xl font-black tracking-tight block mb-1">${uName}</strong><span class="text-zinc-400 text-sm font-bold uppercase tracking-widest">связан с: <span class="text-zinc-900 dark:text-white">${aTitle}</span></span></div>
          <button class="unlink-btn w-full sm:w-auto bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" data-user="${uName}">Отвязать</button>
        </div>
      `;
    }).join("") + `</div>`;
  }

  cnt.innerHTML = `
    <div class="mb-16">
      <h2 class="font-serif font-black text-3xl md:text-4xl uppercase tracking-tighter mb-8 text-zinc-900 dark:text-white">Заявки</h2>
      ${reqHtml}
    </div>
    <div>
      <h2 class="font-serif font-black text-3xl md:text-4xl uppercase tracking-tighter mb-8 text-zinc-900 dark:text-white">Привязки</h2>
      ${linkedHtml}
    </div>
  `;

  cnt.querySelectorAll(".approve-btn").forEach(b => {
    b.addEventListener("click", async (e) => {
      const targetUser = e.currentTarget.getAttribute("data-user");
      const aId = e.currentTarget.getAttribute("data-artist");
      const r = await callApi({ action: 'approveLink', username: user.username, token: user.token, targetUser, artistId: aId });
      if(r.success) {
        await fetchPublicData(true);
        loadAdminData(user);
      }
      else window.appAlert("Ошибка: " + r.error);
    });
  });

  cnt.querySelectorAll(".reject-btn").forEach(b => {
    b.addEventListener("click", async (e) => {
      const targetUser = e.currentTarget.getAttribute("data-user");
      const r = await callApi({ action: 'rejectLink', username: user.username, token: user.token, targetUser });
      if(r.success) {
        await fetchPublicData(true);
        loadAdminData(user);
      }
      else window.appAlert("Ошибка: " + r.error);
    });
  });

  cnt.querySelectorAll(".unlink-btn").forEach(b => {
    b.addEventListener("click", (e) => {
      const targetUser = e.currentTarget.getAttribute("data-user");
      window.appConfirm('Точно отвязать артиста у ' + targetUser + '?', async () => {
        const r = await callApi({ action: 'unlinkAccount', username: user.username, token: user.token, targetUser });
        if(r.success) {
          await fetchPublicData(true);
          loadAdminData(user);
        }
        else window.appAlert("Ошибка: " + r.error);
      });
    });
  });
}


export function renderProfile() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();
  if (!user) {
    // Just call the old login rendering which we left as renderArtistCard for unauth?
    // Wait, the old renderProfile handled login inside itself if no user.
    // So we just call renderArtistCard for login screen.
    renderArtistCard();
    return;
  }

  app.innerHTML = `
    <div class="max-w-4xl mx-auto py-12 px-6 animate-slide-up">
      <h2 class="font-serif font-black text-3xl md:text-4xl tracking-tighter uppercase mb-8 text-zinc-900 dark:text-white">Профиль</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="#/profile/personal" class="group block p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-red-500/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
           <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <div class="w-40 h-40 bg-red-500 rounded-full blur-3xl"></div>
           </div>
           <h3 class="font-serif font-black text-2xl uppercase tracking-widest text-zinc-900 dark:text-white mb-2 relative z-10">Личный профиль</h3>
           <p class="text-zinc-500 text-sm font-medium relative z-10">Настройки аватара, шапки, кастомного цвета и списка любимого.</p>
        </a>
        <a href="#/profile/artist" class="group block p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
           <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <div class="w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
           </div>
           <h3 class="font-serif font-black text-2xl uppercase tracking-widest text-zinc-900 dark:text-white mb-2 relative z-10">Карточка артиста</h3>
           <p class="text-zinc-500 text-sm font-medium relative z-10">Привязка артиста, редактирование описания и закрепов.</p>
        </a>
      </div>
      
      <div class="mt-12 flex flex-wrap gap-4 justify-center">
         ${user.role === 'moderator' ? `
            <a href="#/admin" class="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors shadow-lg">Админ-панель</a>
         ` : ''}
         <button id="profile-select-logout-btn" class="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-sm text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transform active:scale-95 duration-300">Выйти</button>
      </div>
    </div>
  `;

  document.getElementById("profile-select-logout-btn").addEventListener("click", () => {
    logoutUser();
    location.hash = "#/";
  });
}


function formatStatsHtml(stats) {
    const formatName = { 'digital': 'Цифровой', 'cd': 'CD', 'vinyl': 'Винил' };
    let artistName = "Нет данных";
    if (stats.reviewCounts && Object.keys(stats.reviewCounts).length > 0) {
        let maxCount = 0;
        let bestArtistId = null;
        let artistCounts = {};
        for (const [revId, count] of Object.entries(stats.reviewCounts)) {
            const rev = reviews.find(r => r.id === revId);
            if (rev) {
                artistCounts[rev.artistId] = (artistCounts[rev.artistId] || 0) + count;
            }
        }
        for (const [artId, count] of Object.entries(artistCounts)) {
            if (count > maxCount) {
                maxCount = count;
                bestArtistId = artId;
            }
        }
        if (bestArtistId) {
            const art = getArtist(bestArtistId);
            artistName = art ? art.name : bestArtistId;
        }
    }
    
    return `
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Любимый артист</span>
         <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate w-full" title="${artistName}">${artistName}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Коллекция</span>
         <span class="font-bold text-xl text-zinc-900 dark:text-zinc-100">${stats.collectionSize || 0}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Формат</span>
         <span class="font-bold text-sm text-zinc-900 dark:text-zinc-100">${stats.favFormat ? formatName[stats.favFormat] : 'Нет'}</span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Поинты</span>
         <span class="font-bold text-xl text-red-600 dark:text-red-500">${stats.expenses || 0} <span class="text-sm font-normal text-zinc-500">pts</span></span>
      </div>
      <div class="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-sm border border-zinc-200 dark:border-zinc-800">
         <span class="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Серия</span>
         <span class="font-bold text-xl text-zinc-900 dark:text-zinc-100">${stats.streak || 0} <span class="text-sm font-normal text-zinc-500">дн.</span></span>
      </div>
    `;
}

export async function renderPersonalProfile(isLoading = true) {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();
  if (!user) {
    window.location.hash = "#/profile";
    return;
  }

  if (isLoading) {
    app.innerHTML = `<div class="max-w-4xl mx-auto py-12 px-4 relative z-0 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in"><div class="w-12 h-12 border-4 border-zinc-200 border-t-red-500 rounded-full animate-spin"></div><div class="mt-4 font-bold text-zinc-500 uppercase tracking-widest text-sm">Синхронизация данных...</div></div>`;
    refreshSession().then(() => renderPersonalProfile(false));
    return;
  }

  const personalData = JSON.parse(localStorage.getItem("personalProfile") || "{}");
  const avatarUrl = personalData.avatarUrl || "";
  const bannerUrl = personalData.bannerUrl || "";
  const nicknameColor = personalData.nicknameColor || "inherit";
  const favorites = personalData.favorites || [];

  const initial = user.username.charAt(0).toUpperCase();

  let avatarHtml = avatarUrl 
    ? `<img src="${avatarUrl}" class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover shadow-2xl border-4 border-white dark:border-black relative z-10">`
    : `<div class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex items-center justify-center text-6xl font-serif font-black shadow-inner border-4 border-white dark:border-black relative z-10">${initial}</div>`;

  let bannerHtml = bannerUrl
    ? `<div class="absolute inset-0 w-full h-48 md:h-64 overflow-hidden -z-10 rounded-t-[2rem]"><img src="${bannerUrl}" class="w-full h-full object-cover opacity-60 dark:opacity-40"><div class="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent"></div></div>`
    : `<div class="absolute inset-0 w-full h-48 md:h-64 bg-zinc-100 dark:bg-zinc-900 -z-10 rounded-t-[2rem]"></div>`;

  app.innerHTML = `
    <div class="max-w-4xl mx-auto py-12 px-4 relative z-0 animate-slide-up">
       <a href="#/profile" class="inline-flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white mb-6 font-bold uppercase tracking-widest text-xs transition-colors">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         Назад
       </a>

       <div class="bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 relative z-0 shadow-xl pb-10">
         ${bannerHtml}
         
         <div class="pt-24 md:pt-40 text-center px-4">
           <div class="relative inline-block group">
             ${avatarHtml}
             <button id="upload-avatar-btn" class="absolute inset-0 m-auto w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
             </button>
           </div>
           
           <h3 id="profile-username" class="font-serif font-black text-3xl mt-4 transition-colors duration-300" style="color: ${nicknameColor}">${user.username}</h3>
           
           <div class="mt-4 flex justify-center">
             <button id="upload-banner-btn" class="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full">Изменить шапку</button>
           </div>
         </div>
         
         <div class="px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4">Цвет никнейма</h4>
               <div class="flex flex-wrap gap-2" id="color-picker">
                 ${['inherit', '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#d946ef', '#f43f5e', '#ffffff', '#000000', '#52525b', '#eab308'].map(c => 
                   `<button class="w-8 h-8 rounded-full border-2 ${nicknameColor === c ? 'border-red-500' : 'border-transparent'} shadow-sm hover:scale-110 transition-transform" style="background: ${c === 'inherit' ? 'linear-gradient(45deg, #000, #fff)' : c}" data-color="${c}"></button>`
                 ).join('')}
               </div>
            </div>
            
            <div>
               <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4">О себе</h4>
               <textarea id="profile-bio" rows="3" placeholder="Расскажите немного о себе..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white mb-4 resize-none">${personalData.bio || ''}</textarea>
               
               <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4">Местоимения</h4>
               <div class="relative mb-2">
                 <button id="profile-pronouns-btn" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white flex justify-between items-center">
                    <span id="profile-pronouns-label">
                       ${personalData.pronouns && !['он/его', 'она/её', 'они/их'].includes(personalData.pronouns) ? 'Свой вариант...' : (personalData.pronouns || 'Не указано')}
                    </span>
                    <svg class="w-4 h-4 text-zinc-500 transition-transform" id="profile-pronouns-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                 </button>
                 <div id="profile-pronouns-dropdown" class="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden overflow-hidden">
                    <button class="pronouns-option w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 transition-colors" data-value="">Не указано</button>
                    <button class="pronouns-option w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 transition-colors" data-value="он/его">он/его</button>
                    <button class="pronouns-option w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 transition-colors" data-value="она/её">она/её</button>
                    <button class="pronouns-option w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 transition-colors" data-value="они/их">они/их</button>
                    <button class="pronouns-option w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 transition-colors" data-value="custom">Свой вариант...</button>
                 </div>
               </div>
               <input type="text" id="profile-pronouns-custom" placeholder="Введите свои местоимения..." value="${escapeHTML(personalData.pronouns && !['он/его', 'она/её', 'они/их'].includes(personalData.pronouns) ? personalData.pronouns : '')}" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white ${personalData.pronouns && !['он/его', 'она/её', 'они/их'].includes(personalData.pronouns) ? '' : 'hidden'}" />
            </div>
         </div>
         
         <div class="px-6 md:px-12 mt-12 mb-8 w-full">
            <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4 flex justify-between items-center">Любимые релизы (До 3) <button id="add-favorite-btn" class="text-red-500 hover:text-red-600 transition-transform hover:scale-125">+</button></h4>
            
            <div id="favorite-search-container" class="hidden relative mb-4">
              <input type="text" id="favorite-search-input" placeholder="Поиск релиза..." class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-zinc-900 dark:text-white font-medium shadow-inner" autocomplete="off"/>
              <div id="favorite-search-dropdown" class="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] hidden max-h-60 overflow-y-auto overflow-x-hidden"></div>
            </div>

            <div id="favorites-list" class="${favorites.length === 0 ? '' : 'grid grid-cols-3 gap-4'}">
              ${favorites.length === 0 ? '<div class="text-sm text-zinc-500">Пока ничего нет</div>' : favorites.map((favId, idx) => {
                 const r = reviews.find(rev => rev.id === favId);
                 if(!r) return '';
                 const isAlbum = !r.isSingle && r.tracks && r.tracks.length > 0;
                 let trackSelectorHtml = '';
                 if (isAlbum) {
                    const selectedTracks = (personalData.favoriteTracks && personalData.favoriteTracks[r.id]) || [];
                    trackSelectorHtml = `
                      <div class="mt-2 text-xs">
                        ${selectedTracks.map(t => `<div class="truncate text-zinc-700 dark:text-zinc-300 flex items-center justify-between group/track mt-1">
                           <span class="truncate pr-2">• ${escapeHTML(t)}</span>
                           <button class="remove-track-btn opacity-100 lg:opacity-0 lg:group-hover/track:opacity-100 text-red-500 hover:text-red-600 ml-1 flex-shrink-0" data-revid="${r.id}" data-track="${escapeHTML(t)}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                        </div>`).join('')}
                        ${selectedTracks.length < 3 ? `<button class="add-track-btn text-red-500 hover:text-red-600 mt-2 font-medium transition-colors" data-revid="${r.id}">+ Выбрать трек</button>` : ''}
                      </div>
                    `;
                 }
                 return `<div class="block group relative">
                     <a href="#/reviews/${r.id}" class="block">
                       <div class="aspect-square mb-3 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
                           <img src="${r.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                       <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">${r.title}</div>
                       <div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>
                     </a>
                     ${trackSelectorHtml}
                     <button class="remove-fav-btn opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all absolute top-2 right-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-sm" data-idx="${idx}">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                     </button>
                   </div>`;
              }).join('')}
            </div>
         </div>


         <div id="personal-stats-container" class="px-6 md:px-12 mt-12 w-full">
            <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Персональная статистика</h4>
            <div id="personal-stats-content" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
                <div class="animate-pulse bg-zinc-100 dark:bg-zinc-800 h-24 rounded-2xl"></div>
            </div>
         </div>
         <div class="px-6 md:px-12 mt-4 mb-8 w-full flex justify-center border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <button id="profile-settings-btn" class="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               Настройки
            </button>
         </div>
       </div>
    </div>
  `;

  // Attach events
  document.querySelectorAll('#color-picker button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const c = e.target.getAttribute('data-color');
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      data.nicknameColor = c;
      localStorage.setItem('personalProfile', JSON.stringify(data));
      
      const titleEl = document.getElementById('profile-username');
      if (titleEl) titleEl.style.color = c;
      
      document.querySelectorAll('#color-picker button').forEach(b => {
         b.classList.remove('border-red-500');
         b.classList.add('border-transparent');
      });
      e.currentTarget.classList.remove('border-transparent');
      e.currentTarget.classList.add('border-red-500');
      
      syncUserLocalData();
    });
  });

  const bioInput = document.getElementById('profile-bio');
  const pronounsBtn = document.getElementById('profile-pronouns-btn');
  const pronounsDropdown = document.getElementById('profile-pronouns-dropdown');
  const pronounsIcon = document.getElementById('profile-pronouns-icon');
  const pronounsLabel = document.getElementById('profile-pronouns-label');
  const pronounsCustom = document.getElementById('profile-pronouns-custom');

  let bioTimeout;
  if (bioInput) {
    bioInput.addEventListener('input', (e) => {
       clearTimeout(bioTimeout);
       bioTimeout = setTimeout(() => {
          const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
          data.bio = e.target.value.trim();
          localStorage.setItem('personalProfile', JSON.stringify(data));
          syncUserLocalData();
       }, 500);
    });
  }

  if (pronounsBtn && pronounsDropdown) {
    pronounsBtn.addEventListener('click', (e) => {
       e.stopPropagation();
       pronounsDropdown.classList.toggle('hidden');
       pronounsIcon.style.transform = pronounsDropdown.classList.contains('hidden') ? '' : 'rotate(180deg)';
    });

    document.addEventListener('click', (e) => {
       if (!pronounsBtn.contains(e.target) && !pronounsDropdown.contains(e.target)) {
          pronounsDropdown.classList.add('hidden');
          pronounsIcon.style.transform = '';
       }
    });

    pronounsDropdown.querySelectorAll('.pronouns-option').forEach(btn => {
       btn.addEventListener('click', (e) => {
          const val = e.currentTarget.dataset.value;
          const text = e.currentTarget.textContent;
          pronounsLabel.textContent = text;
          pronounsDropdown.classList.add('hidden');
          pronounsIcon.style.transform = '';

          const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
          if (val === 'custom') {
             pronounsCustom.classList.remove('hidden');
             pronounsCustom.focus();
          } else {
             pronounsCustom.classList.add('hidden');
             data.pronouns = val;
             localStorage.setItem('personalProfile', JSON.stringify(data));
             syncUserLocalData();
          }
       });
    });
  }

  let pronounsTimeout;
  if (pronounsCustom) {
     pronounsCustom.addEventListener('input', (e) => {
        clearTimeout(pronounsTimeout);
        pronounsTimeout = setTimeout(() => {
           const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
           data.pronouns = e.target.value.trim();
           localStorage.setItem('personalProfile', JSON.stringify(data));
           syncUserLocalData();
        }, 500);
     });
  }

  
  async function handleUpload(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        window.appAlert("Файл слишком большой! Максимум 3 Мб.");
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.username}_${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const btn = document.getElementById(`upload-${type}-btn`);
      let originalText = "";
      if (btn) {
         originalText = btn.innerHTML;
         btn.innerHTML = "Загрузка...";
      }
      
      const { data, error } = await supabase.storage.from('profiles').upload(fileName, file);
      
      if (error) {
        window.appAlert("Ошибка загрузки: " + error.message);
        if (btn) btn.innerHTML = originalText;
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
      
      const pData = JSON.parse(localStorage.getItem("personalProfile") || "{}");
      if (type === 'avatar') pData.avatarUrl = publicUrl;
      if (type === 'banner') pData.bannerUrl = publicUrl;
      localStorage.setItem("personalProfile", JSON.stringify(pData));
      
      syncUserLocalData().then(() => renderPersonalProfile(false));
    };
    input.click();
  }

  document.getElementById("upload-avatar-btn").addEventListener("click", () => handleUpload('avatar'));
  document.getElementById("upload-banner-btn").addEventListener("click", () => handleUpload('banner'));


  // Favorites Logic
  const addFavBtn = document.getElementById('add-favorite-btn');
  const favSearchContainer = document.getElementById('favorite-search-container');
  const favSearchInput = document.getElementById('favorite-search-input');
  const favSearchDropdown = document.getElementById('favorite-search-dropdown');

  if (addFavBtn) {
    addFavBtn.addEventListener('click', () => {
      if (favorites.length >= 3) {
        window.appAlert("Максимум 3 любимых релиза.");
        return;
      }
      favSearchContainer.classList.remove('hidden');
      favSearchInput.focus();
    });
  }

  if (favSearchInput) {
    favSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        favSearchDropdown.classList.add('hidden');
        return;
      }
      
      const matches = reviews.filter(r => r.title.toLowerCase().includes(q) || (getArtist(r.artistId) && getArtist(r.artistId).name.toLowerCase().includes(q))).slice(0, 10);
      
      if (matches.length > 0) {
        favSearchDropdown.innerHTML = matches.map(r => `<button class="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 flex items-center gap-3 fav-result-item" data-id="${r.id}">
            <img src="${r.cover}" class="w-10 h-10 object-cover rounded shadow-sm" />
            <div class="flex-grow min-w-0">
               <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">${r.title}</div>
               <div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>
            </div>
          </button>`).join('');
        favSearchDropdown.classList.remove('hidden');
        
        document.querySelectorAll('.fav-result-item').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            const id = ev.currentTarget.getAttribute('data-id');
            const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
            if (!data.favorites) data.favorites = [];
            if (!data.favorites.includes(id) && data.favorites.length < 3) {
               data.favorites.push(id);
               localStorage.setItem('personalProfile', JSON.stringify(data));
               syncUserLocalData().then(() => renderPersonalProfile(false));
            } else {
               favSearchContainer.classList.add('hidden');
               favSearchInput.value = '';
            }
          });
        });
      } else {
        favSearchDropdown.innerHTML = '<div class="p-4 text-center text-zinc-500 text-sm">Ничего не найдено</div>';
        favSearchDropdown.classList.remove('hidden');
      }
    });
  }

  document.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      if (data.favorites) {
        const removedFav = data.favorites[idx];
        data.favorites.splice(idx, 1);
        if (data.favoriteTracks && data.favoriteTracks[removedFav]) {
           delete data.favoriteTracks[removedFav];
        }
        localStorage.setItem('personalProfile', JSON.stringify(data));
        syncUserLocalData().then(() => renderPersonalProfile(false));
      }
    });
  });

  document.querySelectorAll('.remove-track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const revid = e.currentTarget.getAttribute('data-revid');
      const track = e.currentTarget.getAttribute('data-track');
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      if (data.favoriteTracks && data.favoriteTracks[revid]) {
         data.favoriteTracks[revid] = data.favoriteTracks[revid].filter(t => t !== track);
         if (data.favoriteTracks[revid].length === 0) delete data.favoriteTracks[revid];
         localStorage.setItem('personalProfile', JSON.stringify(data));
         syncUserLocalData().then(() => renderPersonalProfile(false));
      }
    });
  });

  document.querySelectorAll('.add-track-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const revid = e.currentTarget.getAttribute('data-revid');
      const r = reviews.find(rev => rev.id === revid);
      if (!r) return;
      
      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
      
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      const selectedTracks = (data.favoriteTracks && data.favoriteTracks[revid]) || [];
      
      modal.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transform transition-all">
           <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 class="font-serif font-black text-xl uppercase tracking-widest">Выберите треки</h2>
              <button id="close-tracks-modal" class="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
           </div>
           
           <div class="p-0 max-h-[60vh] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50">
              ${r.tracks.map((t, idx) => {
                 const titleStr = typeof t === 'string' ? t : t.title;
                 const isChecked = selectedTracks.includes(titleStr);
                 const isDisabled = !isChecked && selectedTracks.length >= 3;
                 return `
                 <label class="flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}">
                    <div class="relative flex items-center justify-center w-5 h-5 shrink-0">
                       <input type="checkbox" value="${escapeHTML(titleStr)}" class="track-checkbox sr-only" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                       <div class="custom-checkbox w-5 h-5 rounded flex items-center justify-center transition-colors border-2 ${isChecked ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900' : 'bg-transparent border-zinc-300 dark:border-zinc-700 text-transparent'}">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                       </div>
                    </div>
                    <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">${escapeHTML(titleStr)}</span>
                 </label>`;
              }).join('')}
           </div>
           <div class="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
              <button id="save-tracks-btn" class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-md">Сохранить</button>
           </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#close-tracks-modal');
      closeBtn.addEventListener('click', () => {
         modal.classList.add("opacity-0");
         setTimeout(() => modal.remove(), 300);
      });
      
      const checkboxes = modal.querySelectorAll('.track-checkbox');
      checkboxes.forEach(cb => {
         cb.addEventListener('change', (e) => {
            const checkedCount = modal.querySelectorAll('.track-checkbox:checked').length;
            
            const customBox = e.target.nextElementSibling;
            if (e.target.checked) {
               customBox.classList.remove('bg-transparent', 'border-zinc-300', 'dark:border-zinc-700', 'text-transparent');
               customBox.classList.add('bg-zinc-900', 'dark:bg-white', 'border-zinc-900', 'dark:border-white', 'text-white', 'dark:text-zinc-900');
            } else {
               customBox.classList.add('bg-transparent', 'border-zinc-300', 'dark:border-zinc-700', 'text-transparent');
               customBox.classList.remove('bg-zinc-900', 'dark:bg-white', 'border-zinc-900', 'dark:border-white', 'text-white', 'dark:text-zinc-900');
            }
            
            if (checkedCount >= 3) {
               checkboxes.forEach(c => {
                  if (!c.checked) {
                     c.disabled = true;
                     c.closest('label').classList.add('opacity-50', 'cursor-not-allowed');
                     c.closest('label').classList.remove('hover:bg-zinc-50', 'dark:hover:bg-zinc-900/50');
                  }
               });
            } else {
               checkboxes.forEach(c => {
                  c.disabled = false;
                  c.closest('label').classList.remove('opacity-50', 'cursor-not-allowed');
                  c.closest('label').classList.add('hover:bg-zinc-50', 'dark:hover:bg-zinc-900/50');
               });
            }
         });
      });

      const saveBtn = modal.querySelector('#save-tracks-btn');
      saveBtn.addEventListener('click', () => {
         const checked = Array.from(modal.querySelectorAll('.track-checkbox:checked')).map(cb => cb.value);
         if (!data.favoriteTracks) data.favoriteTracks = {};
         if (checked.length > 0) {
            data.favoriteTracks[revid] = checked;
         } else {
            delete data.favoriteTracks[revid];
         }
         localStorage.setItem('personalProfile', JSON.stringify(data));
         syncUserLocalData().then(() => renderPersonalProfile(false));
         
         modal.classList.add("opacity-0");
         setTimeout(() => modal.remove(), 300);
      });
    });
  });

  const statsContainer = document.getElementById('personal-stats-content');
  if (statsContainer) {
      callApi({ action: 'getUserStats', targetUsername: user.username }).then(res => {
          if (res.success) {
              statsContainer.innerHTML = formatStatsHtml(res.stats);
          } else {
              statsContainer.innerHTML = '<div class="col-span-full text-center text-sm text-zinc-500">Не удалось загрузить статистику</div>';
          }
      });
  }

  const settingsBtn = document.getElementById('profile-settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      const isSearchable = data.searchable !== false; // default true
      const isPrivate = data.privateProfile === true; // default false

      const modal = document.createElement("div");
      modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
      modal.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transform transition-all">
           <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 class="font-serif font-black text-xl uppercase tracking-widest">Настройки</h2>
              <button id="close-settings" class="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
           </div>
           
           <div class="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              <div>
                 <h3 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4">Приватность</h3>
                 <div class="space-y-4">
                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Видимость в поиске</span>
                       <div class="relative">
                          <input type="checkbox" id="settings-searchable" class="sr-only" ${isSearchable ? 'checked' : ''}>
                          <div class="block bg-zinc-200 dark:bg-zinc-800 w-10 h-6 rounded-full transition-colors toggle-bg"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${isSearchable ? 'translate-x-4' : ''}"></div>
                       </div>
                    </label>
                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Показывать статистику</span>
                       <div class="relative">
                          <input type="checkbox" id="settings-show-stats" class="sr-only" ${data.showStats !== false ? 'checked' : ''}>
                          <div class="block bg-zinc-200 dark:bg-zinc-800 w-10 h-6 rounded-full transition-colors toggle-bg"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${data.showStats !== false ? 'translate-x-4' : ''}"></div>
                       </div>
                    </label>
                    <label class="flex items-center justify-between cursor-pointer group">
                       <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">Закрытый профиль</span>
                       <div class="relative">
                          <input type="checkbox" id="settings-private" class="sr-only" ${isPrivate ? 'checked' : ''}>
                          <div class="block bg-zinc-200 dark:bg-zinc-800 w-10 h-6 rounded-full transition-colors toggle-bg"></div>
                          <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform toggle-dot ${isPrivate ? 'translate-x-4' : ''}"></div>
                       </div>
                    </label>
                 </div>
              </div>

              <div>
                 <h3 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-4">Аккаунт</h3>
                 <div class="space-y-3">
                    <button id="btn-change-username" class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Смена ника</button>
                    <button id="btn-change-password" class="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Смена пароля</button>
                    <button id="btn-delete-account" class="w-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left">Удаление / заморозка аккаунта</button>
                 </div>
              </div>
           </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#close-settings');
      closeBtn.addEventListener('click', () => {
         modal.classList.add("opacity-0");
         setTimeout(() => modal.remove(), 300);
      });

      const searchableToggle = modal.querySelector('#settings-searchable');
      const privateToggle = modal.querySelector('#settings-private');

      function updateToggleStyle(input) {
         const bg = input.nextElementSibling;
         const dot = bg.nextElementSibling;
         if (input.checked) {
            bg.classList.remove('bg-zinc-200', 'dark:bg-zinc-800');
            bg.classList.add('bg-red-500', 'dark:bg-red-500');
            dot.classList.add('translate-x-4');
         } else {
            bg.classList.remove('bg-red-500', 'dark:bg-red-500');
            bg.classList.add('bg-zinc-200', 'dark:bg-zinc-800');
            dot.classList.remove('translate-x-4');
         }
      }

      updateToggleStyle(searchableToggle);
      updateToggleStyle(privateToggle);

      searchableToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.searchable = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });

      const showStatsToggle = modal.querySelector('#settings-show-stats');
      updateToggleStyle(showStatsToggle);
      showStatsToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.showStats = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });

      privateToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.privateProfile = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });

      const btnChangeUsername = modal.querySelector('#btn-change-username');
      btnChangeUsername.addEventListener('click', () => {
         appPrompt("Смена ника", "Новый ник", false, (newUsername) => {
             const currUser = JSON.parse(localStorage.getItem("hf_user") || "{}");
             if (newUsername === currUser.username) return;
             
             const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
             callApi({
                 action: 'changeUsername',
                 username: currentUser.username,
                 token: currentUser.token,
                 newUsername: newUsername
             }).then(res => {
                 if (res.success) {
                     appAlert("Ник успешно изменен!");
                     currentUser.username = res.newUsername;
                     localStorage.setItem('hf_user', JSON.stringify(currentUser));
                     setTimeout(() => window.location.reload(), 1500);
                 } else {
                     appAlert(res.error || "Ошибка смены ника");
                 }
             });
         });
      });

      const btnChangePassword = modal.querySelector('#btn-change-password');
      btnChangePassword.addEventListener('click', () => {
         appPrompt("Текущий пароль", "Введите пароль", true, (oldPassword) => {
             appPrompt("Новый пароль", "Не менее 6 символов", true, (newPassword) => {
                 const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                 callApi({
                     action: 'changePassword',
                     username: currentUser.username,
                     token: currentUser.token,
                     oldPassword: oldPassword,
                     newPassword: newPassword
                 }).then(res => {
                     if (res.success) {
                         appAlert("Пароль успешно изменен!");
                         currentUser.token = res.newToken;
                         localStorage.setItem('hf_user', JSON.stringify(currentUser));
                     } else {
                         appAlert(res.error || "Ошибка смены пароля");
                     }
                 });
             });
         });
      });

      const btnDeleteAccount = modal.querySelector('#btn-delete-account');
      btnDeleteAccount.addEventListener('click', () => {
         appConfirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.", () => {
             appPrompt("Подтверждение", "Введите пароль", true, (password) => {
                 const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                 callApi({
                     action: 'deleteAccount',
                     username: currentUser.username,
                     token: currentUser.token,
                     password: password
                 }).then(res => {
                     if (res.success) {
                         appAlert("Аккаунт успешно удален.");
                         localStorage.removeItem('hf_user');
                         setTimeout(() => {
                            window.location.hash = '#/';
                            window.location.reload();
                         }, 1500);
                     } else {
                         appAlert(res.error || "Ошибка удаления аккаунта");
                     }
                 });
             });
         });
      });

    });
  }

}

export async function renderPublicProfile(username) {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  app.innerHTML = `<div class="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in"><div class="w-12 h-12 border-4 border-zinc-200 border-t-red-500 rounded-full animate-spin"></div></div>`;

  const res = await callApi({ action: 'getUserPublicProfile', targetUsername: username });
  if (!res.success) {
      app.innerHTML = `<div class="max-w-4xl mx-auto py-12 px-4 text-center">
         <h1 class="text-3xl font-bold mb-4">Пользователь не найден</h1>
         <a href="#/" class="text-red-500 font-bold uppercase tracking-widest text-xs">На главную</a>
      </div>`;
      return;
  }

  const profile = res.profile;
  const avatarUrl = profile.avatarUrl || "";
  const bannerUrl = profile.bannerUrl || "";
  const nicknameColor = profile.nicknameColor || "inherit";
  const favorites = profile.favorites || [];

  const initial = profile.username.charAt(0).toUpperCase();

  let avatarHtml = avatarUrl 
    ? `<img src="${avatarUrl}" class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover shadow-2xl border-4 border-white dark:border-black relative z-10">`
    : `<div class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex items-center justify-center text-6xl font-serif font-black shadow-inner border-4 border-white dark:border-black relative z-10">${initial}</div>`;

  let bannerHtml = bannerUrl
    ? `<div class="absolute inset-0 w-full h-48 md:h-64 overflow-hidden -z-10 rounded-t-[2rem]"><img src="${bannerUrl}" class="w-full h-full object-cover opacity-60 dark:opacity-40"><div class="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent"></div></div>`
    : `<div class="absolute inset-0 w-full h-48 md:h-64 bg-zinc-100 dark:bg-zinc-900 -z-10 rounded-t-[2rem]"></div>`;

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser && currentUser.username === profile.username;
  
  const editBtnHtml = isOwnProfile ? `<a href="#/profile/personal" class="absolute top-6 right-6 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white transition-all shadow-sm z-20">Редактировать</a>` : '';

  let favHtml = '<div class="text-sm text-zinc-500">Пока ничего нет</div>';
  if (favorites.length > 0) {
      favHtml = `<div class="grid grid-cols-3 gap-4">` + favorites.map(favId => {
          const r = reviews.find(rev => rev.id === favId);
          if(!r) return '';
          const isAlbum = !r.isSingle && r.tracks && r.tracks.length > 0;
          let trackSelectorHtml = '';
          if (isAlbum) {
             const selectedTracks = (profile.favoriteTracks && profile.favoriteTracks[r.id]) || [];
             if (selectedTracks.length > 0) {
                 trackSelectorHtml = `<div class="mt-2 text-xs">
                     ${selectedTracks.map(t => `<div class="truncate text-zinc-700 dark:text-zinc-300 flex items-center mt-1">
                        <span class="truncate pr-2">• ${escapeHTML(t)}</span>
                     </div>`).join('')}
                 </div>`;
             }
          }
          return `<div class="block group">
              <a href="#/reviews/${r.id}" class="block">
                <div class="aspect-square mb-3 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <img src="${r.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="font-bold text-sm text-zinc-900 dark:text-white truncate">${r.title}</div>
                <div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>
              </a>
              ${trackSelectorHtml}
          </div>`;
      }).join('') + `</div>`;
  }

  let profileContentHtml = '';
  
  if (profile.privateProfile && !isOwnProfile) {
     profileContentHtml = `
       <div class="px-6 md:px-12 mt-12 w-full text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h14a2 2 0 012 2z"></path><path d="M16 11V7a4 4 0 00-8 0v4"></path></svg>
          </div>
          <h4 class="font-bold text-sm text-zinc-900 dark:text-zinc-100">Профиль скрыт настройками приватности</h4>
       </div>
     `;
  } else {
     profileContentHtml = `
       ${profile.bio ? `
       <div class="px-6 md:px-12 mt-8 w-full max-w-2xl mx-auto text-center">
          <p class="text-sm md:text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">${escapeHTML(profile.bio)}</p>
       </div>
       ` : ''}
       
       <div class="px-6 md:px-12 mt-12 w-full">
          <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Любимые релизы</h4>
          ${favHtml}
       </div>
     `;
  }

  app.innerHTML = `
    <div class="max-w-4xl mx-auto py-12 px-4 relative z-0 animate-slide-up">
       <button class="back-button inline-flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white mb-6 font-bold uppercase tracking-widest text-xs transition-colors">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
         Назад
       </button>
       <div class="bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 relative z-0 shadow-xl pb-10 overflow-hidden">
         ${bannerHtml}
         ${editBtnHtml}
         
         <div class="pt-24 md:pt-40 text-center px-4 relative z-10">
           ${avatarHtml}
           <h3 class="font-serif font-black text-3xl mt-4" style="color: ${nicknameColor}">${profile.username}</h3>
           ${profile.pronouns ? `<div class="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500">${escapeHTML(profile.pronouns)}</div>` : ''}
         </div>
         
         ${profileContentHtml}
       </div>
    </div>
  `;

  if (!profile.privateProfile || isOwnProfile) {
      callApi({ action: 'getUserStats', targetUsername: username }).then(statsRes => {
          if (statsRes.success && statsRes.stats.showStats !== false) {
              const statsContainer = document.createElement('div');
              statsContainer.className = "px-6 md:px-12 mt-4 mb-8 w-full";
              statsContainer.innerHTML = `
                <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Персональная статистика</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    ${formatStatsHtml(statsRes.stats)}
                </div>
              `;
              app.querySelector(".shadow-xl").appendChild(statsContainer);
          }
      });
  }
}
