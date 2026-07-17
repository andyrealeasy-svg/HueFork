const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const replacement = `      else if (payload.action === 'getUserEconomy') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              if (user.hueCoins === undefined) user.hueCoins = 0;
              if (user.registeredClaimed && user.hueCoins === 0) {
                  // Fallback for bugged account state
                  user.registeredClaimed = false;
                  localStorage.setItem("mock_db_users", JSON.stringify(users));
              }
              const now = new Date();
              const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];
              const canClaimDaily = user.registeredClaimed && user.lastBonusDate !== today;
              const canClaimRegister = !user.registeredClaimed;
              resolve({ success: true, hueCoins: user.hueCoins, canClaimRegister, canClaimDaily });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }`;

code = code.replace(/else if \(payload\.action === 'getUserEconomy'\) \{[\s\S]*?else \{\n\s*resolve\(\{ success: false, error: "Access denied" \}\);\n\s*\}\n\s*\}/m, replacement);

fs.writeFileSync('api.js', code);
