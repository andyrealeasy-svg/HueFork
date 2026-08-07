const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

code = code.replace(
    'const currUser = JSON.parse(localStorage.getItem("hf_user") || "{}");\\n\\n             if (newUsername === currUser.username) return;',
    'const currUser = JSON.parse(localStorage.getItem("hf_user") || "{}");\n             if (newUsername === currUser.username) return;'
);
code = code.replace('const currUser = JSON.parse(localStorage.getItem("hf_user") || "{}");\\n             if (newUsername === currUser.username) return;', 'const currUser = JSON.parse(localStorage.getItem("hf_user") || "{}");\n             if (newUsername === currUser.username) return;');
fs.writeFileSync('profile.js', code);
