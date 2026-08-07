const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newCode = `
      if (payload.action === 'changeUsername') {
        const auth = await authenticateUser(payload.username, payload.token);
        if (!auth.success) return { success: false, error: "Неверный токен" };
        const newUsername = (payload.newUsername || "").trim();
        if (newUsername.length < 3 || newUsername.length > 20) return { success: false, error: "Ник должен быть от 3 до 20 символов" };
        if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) return { success: false, error: "Ник может содержать только латинские буквы, цифры и подчеркивания" };
        
        let { data: existing } = await supabase.from('users').select('username').eq('username', newUsername);
        if (existing && existing.length > 0) return { success: false, error: "Ник уже занят" };

        let { error: updateErr } = await supabase.from('users').update({ username: newUsername }).eq('username', payload.username);
        if (updateErr) {
            console.error(updateErr);
            return { success: false, error: "Ошибка при смене ника. Возможно он уже занят." };
        }
        
        await supabase.from('purchases').update({ username: newUsername }).eq('username', payload.username);
        await supabase.from('linked_users').update({ username: newUsername }).eq('username', payload.username);
        await supabase.from('mgr_votes').update({ username: newUsername }).eq('username', payload.username);
        await supabase.from('uss_civil_war').update({ username: newUsername }).eq('username', payload.username);
        await supabase.from('link_requests').update({ username: newUsername }).eq('username', payload.username);
        
        return { success: true, newUsername };
      }
      if (payload.action === 'changePassword') {
        let { data: users } = await supabase.from('users').select('*').eq('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        if (user.password !== payload.oldPassword) return { success: false, error: "Неверный текущий пароль" };
        
        const newPassword = (payload.newPassword || "").trim();
        if (newPassword.length < 6) return { success: false, error: "Новый пароль должен быть не менее 6 символов" };
        
        const newToken = generateToken();
        await supabase.from('users').update({ password: newPassword, token: newToken }).eq('username', payload.username);
        return { success: true, newToken };
      }
      if (payload.action === 'deleteAccount') {
        let { data: users } = await supabase.from('users').select('*').eq('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        
        await supabase.from('users').delete().eq('username', payload.username);
        await supabase.from('purchases').delete().eq('username', payload.username);
        await supabase.from('linked_users').delete().eq('username', payload.username);
        await supabase.from('mgr_votes').delete().eq('username', payload.username);
        await supabase.from('uss_civil_war').delete().eq('username', payload.username);
        await supabase.from('link_requests').delete().eq('username', payload.username);
        
        return { success: true };
      }
      return { success: false, error: "Неизвестное действие" };
`;

code = code.replace('      return { success: false, error: "Неизвестное действие" };', newCode);
fs.writeFileSync('api.js', code);
