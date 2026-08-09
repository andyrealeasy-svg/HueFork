const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

code = code.replace(/              \}\);\n          \}\n      \}\);\n  \}/, '              });\n          });\n      });\n  }');

fs.writeFileSync('uss-civil-war.js', code);
