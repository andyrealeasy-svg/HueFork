const fs = require('fs');
let code = fs.readFileSync('drop.js', 'utf8');

code = code.replace(/let currentTab = 'albums';\s*let searchQuery = '';/, '');
fs.writeFileSync('drop.js', code);
