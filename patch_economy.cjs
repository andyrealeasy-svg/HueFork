const fs = require('fs');

// main.js changes
let mainCode = fs.readFileSync('main.js', 'utf8');
mainCode = mainCode.replace(
    /window\.scrollTo\(0, 0\);\s*checkEconomyPopups\(\);\s*\}/,
    `window.scrollTo(0, 0);
    }`
);
mainCode = mainCode.replace(
    /window\.addEventListener\("hashchange", router\);\s*router\(\);/,
    `window.addEventListener("hashchange", router);\nrouter();\ncheckEconomyPopups();`
);
fs.writeFileSync('main.js', mainCode);

// profile.js changes
let profileCode = fs.readFileSync('profile.js', 'utf8');
if (!profileCode.includes('checkEconomyPopups')) {
    profileCode = profileCode.replace(
        /import \{ callApi.*?\} from '\.\/api\.js';/,
        `import { callApi, getCurrentUser, setCurrentUser, logoutUser, refreshSession } from './api.js';\nimport { checkEconomyPopups } from './economy.js';`
    );
    profileCode = profileCode.replace(
        /setCurrentUser\(res\.user\);\s*renderProfile\(\);/g,
        `setCurrentUser(res.user);\n      renderProfile();\n      checkEconomyPopups();`
    );
    fs.writeFileSync('profile.js', profileCode);
}
