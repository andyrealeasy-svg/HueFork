const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

// I inserted literally "\n" without escaping it properly in the text.
// Wait, the error is Expected unicode escape `\n`. It means it literally wrote `\n` outside quotes.
code = code.replace(/\\nconst statesData = \[/, '\nconst statesData = [');
fs.writeFileSync('uss-civil-war.js', code);
