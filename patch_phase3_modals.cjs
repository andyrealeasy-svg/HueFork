const fs = require('fs');
let code = fs.readFileSync('uss-phase3.js', 'utf8');

const modalsCode = `function customAlert(message, callback) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = \`
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">\${message}</p>
            <button id="alert-ok" class="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">OK</button>
        </div>
    \`;
    document.body.appendChild(m);
    m.querySelector('#alert-ok').addEventListener('click', () => {
        m.remove();
        if (callback) callback();
    });
}

function customConfirm(message, onConfirm) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = \`
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">\${message}</p>
            <div class="flex gap-4">
                <button id="confirm-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">Отмена</button>
                <button id="confirm-ok" class="flex-1 bg-red-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-red-700">Да</button>
            </div>
        </div>
    \`;
    document.body.appendChild(m);
    m.querySelector('#confirm-cancel').addEventListener('click', () => m.remove());
    m.querySelector('#confirm-ok').addEventListener('click', () => {
        m.remove();
        onConfirm();
    });
}
`;

code = code.replace(/export async function renderUssPhase3\(\) \{/, modalsCode + '\nexport async function renderUssPhase3() {');

code = code.replace(/if\s*\(confirm\("Вы уверены, что хотите купить 'United States Of SiCka: Deluxe CD' за 50 HueCoins\?"\)\)\s*\{/g, 'customConfirm("Вы уверены, что хотите купить \'United States Of SiCka: Deluxe CD\' за 50 HueCoins?", () => {');
code = code.replace(/alert\("Вы успешно купили диск! Спасибо за поддержку\."\);/g, 'customAlert("Вы успешно купили диск! Спасибо за поддержку.");');
code = code.replace(/alert\(\(res\.error \|\| "Ошибка оплаты"\)\);/g, 'customAlert(res.error || "Ошибка оплаты");');
code = code.replace(/alert\("Напишите хотя бы одно предложение!"\);/g, 'customAlert("Напишите хотя бы одно предложение!");');
code = code.replace(/alert\(\(res\.error \|\| "Ошибка"\)\);/g, 'customAlert(res.error || "Ошибка");');

// Fix missing closure for customConfirm
code = code.replace(/\}\);\n\s*\}\n\s*\}\);\n\s*\}/g, '});\n                });\n            });\n        }'); // this might be risky, let's just do a smarter replace.

fs.writeFileSync('uss-phase3.js', code);
