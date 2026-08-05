const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const oldMenuProfile = `    if (avatarUrl) {
      avatarEl.innerHTML = \`<img src="\${avatarUrl}" class="w-full h-full object-cover">\`;
    } else {
      const initial = user.username.charAt(0).toUpperCase();
      avatarEl.innerHTML = \`<div class="w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">\${initial}</div>\`;
    }`;

const newMenuProfile = `    if (avatarUrl && avatarUrl.startsWith('http')) {
      avatarEl.innerHTML = \`<img src="\${avatarUrl}" onerror="this.onerror=null; this.outerHTML='<div class=\\'w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs\\'>\${user.username.charAt(0).toUpperCase()}</div>';" class="w-full h-full object-cover">\`;
    } else {
      const initial = user.username.charAt(0).toUpperCase();
      avatarEl.innerHTML = \`<div class="w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">\${initial}</div>\`;
    }`;

code = code.replace(oldMenuProfile, newMenuProfile);
fs.writeFileSync('main.js', code);
