const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

if (!code.includes('import { checkEconomyPopups }')) {
    code = code.replace(
        'import { syncUserLocalData } from "./api.js";',
        'import { syncUserLocalData } from "./api.js";\nimport { checkEconomyPopups } from "./economy.js";'
    );
}

if (!code.includes('checkEconomyPopups()')) {
    code = code.replace(
        'window.scrollTo(0, 0);',
        'window.scrollTo(0, 0);\n  checkEconomyPopups();'
    );
}

fs.writeFileSync('main.js', code);
