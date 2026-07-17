const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

code = code.replace(
    'const date = new Date(dateString);',
    'const date = dateString ? new Date(dateString) : new Date();'
);

fs.writeFileSync('hueboard.js', code);
