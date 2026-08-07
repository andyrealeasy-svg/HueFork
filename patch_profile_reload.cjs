const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const searchStr = `             if (res.success) {
                 appAlert("Ник успешно изменен!");
                 currentUser.username = res.newUsername;
                 localStorage.setItem('hf_user', JSON.stringify(currentUser));
                 // reload page to apply changes
                 window.location.reload();`;

const replaceStr = `             if (res.success) {
                 appAlert("Ник успешно изменен!");
                 currentUser.username = res.newUsername;
                 localStorage.setItem('hf_user', JSON.stringify(currentUser));
                 setTimeout(() => window.location.reload(), 1500);`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('profile.js', code);
