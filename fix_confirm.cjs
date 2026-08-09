const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

// Fix 1: Map submit
code = code.replace(
  /confirm\(\`У вас осталось \$\{votesLeft\} голосов\. Вы уверены, что хотите завершить голосование\? Отданные голоса изменить нельзя\.\`, \(\) \=\> \{([\s\S]*?)\}\);/,
  \`if (confirm(\\\`У вас осталось \${votesLeft} голосов. Вы уверены, что хотите завершить голосование? Отданные голоса изменить нельзя.\\\`)) {
    $1
  }\`
);

// Fix 2: Ransom
code = code.replace(
  /confirm\("Вы уверены, что хотите потратить 50 HueCoins на выкуп\?", \(\) \=\> \{([\s\S]*?)\}\);/,
  \`if (confirm("Вы уверены, что хотите потратить 50 HueCoins на выкуп?")) {
    $1
  }\`
);

fs.writeFileSync('uss-civil-war.js', code);
