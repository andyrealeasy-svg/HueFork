const fs = require('fs');

let code = fs.readFileSync('profile.js', 'utf8');

// 1. Add back button to renderArtistCard (around line 208)
code = code.replace(
  '<div class="text-center">',
  '<a href="#/profile" class="inline-flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white mb-6 font-bold uppercase tracking-widest text-xs transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Назад</a>\n      <div class="text-center">'
);

// 2. Add animate-slide-up to renderProfile
code = code.replace(
  '<div class="max-w-4xl mx-auto py-12 px-6">',
  '<div class="max-w-4xl mx-auto py-12 px-6 animate-slide-up">'
);

// 3. Add animate-slide-up and ID to renderPersonalProfile
code = code.replace(
  '<div class="max-w-4xl mx-auto py-12 px-4 relative z-0">',
  '<div class="max-w-4xl mx-auto py-12 px-4 relative z-0 animate-slide-up">'
);
code = code.replace(
  '<h3 class="font-serif font-black text-3xl mt-4" style="color: ${nicknameColor}">${user.username}</h3>',
  '<h3 id="profile-username" class="font-serif font-black text-3xl mt-4 transition-colors duration-300" style="color: ${nicknameColor}">${user.username}</h3>'
);

// 4. Update the nickname color click listener
const oldColorLogic = `    btn.addEventListener('click', (e) => {
      const c = e.target.getAttribute('data-color');
      const data = JSON.parse(localStorage.getItem('personalProfile') || "{}");
      data.nicknameColor = c;
      localStorage.setItem('personalProfile', JSON.stringify(data));
      syncUserLocalData().then(() => renderPersonalProfile());
    });`;

const newColorLogic = `    btn.addEventListener('click', (e) => {
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
    });`;

code = code.replace(oldColorLogic, newColorLogic);

// 5. Update favorites search logic and template (artist id to artist name)
code = code.replace(
  'const matches = reviews.filter(r => r.title.toLowerCase().includes(q) || r.artist.toLowerCase().includes(q)).slice(0, 10);',
  'const matches = reviews.filter(r => r.title.toLowerCase().includes(q) || (getArtist(r.artistId) && getArtist(r.artistId).name.toLowerCase().includes(q))).slice(0, 10);'
);

code = code.replace(
  '<div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${r.artist}</div>',
  '<div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>'
);
code = code.replace(
  '<div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${r.artist}</div>',
  '<div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>'
);

// 6. Update handleUpload alert to window.appAlert
code = code.replace(
  'alert("Файл слишком большой! Максимум 3 Мб.");',
  'window.appAlert("Файл слишком большой! Максимум 3 Мб.");'
);
code = code.replace(
  'alert("Ошибка загрузки: " + error.message);',
  'window.appAlert("Ошибка загрузки: " + error.message);'
);

fs.writeFileSync('profile.js', code);
