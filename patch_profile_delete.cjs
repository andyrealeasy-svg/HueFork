const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const searchStr = `                 appAlert("Аккаунт успешно удален.");
                 localStorage.removeItem('hf_user');
                 window.location.hash = '#/';
                 window.location.reload();`;

const replaceStr = `                 appAlert("Аккаунт успешно удален.");
                 localStorage.removeItem('hf_user');
                 setTimeout(() => {
                    window.location.hash = '#/';
                    window.location.reload();
                 }, 1500);`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('profile.js', code);
