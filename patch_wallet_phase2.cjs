const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

code = code.replace(
    'return `\\n                <div class="flex items-center justify-between p-4',
    'return `\\n                <div onclick="window.openTxDetails(\\&#39;${t.id}\\&#39;)" class="cursor-pointer flex items-center justify-between p-4'
);

code = code.replace(
    'if (res.success && res.transactions && res.transactions.length > 0) {',
    'if (res.success && res.transactions && res.transactions.length > 0) {\\n        window.walletTransactionsCache = res.transactions;'
);

const newFunc = \`
window.openTxDetails = (id) => {
    if (!window.walletTransactionsCache) return;
    const t = window.walletTransactionsCache.find(x => x.id === id);
    if (!t) return;
    
    const isIncome = t.amount > 0;
    const color = isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white';
    const sign = isIncome ? '+' : '';
    
    let typeNames = {
        'credit_repay': 'Погашение кредита',
        'credit_borrow': 'Взят кредит',
        'transfer_out': 'Перевод (исх)',
        'transfer_in': 'Перевод (вх)',
        'transfer': 'Перевод',
        'purchase': 'Покупка',
        'bonus': 'Ежедневный бонус',
        'registration': 'Бонус за регистрацию',
        'royalty': 'Роялти',
        'royalty_claim': 'Вывод роялти'
    };
    const typeName = typeNames[t.type.toLowerCase()] || t.type;
    
    document.getElementById('wallet-modals').innerHTML = \\\`
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
            <div class="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
                <button onclick="document.getElementById('wallet-modals').innerHTML=''" class="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white p-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div class="text-center mb-8 pt-4">
                    <p class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">\\\${typeName}</p>
                    <p class="text-4xl font-black \\\${color} tracking-tighter">\\\${sign}\\\${t.amount} <span class="text-lg text-zinc-400">HC</span></p>
                </div>
                
                <div class="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Дата и время</span>
                        <span class="font-mono text-zinc-900 dark:text-white">\\\${new Date(t.created_at).toLocaleString('ru-RU')}</span>
                    </div>
                    \\\${t.target_username ? \\\`
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">\\\${isIncome ? 'Отправитель' : 'Получатель'}</span>
                        <span class="font-bold text-zinc-900 dark:text-white">\\\${t.target_username}</span>
                    </div>
                    \\\` : ''}
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Остаток</span>
                        <span class="font-bold text-zinc-900 dark:text-white">\\\${t.balance_after} HC</span>
                    </div>
                    \\\${t.comment ? \\\`
                    <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <span class="block text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Комментарий</span>
                        <span class="text-sm text-zinc-900 dark:text-white leading-relaxed">\\\${t.comment}</span>
                    </div>
                    \\\` : ''}
                </div>
            </div>
        </div>
    \\\`;
};
\`;

if (!code.includes("window.openTxDetails")) {
    code = code + "\n" + newFunc;
    fs.writeFileSync('wallet.js', code);
    console.log("Patched wallet.js phase 2");
}
