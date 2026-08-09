const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const oldStr = `    } else {
      window.alert("Ошибка при сохранении данных.");
      btn.disabled = false;
      btn.innerHTML = 'Получить Грин-карту';
    }
  }
}

function renderEventPage(data, user) {`;

const newStr = `    } else {
      window.alert("Ошибка при сохранении данных.");
      btn.disabled = false;
      btn.innerHTML = 'Получить Грин-карту';
    }
  });
}

function renderEventPage(data, user) {`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('uss-civil-war.js', code);
