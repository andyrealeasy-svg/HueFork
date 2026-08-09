const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const regex = /if\s*\(confirm\("Вы уверены, что хотите потратить 50 HueCoins на выкуп\?"\)\)\s*\{([\s\S]*?\}\);)\s*\}/m;
code = code.replace(regex, 'customConfirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {$1});');

fs.writeFileSync('uss-civil-war.js', code);
