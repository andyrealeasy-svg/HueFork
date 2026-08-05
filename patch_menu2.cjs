const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

// just manually replace it using a more general regex or index based replacement
const startIdx = code.indexOf('const avatarUrl = personalData.avatarUrl;');
if (startIdx !== -1) {
    const endIdx = code.indexOf('} else {', startIdx);
    const endBlock = code.indexOf('}', endIdx + 10);
    
    if (endIdx !== -1 && endBlock !== -1) {
        const replacement = `    const avatarUrl = personalData.avatarUrl;
    if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
      avatarEl.innerHTML = \`<img src="\${avatarUrl}" onerror="this.onerror=null; this.outerHTML='<div class=\\'w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs\\'>\${user.username.charAt(0).toUpperCase()}</div>';" class="w-full h-full object-cover">\`;
    } else {
      const initial = user.username.charAt(0).toUpperCase();
      avatarEl.innerHTML = \`<div class="w-full h-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">\${initial}</div>\`;
    `;
        
        code = code.substring(0, startIdx) + replacement + code.substring(endBlock);
        fs.writeFileSync('main.js', code);
    }
}
