const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `  const backBtn = app.querySelector('.back-button');`;
const insertion = `
  if (!profile.privateProfile || isOwnProfile) {
      callApi({ action: 'getUserStats', targetUsername: username }).then(statsRes => {
          if (statsRes.success && statsRes.stats.showStats) {
              const statsContainer = document.createElement('div');
              statsContainer.className = "px-6 md:px-12 mt-12 w-full";
              statsContainer.innerHTML = \`
                <h4 class="font-bold text-xs uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">Персональная статистика</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    \${formatStatsHtml(statsRes.stats)}
                </div>
              \`;
              app.querySelector('.bg-white.dark\\\\:bg-zinc-950, .bg-white.dark\\\\:bg-zinc-950').appendChild(statsContainer);
          }
      });
  }

  const backBtn = app.querySelector('.back-button');`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
