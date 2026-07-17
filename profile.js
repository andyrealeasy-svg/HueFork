import { callApi, getCurrentUser, setCurrentUser, logoutUser, refreshSession } from './api.js';

import { artists, reviews, getReview, getArtist } from './data.js';

let publicDataCache = null;

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

export function renderProfile() {
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
      reviewNotes: localStorage.getItem("reviewNotes") || "{}"
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
          } catch(e) { console.error(e); }
      }
      setCurrentUser(res.user);
      renderProfile();
      
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
          } catch(e) { console.error(e); }
       }
       setCurrentUser(res.user);
      renderProfile();
      
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
