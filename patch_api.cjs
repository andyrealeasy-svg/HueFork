const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const actions = `
      else if (payload.action === 'claimBonus') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              if (user.hueCoins === undefined) user.hueCoins = 0;
              let added = 0;
              let type = "";
              const now = new Date();
              // In Aremaine time (UTC+3), but we can just use simple logic 
              // that changes day. Or we can just use local time for now.
              const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];
              if (!user.registeredClaimed) {
                  user.registeredClaimed = true;
                  user.hueCoins += 50;
                  added = 50;
                  type = "register";
              } else if (user.lastBonusDate !== today) {
                  user.lastBonusDate = today;
                  user.hueCoins += 25;
                  added = 25;
                  type = "daily";
              }
              localStorage.setItem("mock_db_users", JSON.stringify(users));
              resolve({ success: true, added, hueCoins: user.hueCoins, type });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }
      else if (payload.action === 'buyItem') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              if (user.hueCoins === undefined) user.hueCoins = 0;
              if (user.hueCoins < payload.price) {
                  resolve({ success: false, error: "Недостаточно HueCoins" });
                  return;
              }
              user.hueCoins -= payload.price;
              localStorage.setItem("mock_db_users", JSON.stringify(users));

              let purchases = JSON.parse(localStorage.getItem("mock_db_purchases") || "[]");
              purchases.push({
                  reviewId: payload.reviewId,
                  type: payload.type,
                  points: payload.points,
                  date: new Date().toISOString(),
                  username: payload.username
              });
              localStorage.setItem("mock_db_purchases", JSON.stringify(purchases));

              resolve({ success: true, hueCoins: user.hueCoins });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }
      else if (payload.action === 'getChartData') {
          let purchases = JSON.parse(localStorage.getItem("mock_db_purchases") || "[]");
          resolve({ success: true, purchases });
      }
      else if (payload.action === 'getUserEconomy') {
          const user = users[payload.username];
          if (user && user.token === payload.token) {
              if (user.hueCoins === undefined) user.hueCoins = 0;
              const now = new Date();
              const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];
              const canClaimDaily = user.registeredClaimed && user.lastBonusDate !== today;
              const canClaimRegister = !user.registeredClaimed;
              resolve({ success: true, hueCoins: user.hueCoins, canClaimRegister, canClaimDaily });
          } else {
              resolve({ success: false, error: "Access denied" });
          }
      }
`;

code = code.replace("else if (payload.action === 'checkSession') {", actions + "\n      else if (payload.action === 'checkSession') {");

fs.writeFileSync('api.js', code);
