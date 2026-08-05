const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const oldUpdateSearch = `  const filteredArtists = artists
    .filter(
      (a) => a.name.toLowerCase().includes(query) && a.id !== "various-artists",
    )
    .slice(0, 3);

  let html = "";`;

const newUpdateSearch = `  const filteredArtists = artists
    .filter(
      (a) => a.name.toLowerCase().includes(query) && a.id !== "various-artists",
    )
    .slice(0, 3);

  let html = "";
  
  if (window.searchUsersTimeout) clearTimeout(window.searchUsersTimeout);
  window.searchUsersTimeout = setTimeout(async () => {
     if (!searchResults || searchResults.classList.contains('hidden') || searchInput.value.trim().toLowerCase() !== query) return;
     const res = await callApi({ action: 'searchUsers', query });
     if (res.success && res.users.length > 0) {
        let usersHtml = \`<div class="p-2 border-t border-zinc-100 dark:border-zinc-800" id="search-users-results">
           <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">Пользователи</div>\`;
        res.users.forEach(u => {
           let avatar = u.avatar && u.avatar.startsWith('http') ? \`<img src="\${u.avatar}" class="w-8 h-8 rounded-full object-cover">\` : \`<div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">\${u.username.charAt(0).toUpperCase()}</div>\`;
           usersHtml += \`<a href="#/users/\${encodeURIComponent(u.username)}" class="search-link flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-sm">\${avatar}<span class="font-bold text-sm text-zinc-900 dark:text-white">\${u.username}</span></a>\`;
        });
        usersHtml += \`</div>\`;
        
        // Remove old users block if exists
        const oldUsers = searchResults.querySelector('#search-users-results');
        if (oldUsers) oldUsers.remove();
        
        // if no content at all, clear the "Nothing found"
        if (searchResults.innerHTML.includes('Ничего не найдено') || searchResults.innerHTML.includes('По вашему запросу ничего не найдено')) {
           searchResults.innerHTML = usersHtml;
        } else {
           searchResults.innerHTML += usersHtml;
        }
        
        document.querySelectorAll(".search-link").forEach((link) => {
          link.addEventListener("click", () => {
            saveSearchHistory(query);
            closeSearch();
          });
        });
     }
  }, 300);`;

code = code.replace(oldUpdateSearch, newUpdateSearch);
fs.writeFileSync('main.js', code);
