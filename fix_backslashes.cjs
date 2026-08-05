const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('profile.js', code);
