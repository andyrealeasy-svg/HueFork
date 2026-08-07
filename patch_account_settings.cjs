const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const oldChangeUsername = `      btnChangeUsername.addEventListener('click', () => {
         const newUsername = prompt("Введите новый ник (3-20 символов, только латинские буквы, цифры и подчеркивания):");
         if (!newUsername) return;
         if (newUsername === profile.username) return;
         
         const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
         callApi({
             action: 'changeUsername',
             username: currentUser.username,
             token: currentUser.token,
             newUsername: newUsername
         }).then(res => {
             if (res.success) {
                 appAlert("Ник успешно изменен!");
                 currentUser.username = res.newUsername;
                 localStorage.setItem('hf_user', JSON.stringify(currentUser));
                 setTimeout(() => window.location.reload(), 1500);
             } else {
                 appAlert(res.error || "Ошибка смены ника");
             }
         });
      });`;

const newChangeUsername = `      btnChangeUsername.addEventListener('click', () => {
         appPrompt("Смена ника", "Новый ник", false, (newUsername) => {
             if (newUsername === profile.username) return;
             
             const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
             callApi({
                 action: 'changeUsername',
                 username: currentUser.username,
                 token: currentUser.token,
                 newUsername: newUsername
             }).then(res => {
                 if (res.success) {
                     appAlert("Ник успешно изменен!");
                     currentUser.username = res.newUsername;
                     localStorage.setItem('hf_user', JSON.stringify(currentUser));
                     setTimeout(() => window.location.reload(), 1500);
                 } else {
                     appAlert(res.error || "Ошибка смены ника");
                 }
             });
         });
      });`;

const oldChangePassword = `      btnChangePassword.addEventListener('click', () => {
         const oldPassword = prompt("Введите текущий пароль:");
         if (!oldPassword) return;
         const newPassword = prompt("Введите новый пароль (не менее 6 символов):");
         if (!newPassword) return;
         
         const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
         callApi({
             action: 'changePassword',
             username: currentUser.username,
             token: currentUser.token,
             oldPassword: oldPassword,
             newPassword: newPassword
         }).then(res => {
             if (res.success) {
                 appAlert("Пароль успешно изменен!");
                 currentUser.token = res.newToken;
                 localStorage.setItem('hf_user', JSON.stringify(currentUser));
             } else {
                 appAlert(res.error || "Ошибка смены пароля");
             }
         });
      });`;

const newChangePassword = `      btnChangePassword.addEventListener('click', () => {
         appPrompt("Текущий пароль", "Введите пароль", true, (oldPassword) => {
             appPrompt("Новый пароль", "Не менее 6 символов", true, (newPassword) => {
                 const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                 callApi({
                     action: 'changePassword',
                     username: currentUser.username,
                     token: currentUser.token,
                     oldPassword: oldPassword,
                     newPassword: newPassword
                 }).then(res => {
                     if (res.success) {
                         appAlert("Пароль успешно изменен!");
                         currentUser.token = res.newToken;
                         localStorage.setItem('hf_user', JSON.stringify(currentUser));
                     } else {
                         appAlert(res.error || "Ошибка смены пароля");
                     }
                 });
             });
         });
      });`;

const oldDeleteAccount = `      btnDeleteAccount.addEventListener('click', () => {
         if (!confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) return;
         const password = prompt("Для подтверждения удаления введите ваш пароль:");
         if (!password) return;
         
         const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
         callApi({
             action: 'deleteAccount',
             username: currentUser.username,
             token: currentUser.token,
             password: password
         }).then(res => {
             if (res.success) {
                 appAlert("Аккаунт успешно удален.");
                 localStorage.removeItem('hf_user');
                 setTimeout(() => {
                    window.location.hash = '#/';
                    window.location.reload();
                 }, 1500);
             } else {
                 appAlert(res.error || "Ошибка удаления аккаунта");
             }
         });
      });`;

const newDeleteAccount = `      btnDeleteAccount.addEventListener('click', () => {
         appConfirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.", () => {
             appPrompt("Подтверждение", "Введите пароль", true, (password) => {
                 const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                 callApi({
                     action: 'deleteAccount',
                     username: currentUser.username,
                     token: currentUser.token,
                     password: password
                 }).then(res => {
                     if (res.success) {
                         appAlert("Аккаунт успешно удален.");
                         localStorage.removeItem('hf_user');
                         setTimeout(() => {
                            window.location.hash = '#/';
                            window.location.reload();
                         }, 1500);
                     } else {
                         appAlert(res.error || "Ошибка удаления аккаунта");
                     }
                 });
             });
         });
      });`;

code = code.replace(oldChangeUsername, newChangeUsername);
code = code.replace(oldChangePassword, newChangePassword);
code = code.replace(oldDeleteAccount, newDeleteAccount);

fs.writeFileSync('profile.js', code);
