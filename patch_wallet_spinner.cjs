const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

const spinnerStr = 'app.innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;';
const newSpinnerStr = `
    if (!document.getElementById('wallet-content')) {
        app.innerHTML = \`<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>\`;
    } else {
        document.getElementById('wallet-content').innerHTML = \`<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>\`;
    }
`;

code = code.replace(spinnerStr, newSpinnerStr.trim());
fs.writeFileSync('wallet.js', code);
console.log("Patched wallet spinner");
