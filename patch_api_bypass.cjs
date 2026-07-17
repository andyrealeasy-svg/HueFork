const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

code = code.replace(
    'if (API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {',
    'if (true || API_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {'
);

// also let's change setTimeout to 0 to remove the 5-second or 500ms delay.
code = code.replace(/setTimeout\(\(\) => \{/, 'setTimeout(() => {');
code = code.replace(/}, 500\);/g, '}, 0);');

fs.writeFileSync('api.js', code);
