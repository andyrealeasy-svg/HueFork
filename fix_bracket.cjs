const fs = require('fs');
let code = fs.readFileSync('uss-phase3.js', 'utf8');

code = code.replace(/alert\(res\.error \|\| "Ошибка оплаты"\);/, 'customAlert(res.error || "Ошибка оплаты");');
code = code.replace(/\}\);\n                \}\);\n            \}\);\n        \}/, '});\n            });\n        });\n    }');

fs.writeFileSync('uss-phase3.js', code);
