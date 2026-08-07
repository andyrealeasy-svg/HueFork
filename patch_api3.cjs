const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const searchStr = `      if (payload.action === 'deleteAccount') {
        let { data: users } = await supabase.from('users').select('*').eq('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };`;

const replaceStr = `      if (payload.action === 'deleteAccount') {
        let { data: users } = await supabase.from('users').select('*').eq('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        if (user.password !== payload.password) return { success: false, error: "Неверный пароль" };`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('api.js', code);
