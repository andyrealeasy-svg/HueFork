const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

code = code.replace(
    'if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };',
    'if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };\\n        if (user.password !== payload.password) return { success: false, error: "Неверный пароль" };'
);
fs.writeFileSync('api.js', code.replace(/\\\\n/g, '\\n'));
