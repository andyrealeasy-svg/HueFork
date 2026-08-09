const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `  const settingsBtn = document.getElementById('profile-settings-btn');`;
const insertion = `  const statsContainer = document.getElementById('personal-stats-content');
  if (statsContainer) {
      callApi({ action: 'getUserStats', targetUsername: user.username }).then(res => {
          if (res.success) {
              statsContainer.innerHTML = formatStatsHtml(res.stats);
          } else {
              statsContainer.innerHTML = '<div class="col-span-full text-center text-sm text-zinc-500">Не удалось загрузить статистику</div>';
          }
      });
  }

  const settingsBtn = document.getElementById('profile-settings-btn');`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
