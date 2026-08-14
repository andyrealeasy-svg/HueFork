const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

const oldRenderHistory = `
        listHTML = res.transactions.map(t => {
            const isIncome = t.amount > 0;
            const color = isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white';
            const sign = isIncome ? '+' : '';
            
            let icon = '<circle cx="12" cy="12" r="10"/>';
            if (t.type === 'transfer_in' || t.type === 'transfer_out' || t.type === 'transfer') icon = '<path d="M5 12h14M12 5l7 7-7 7"/>';
            if (t.type === 'purchase') icon = '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>';
            if (t.type === 'bonus' || t.type === 'registration') icon = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
            
            const typeNames = {
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

            return \`
                <div onclick="window.openTxDetails('\${t.id}')" class="cursor-pointer flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\${icon}</svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">\${typeName}</p>
                            \${t.comment ? \`<p class="text-[10px] text-zinc-500 mt-1 max-w-[150px] sm:max-w-[300px] truncate">\${t.comment}</p>\` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-black \${color}">\${sign}\${t.amount} HC</p>
                        <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">\${new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            \`;
        }).join('');
`;

const newRenderHistory = `
        const grouped = {};
        res.transactions.forEach(t => {
            const d = new Date(t.created_at);
            const dateStr = d.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', year: 'numeric' });
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(t);
        });

        listHTML = Object.entries(grouped).map(([date, txs]) => {
            let dayHtml = \`<div class="bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 sticky top-0 z-10 border-b border-zinc-100 dark:border-zinc-800">\${date}</div>\`;
            
            dayHtml += txs.map(t => {
                const isIncome = t.amount > 0;
                const color = isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white';
                const sign = isIncome ? '+' : '';
                
                let icon = '<circle cx="12" cy="12" r="10"/>';
                if (t.type === 'transfer_in' || t.type === 'transfer_out' || t.type === 'transfer') icon = '<path d="M5 12h14M12 5l7 7-7 7"/>';
                if (t.type === 'purchase') icon = '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>';
                if (t.type === 'bonus' || t.type === 'registration') icon = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                
                const typeNames = {
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
                const timeStr = new Date(t.created_at).toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' });

                return \`
                    <div onclick="window.openTxDetails('\${t.id}')" class="cursor-pointer flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\${icon}</svg>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">\${typeName}</p>
                                \${t.comment ? \`<p class="text-[10px] text-zinc-500 mt-1 max-w-[150px] sm:max-w-[300px] truncate">\${t.comment}</p>\` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-black \${color}">\${sign}\${t.amount} HC</p>
                            <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">\${timeStr}</p>
                        </div>
                    </div>
                \`;
            }).join('');
            return dayHtml;
        }).join('');
`;

code = code.replace(oldRenderHistory.trim(), newRenderHistory.trim());
fs.writeFileSync('wallet.js', code);
console.log("Patched renderHistory grouping by day");
