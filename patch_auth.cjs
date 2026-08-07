const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const searchStr = `        const auth = await authenticateUser(payload.username, payload.token);
        if (!auth.success) return { success: false, error: "Неверный токен" };`;

const replaceStr = `        let { data: users } = await supabase.from('users').select('*').eq('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('api.js', code);
