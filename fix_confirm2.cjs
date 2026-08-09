const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const oldMapConfirm = "confirm(`У вас осталось ${votesLeft} голосов. Вы уверены, что хотите завершить голосование? Отданные голоса изменить нельзя.`, () => {";
const newMapConfirm = "if (confirm(`У вас осталось ${votesLeft} голосов. Вы уверены, что хотите завершить голосование? Отданные голоса изменить нельзя.`)) {";

const oldRansomConfirm = 'confirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?", () => {';
const newRansomConfirm = 'if (confirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?")) {';

code = code.replace(oldMapConfirm, newMapConfirm);
code = code.replace(oldRansomConfirm, newRansomConfirm);

// Need to also remove the trailing }); which closed the old confirm block.
// Wait, for Ransom:
code = code.replace(/}\);(\s*\}\s*)$/m, "}\n$1"); // It's safer to just do a string replacement.
fs.writeFileSync('uss-civil-war.js', code);
