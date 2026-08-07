const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const newCode = `      privateToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.privateProfile = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });

      const btnChangeUsername = modal.querySelector('#btn-change-username');
      btnChangeUsername.addEventListener('click', () => {
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
                 // reload page to apply changes
                 window.location.reload();
             } else {
                 appAlert(res.error || "Ошибка смены ника");
             }
         });
      });

      const btnChangePassword = modal.querySelector('#btn-change-password');
      btnChangePassword.addEventListener('click', () => {
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
      });

      const btnDeleteAccount = modal.querySelector('#btn-delete-account');
      btnDeleteAccount.addEventListener('click', () => {
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
                 window.location.hash = '#/';
                 window.location.reload();
             } else {
                 appAlert(res.error || "Ошибка удаления аккаунта");
             }
         });
      });`;

code = code.replace(`      privateToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.privateProfile = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });`, newCode);

fs.writeFileSync('profile.js', code);
