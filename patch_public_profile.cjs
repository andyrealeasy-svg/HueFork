const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const newFunc = `
export async function renderPublicProfile(username) {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  app.innerHTML = \`<div class="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in"><div class="w-12 h-12 border-4 border-zinc-200 border-t-red-500 rounded-full animate-spin"></div></div>\`;

  const res = await callApi({ action: 'getUserPublicProfile', targetUsername: username });
  if (!res.success) {
      app.innerHTML = \`<div class="max-w-4xl mx-auto py-12 px-4 text-center">
         <h1 class="text-3xl font-bold mb-4">Пользователь не найден</h1>
         <a href="#/" class="text-red-500 font-bold uppercase tracking-widest text-xs">На главную</a>
      </div>\`;
      return;
  }

  const profile = res.profile;
  const avatarUrl = profile.avatarUrl || "";
  const bannerUrl = profile.bannerUrl || "";
  const nicknameColor = profile.nicknameColor || "inherit";
  const favorites = profile.favorites || [];

  const initial = profile.username.charAt(0).toUpperCase();

  let avatarHtml = avatarUrl 
    ? \`<img src="\${avatarUrl}" class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover shadow-2xl border-4 border-white dark:border-black relative z-10">\`
    : \`<div class="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 flex items-center justify-center text-6xl font-serif font-black shadow-inner border-4 border-white dark:border-black relative z-10">\${initial}</div>\`;

  let bannerHtml = bannerUrl
    ? \`<div class="absolute inset-0 w-full h-48 md:h-64 overflow-hidden -z-10 rounded-t-[2rem]"><img src="\${bannerUrl}" class="w-full h-full object-cover opacity-60 dark:opacity-40"><div class="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent"></div></div>\`
    : \`<div class="absolute inset-0 w-full h-48 md:h-64 bg-zinc-100 dark:bg-zinc-900 -z-10 rounded-t-[2rem]"></div>\`;

  const currentUser = getCurrentUser();
  const isOwnProfile = currentUser && currentUser.username === profile.username;
  
  const editBtnHtml = isOwnProfile ? \`<a href="#/profile/personal" class="absolute top-6 right-6 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest text-zinc-900 dark:text-white transition-all shadow-sm z-20">Редактировать</a>\` : '';

  let favHtml = '<div class="text-sm text-zinc-500">Пока ничего нет</div>';
  if (favorites.length > 0) {
      favHtml = \`<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">\` + favorites.map(favId => {
          const r = reviews.find(rev => rev.id === favId);
          if(!r) return '';
          return \`<a href="#/reviews/\${r.id}" class="block group">
              <div class="aspect-square mb-3 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <img src="\${r.cover}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="font-bold text-sm text-zinc-900 dark:text-white truncate">\${r.title}</div>
              <div class="text-[10px] text-zinc-500 uppercase tracking-widest truncate">\${getArtist(r.artistId) ? getArtist(r.artistId).name : r.artistId}</div>
          </a>\`;
      }).join('') + \`</div>\`;
  }

  app.innerHTML = \`
    <div class="max-w-4xl mx-auto py-12 px-4 relative z-0 animate-slide-up">
       <div class="bg-white dark:bg-zinc-950 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 relative z-0 shadow-xl pb-10 overflow-hidden">
         \${bannerHtml}
         \${editBtnHtml}
         
         <div class="pt-24 md:pt-40 text-center px-4 relative z-10">
           \${avatarHtml}
           <h3 class="font-serif font-black text-3xl mt-4" style="color: \${nicknameColor}">\${profile.username}</h3>
         </div>
         
         <div class="px-6 md:px-12 mt-12 w-full">
            <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Любимые релизы</h4>
            \${favHtml}
         </div>
       </div>
    </div>
  \`;
}
`;
code += newFunc;
fs.writeFileSync('profile.js', code);
