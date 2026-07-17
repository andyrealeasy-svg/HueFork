const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

if (!code.includes('import { checkEconomyPopups }')) {
    code = code.replace(
        'import { syncUserLocalData } from "./api.js";',
        'import { syncUserLocalData } from "./api.js";\nimport { checkEconomyPopups } from "./economy.js";\nimport { renderDrop } from "./drop.js";\nimport { renderHueboard } from "./hueboard.js";'
    );
}

if (!code.includes('checkEconomyPopups()')) {
    code = code.replace(
        'window.scrollTo(0, 0);',
        'window.scrollTo(0, 0);\n  checkEconomyPopups();'
    );
}

if (!code.includes('renderDrop()')) {
    code = code.replace(
        '  } else if (hash.startsWith("#/archive")) {',
        '  } else if (hash.startsWith("#/drop")) {\n    renderDrop();\n  } else if (hash.startsWith("#/hueboard")) {\n    renderHueboard();\n  } else if (hash.startsWith("#/archive")) {'
    );
}

fs.writeFileSync('main.js', code);
