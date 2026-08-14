const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

const regex = /async function renderRoyalty\(app, user, data\) \{[\s\S]*?\}\s*(?=window\.openTxDetails =)/;
const newCode = `async function renderRoyalty(app, user, data) {
    if (!data.artistId) {
        window.location.hash = "#/wallet";
        return;
    }

    const bal = data.wallet ? data.wallet.royalty_balance : 0;
    
    // Fetch history
    const histRes = await callApi({ action: 'getRoyaltyHistory', username: user.username, token: user.token });
    const history = histRes.success && histRes.history ? histRes.history : [];
    
    let histHtml = '<div class="text-center text-zinc-500 mt-12 text-sm uppercase tracking-widest">Нет покупок</div>';
    if (history.length > 0) {
        const typeNames = {
            'digital': 'Digital',
            'cd': 'CD',
            'vinyl': 'Винил'
        };
        histHtml = history.map(item => {
            const tName = typeNames[item.type] || item.type;
            const d = new Date(item.date).toLocaleDateString('ru-RU');
            return \`
                <div class="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-left">
                    <div>
                        <p class="font-bold text-zinc-900 dark:text-white mb-1">\${item.reviewTitle}</p>
                        <p class="text-xs text-zinc-500 uppercase tracking-widest">\${d} &middot; \${item.buyer} &middot; \${tName}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-emerald-500 font-bold">+\${item.amount} HC</span>
                    </div>
                </div>
            \`;
        }).join('');
    }

    app.innerHTML = \`
        <div class="max-w-3xl mx-auto px-4 py-8 animate-slide-up pb-32 text-center">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-12 text-left">
                <div>
                    <h1 class="font-serif font-black text-3xl uppercase tracking-tighter text-zinc-900 dark:text-white">Роялти</h1>
                    <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mt-1">Для артистов</p>
                </div>
            </div>

            <div class="mb-12">
                <p class="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Накоплено</p>
                <div class="text-6xl sm:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">\${bal} <span class="text-xl sm:text-2xl text-zinc-300">HC</span></div>
            </div>

            <button id="claim-royalty" class="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl hover:-translate-y-1 mb-16 \${bal <= 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                Забрать средства
            </button>
            <p id="claim-error" class="text-red-500 text-sm mt-4 hidden"></p>
            
            <div class="mt-8 text-left max-w-2xl mx-auto">
                <h3 class="font-serif font-black text-2xl uppercase tracking-tighter text-zinc-900 dark:text-white mb-6 text-center">История покупок</h3>
                <div class="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    \${histHtml}
                </div>
            </div>
        </div>
    \`;

    document.getElementById('claim-royalty')?.addEventListener('click', async () => {
        if (bal <= 0) return;
        const btn = document.getElementById('claim-royalty');
        btn.innerHTML = '...';
        
        const res = await callApi({ action: 'claimRoyalties', username: user.username, token: user.token });
        if (res.success) {
            document.getElementById('wallet-modals').innerHTML = \`
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
            \`;
        } else {
            document.getElementById('claim-error').textContent = res.error || 'Ошибка';
            document.getElementById('claim-error').classList.remove('hidden');
            btn.innerHTML = 'Забрать средства';
        }
    });
}
`;

code = code.replace(regex, newCode);
fs.writeFileSync('wallet.js', code);
console.log("Patched renderRoyalty in wallet.js");
