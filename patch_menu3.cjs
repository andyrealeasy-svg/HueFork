const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const badBlock = `    }</div>\`;
    }`;
const goodBlock = `    }`;

code = code.replace(badBlock, goodBlock);
fs.writeFileSync('main.js', code);
