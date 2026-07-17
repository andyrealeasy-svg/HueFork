const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

code = code.replace(
    'import { syncUserLocalData } from "./api.js";',
    'import { syncUserLocalData, callApi } from "./api.js";'
);

fs.writeFileSync('main.js', code);
