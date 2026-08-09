const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

// Replace standard alerts
code = code.replace(/window\.alert\("Ошибка при сохранении данных\."\);/g, 'customAlert("Ошибка при сохранении данных.");');
code = code.replace(/alert\("Вы успешно оплатили выкуп и ваши права восстановлены!"\);/g, 'customAlert("Вы успешно оплатили выкуп и ваши права восстановлены!", () => { window.location.reload(); });');
code = code.replace(/alert\((res\.error \|\| "Ошибка оплаты")\);/g, 'customAlert($1);');
code = code.replace(/alert\("Вы депортированы и не можете принимать участие в голосовании\. Оплатите выкуп, чтобы вернуться\."\);/g, 'customAlert("Вы депортированы и не можете принимать участие в голосовании. Оплатите выкуп, чтобы вернуться.");');

// Replace confirm
code = code.replace(/if\s*\(confirm\("Вы уверены, что хотите потратить 50 HueCoins на выкуп\?"\)\)\s*\{/g, 
    'customConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {');

// The block ends around line 420. Let's do a more robust regex or just manual replace.
// Let's find the closing brace.
// The code looks like this:
/*
  const btnRansom = app.querySelector('#btn-ransom');
  if (btnRansom) {
      btnRansom.addEventListener('click', () => {
          customConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {
              const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
              callApi({
                  action: 'payUssRansom',
                  username: currentUser.username,
                  token: currentUser.token
              }).then(res => {
                  if (res.success) {
                      customAlert("Вы успешно оплатили выкуп и ваши права восстановлены!", () => { window.location.reload(); });
                      } else {
                      customAlert(res.error || "Ошибка оплаты");
                  }
              });
          });
      });
  }
*/
// Let's just fix the whole section.
const oldSection = `const btnRansom = app.querySelector('#btn-ransom');
  if (btnRansom) {
      btnRansom.addEventListener('click', () => {
          if (confirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?")) {
              const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
              callApi({
                  action: 'payUssRansom',
                  username: currentUser.username,
                  token: currentUser.token
              }).then(res => {
                  if (res.success) {
                      alert("Вы успешно оплатили выкуп и ваши права восстановлены!");
                      } else {
                      alert(res.error || "Ошибка оплаты");
                  }
              });
          }
      });
  }`;

const newSection = `const btnRansom = app.querySelector('#btn-ransom');
  if (btnRansom) {
      btnRansom.addEventListener('click', () => {
          customConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {
              const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
              callApi({
                  action: 'payUssRansom',
                  username: currentUser.username,
                  token: currentUser.token
              }).then(res => {
                  if (res.success) {
                      customAlert("Вы успешно оплатили выкуп и ваши права восстановлены!", () => { window.location.reload(); });
                  } else {
                      customAlert(res.error || "Ошибка оплаты");
                  }
              });
          });
      });
  }`;

// wait, the file already might have been partially changed by the replacements above. 
// Let me just restore it and do it properly if it doesn't match.

fs.writeFileSync('uss-civil-war.js', code);
