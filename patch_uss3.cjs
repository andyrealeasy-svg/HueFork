const fs = require('fs');
let code = fs.readFileSync('uss-phase3.js', 'utf8');

// 1. preview-score circle
const oldPreviewScore = `<div class="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black font-serif text-2xl shadow-lg border-4 border-red-200 dark:border-red-900" id="preview-score">0.0</div>`;
const newPreviewScore = `<div class="w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-red-600 text-red-600" id="preview-score">0.0</div>`;
code = code.replace(oldPreviewScore, newPreviewScore);

// 2. previewScoreEl update logic to change border color
const oldUpdateScore = /const score = tAvg \* 0\.6 \+ cAvg \* 0\.4;\s*previewScoreEl\.textContent = \`\$\{score\.toFixed\(1\)\}\`;/;
const newUpdateScore = `const score = tAvg * 0.6 + cAvg * 0.4;
            previewScoreEl.textContent = \`\${score.toFixed(1)}\`;
            if (score >= 8.0) {
                previewScoreEl.className = "w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-red-600 text-red-600";
            } else {
                previewScoreEl.className = "w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400";
            }`;
code = code.replace(oldUpdateScore, newUpdateScore);

// 3. buyItem call arguments
const oldBuyItem = `                    action: 'buyItem',
                    username: currentUser.username,
                    token: currentUser.token,
                    price: 50,
                    reviewId: 'uss-deluxe-cd',
                    points: 24,
                    type: 'drop_item'`;
const newBuyItem = `                    action: 'buyItem',
                    username: currentUser.username,
                    token: currentUser.token,
                    price: 60,
                    reviewId: 'sicka-united-states-of-sicka',
                    points: 24,
                    type: 'drop_item'`;
code = code.replace(oldBuyItem, newBuyItem);

// 4. Also update the text "за 50 HueCoins?" to "за 60 HueCoins?"
code = code.replace(/за 50 HueCoins\?/g, 'за 60 HueCoins?');
code = code.replace(/50 HueCoins/g, '60 HueCoins');

// 5. Citizen review score circles
const oldCitizenCircle = /<div class="w-12 h-12 bg-red-600 text-white dark:bg-red-700 rounded-full flex items-center justify-center font-black font-serif text-lg shadow-inner border-2 border-red-200 dark:border-red-900 flex-shrink-0">\s*\$\{\(score \/ 10\)\.toFixed\(1\)\}\s*<\/div>/;
const newCitizenCircle = `<div class="w-12 h-12 bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center font-bold text-base border-2 \${score >= 80 ? 'border-red-600 text-red-600' : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'} shadow-sm flex-shrink-0">
                                \${(score / 10).toFixed(1)}
                            </div>`;
code = code.replace(oldCitizenCircle, newCitizenCircle);

fs.writeFileSync('uss-phase3.js', code);
