const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

const regex = /let hueCoins = 0;[\s\S]*?catch \(e\) \{\}/;

const newCode = `let hueCoins = 0;
  let canClaimRegister = false;
  let canClaimDaily = false;
  const user = getCurrentUser();
  if (user) {
      try {
          const res = await callApi({ action: 'getUserEconomy', username: user.username, token: user.token });
          if (res.success) {
              hueCoins = res.hueCoins || 0;
              canClaimRegister = res.canClaimRegister;
              canClaimDaily = res.canClaimDaily;
          }
      } catch (e) {}
  }`;

code = code.replace(regex, newCode);

fs.writeFileSync('drop.js', code);
