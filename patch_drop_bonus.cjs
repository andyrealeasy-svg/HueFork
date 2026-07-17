const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

// Replace app.innerHTML to include the claim buttons
const htmlRegex = /app\.innerHTML = `[\s\S]*?\${renderBanner\(bannerRelease\)}/;
const claimHtml = `
           ${"${(canClaimRegister || canClaimDaily) ? `"}
           <div class="mb-8 flex flex-col sm:flex-row gap-4 animate-fade-in">
               ${"${canClaimRegister ? `<button id=\"claim-register-btn\" class=\"flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95\">+50 HueCoins за регистрацию</button>` : ''}"}
               ${"${canClaimDaily ? `<button id=\"claim-daily-btn\" class=\"flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95\">+25 HueCoins (сегодняшний день)</button>` : ''}"}
           </div>
           ${"` : ''}"}

           ${"${renderBanner(bannerRelease)}"}
`;
code = code.replace(htmlRegex, (match) => {
    return match.replace('${renderBanner(bannerRelease)}', claimHtml);
});

// Append event listeners at the end of drop.js
const appendCode = `
  if (canClaimRegister || canClaimDaily) {
      const handleClaim = async (btn) => {
          btn.disabled = true;
          const orig = btn.innerHTML;
          btn.innerHTML = \`<span class="animate-pulse">Загрузка...</span>\`;
          const res = await callApi({ action: 'claimBonus', username: user.username, token: user.token });
          if (res.success) {
              window.appAlert(\`Успешно! Начислено \${res.added} HueCoins.\`);
              renderDrop();
          } else {
              window.appAlert(res.error || "Ошибка при получении бонуса");
              btn.disabled = false;
              btn.innerHTML = orig;
          }
      };
      
      const btnReg = document.getElementById('claim-register-btn');
      if (btnReg) btnReg.addEventListener('click', () => handleClaim(btnReg));
      
      const btnDaily = document.getElementById('claim-daily-btn');
      if (btnDaily) btnDaily.addEventListener('click', () => handleClaim(btnDaily));
  }
`;

code = code.replace(/};\s*}\s*$/, `};
${appendCode}
}
`);

fs.writeFileSync('drop.js', code);
