const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

// 1. Clock icon
code = code.replace(
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>',
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
);

// 2. Transfer target autocomplete
const transferHtmlOld = `                            <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Получатель (ник)</label>
                            <input type="text" id="transfer-target" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">`;

const transferHtmlNew = `                            <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Получатель (ник)</label>
                            <div class="relative">
                                <input type="text" id="transfer-target" autocomplete="off" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                                <div id="transfer-autocomplete" class="absolute z-10 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg hidden overflow-hidden max-h-48 overflow-y-auto"></div>
                            </div>`;

code = code.replace(transferHtmlOld, transferHtmlNew);

// 3. Add script for autocomplete and modals fixing
const endOfOpenWalletModalOld = `    document.getElementById('topup-share')?.addEventListener('click', () => {`;
const endOfOpenWalletModalNew = `
    const targetInput = document.getElementById('transfer-target');
    const autocompleteBox = document.getElementById('transfer-autocomplete');
    if (targetInput && autocompleteBox) {
        let timeout = null;
        targetInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            const query = e.target.value.trim();
            if (query.length === 0) {
                autocompleteBox.innerHTML = '';
                autocompleteBox.classList.add('hidden');
                return;
            }
            timeout = setTimeout(async () => {
                const res = await callApi({ action: 'searchUsers', query });
                if (res.success && res.users.length > 0) {
                    autocompleteBox.innerHTML = res.users.map(u => \`
                        <div class="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors" onclick="document.getElementById('transfer-target').value='\${u.username}'; document.getElementById('transfer-autocomplete').classList.add('hidden');">
                            <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 bg-cover bg-center" style="\${u.avatar ? \`background-image: url('\${u.avatar}')\` : ''}"></div>
                            <span class="font-bold text-sm">\${u.username}</span>
                        </div>
                    \`).join('');
                    autocompleteBox.classList.remove('hidden');
                } else {
                    autocompleteBox.innerHTML = '<div class="p-4 text-xs text-zinc-500 text-center uppercase tracking-widest">Не найдено</div>';
                    autocompleteBox.classList.remove('hidden');
                }
            }, 300);
        });
        
        // Hide on click outside
        document.addEventListener('click', (ev) => {
            if (!targetInput.contains(ev.target) && !autocompleteBox.contains(ev.target)) {
                autocompleteBox.classList.add('hidden');
            }
        });
    }

    document.getElementById('topup-share')?.addEventListener('click', () => {`;
code = code.replace(endOfOpenWalletModalOld, endOfOpenWalletModalNew);

// 4. Modal success instead of reload for credit
code = code.replace(/window\.location\.reload\(\);/g, `
            container.innerHTML = \`
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-zinc-950 p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-4">Успешно!</h3>
                        <p class="text-zinc-500 mb-8 text-sm">Операция выполнена успешно.</p>
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Отлично</button>
                    </div>
                </div>
            \`;`);

// Fix transfer success which was replaced
const transferSuccessOldRegex = /<button onclick="document.getElementById\('wallet-modals'\).innerHTML=''; import\('\.\/wallet\.js'\)\.then\(m => m\.renderWallet\(\)\);"/g;
// Wait, I shouldn't replace window.location.reload in transfer success if it's there. Oh, it WAS there!
// I'll just change the button onclick in transfer success manually to avoid conflicts.
code = code.replace(/<button onclick="window\.location\.reload\(\)"/g, `<button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());"`);


fs.writeFileSync('wallet.js', code);
console.log("Patched wallet.js phase 1");
