const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const target = `    </div>
  \`;
}`;

const replacement = `    </div>
  \`;
  
  const btnOpenMap = app.querySelector('#btn-open-map');
  if (btnOpenMap) {
      btnOpenMap.addEventListener('click', () => {
          showUssMapModal(data, user);
      });
  }

  const btnRansom = app.querySelector('#btn-ransom');
  if (btnRansom) {
      btnRansom.addEventListener('click', () => {
          appConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {
              const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
              callApi({
                  action: 'payUssRansom',
                  username: currentUser.username,
                  token: currentUser.token
              }).then(res => {
                  if (res.success) {
                      appAlert("Вы успешно оплатили выкуп и ваши права восстановлены!");
                      window.location.reload();
                  } else {
                      appAlert(res.error || "Ошибка оплаты");
                  }
              });
          });
      });
  }
}`;

code = code.replace(target, replacement);
fs.writeFileSync('uss-civil-war.js', code);
