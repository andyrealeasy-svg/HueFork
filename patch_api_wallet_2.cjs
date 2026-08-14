const fs = require('fs');

let apiCode = fs.readFileSync('api.js', 'utf8');

const walletEndpoints = `
      // === WALLET ENDPOINTS ===
      if (payload.action === 'setupWallet') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let { data: existing } = await supabase.from('wallet').select('*').eq('username', payload.username);
        if (existing && existing.length > 0) return { success: true };
        await supabase.from('wallet').insert({ username: payload.username, pin: payload.pin, trust_rating: 500, royalty_balance: 0 });
        return { success: true };
      }
      if (payload.action === 'checkWalletPin') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let { data: wallet } = await supabase.from('wallet').select('pin').eq('username', payload.username);
        if (!wallet || wallet.length === 0) return { success: false, error: "wallet_not_found" };
        if (wallet[0].pin !== payload.pin) return { success: false, error: "Неверный PIN-код" };
        return { success: true };
      }
      if (payload.action === 'getWalletInfo') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let { data: wallets } = await supabase.from('wallet').select('*').eq('username', payload.username);
        let wallet = (wallets && wallets.length > 0) ? wallets[0] : null;
        let { data: credits } = await supabase.from('credits').select('*').eq('username', payload.username).eq('status', 'active');
        let hueCoins = Number(auth.user.hue_coins) || 0;
        
        let currentDebt = 0;
        let trustRating = wallet ? wallet.trust_rating : 500;
        let creditUpdated = false;

        if (credits && credits.length > 0) {
            for (let c of credits) {
                if (new Date() > new Date(c.due_date)) {
                    await supabase.from('credits').update({ status: 'overdue' }).eq('id', c.id);
                    trustRating = Math.max(0, trustRating - 50);
                    creditUpdated = true;
                } else {
                    currentDebt += (c.amount_due - c.amount_paid);
                }
            }
        }
        
        let { data: overdueCredits } = await supabase.from('credits').select('*').eq('username', payload.username).eq('status', 'overdue');
        if (overdueCredits && overdueCredits.length > 0) {
            for (let c of overdueCredits) {
                currentDebt += (c.amount_due - c.amount_paid);
            }
        }

        if (creditUpdated && wallet) {
            await supabase.from('wallet').update({ trust_rating: trustRating }).eq('username', payload.username);
            wallet.trust_rating = trustRating;
        }

        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username);
        let artistId = (linked && linked.length > 0) ? linked[0].artist_id : null;

        return { success: true, hueCoins, wallet: wallet || null, currentDebt, artistId, overdueCredits: overdueCredits || [], activeCredits: credits || [] };
      }
      if (payload.action === 'transferHueCoins') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        const amount = Number(payload.amount);
        if (isNaN(amount) || amount <= 0) return { success: false, error: "Некорректная сумма" };
        if (payload.username.toLowerCase() === payload.targetUsername.toLowerCase()) return { success: false, error: "Нельзя перевести самому себе" };
        
        let { data: targetUsers } = await supabase.from('users').select('*').ilike('username', payload.targetUsername);
        if (!targetUsers || targetUsers.length === 0) return { success: false, error: "Пользователь не найден" };
        
        let targetUser = targetUsers[0];
        let senderHueCoins = Number(auth.user.hue_coins) || 0;
        if (senderHueCoins < amount) return { success: false, error: "Недостаточно HueCoins" };
        
        await supabase.from('users').update({ hue_coins: senderHueCoins - amount }).eq('username', payload.username);
        let targetHueCoins = Number(targetUser.hue_coins) || 0;
        await supabase.from('users').update({ hue_coins: targetHueCoins + amount }).eq('username', targetUser.username);
        
        try {
            await supabase.from('transactions').insert([
                { username: payload.username, type: 'transfer_out', amount: -amount, balance_after: senderHueCoins - amount, target_username: targetUser.username, comment: payload.comment || '' },
                { username: targetUser.username, type: 'transfer_in', amount: amount, balance_after: targetHueCoins + amount, target_username: payload.username, comment: payload.comment || '' }
            ]);
        } catch(e) {}
        
        return { success: true, hueCoins: senderHueCoins - amount };
      }
      if (payload.action === 'takeCredit') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let amount = Number(payload.amount);
        let { data: wallets } = await supabase.from('wallet').select('*').eq('username', payload.username);
        let wallet = (wallets && wallets.length > 0) ? wallets[0] : null;
        let tr = wallet ? wallet.trust_rating : 500;
        
        let limit = 0;
        if (tr >= 200 && tr < 400) limit = 25;
        else if (tr >= 400 && tr < 600) limit = 50;
        else if (tr >= 600 && tr < 800) limit = 100;
        else if (tr >= 800 && tr < 950) limit = 150;
        else if (tr >= 950) limit = 200;

        if (amount > limit) return { success: false, error: "Сумма превышает лимит" };
        
        let { data: activeCredits } = await supabase.from('credits').select('*').eq('username', payload.username).in('status', ['active', 'overdue']);
        if (activeCredits && activeCredits.length > 0) return { success: false, error: "У вас уже есть непогашенный кредит" };
        
        let due_date = new Date();
        due_date.setDate(due_date.getDate() + 14);
        let amountDue = Math.ceil(amount * 1.05); 
        
        await supabase.from('credits').insert({
            username: payload.username,
            principal: amount,
            amount_due: amountDue,
            amount_paid: 0,
            status: 'active',
            due_date: due_date.toISOString()
        });
        
        let hc = Number(auth.user.hue_coins) || 0;
        await supabase.from('users').update({ hue_coins: hc + amount }).eq('username', payload.username);
        
        try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: 'credit_borrow',
                amount: amount,
                balance_after: hc + amount,
                comment: 'Взят кредит'
            });
        } catch(e) {}
        
        return { success: true };
      }
      if (payload.action === 'repayCredit') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let amount = Number(payload.amount);
        let hc = Number(auth.user.hue_coins) || 0;
        if (hc < amount) return { success: false, error: "Недостаточно HueCoins" };
        
        let { data: credits } = await supabase.from('credits').select('*').eq('username', payload.username).in('status', ['active', 'overdue']);
        if (!credits || credits.length === 0) return { success: false, error: "Нет активных кредитов" };
        
        let credit = credits[0];
        let remaining = credit.amount_due - credit.amount_paid;
        let actualRepay = Math.min(amount, remaining);
        
        let newPaid = credit.amount_paid + actualRepay;
        let newStatus = credit.status;
        let ratingChange = 0;
        
        if (newPaid >= credit.amount_due) {
            newStatus = 'paid';
            if (credit.status === 'active') {
                let daysLeft = (new Date(credit.due_date) - new Date()) / (1000 * 3600 * 24);
                if (daysLeft >= 7) ratingChange = 100;
                else ratingChange = 50;
            }
        }
        
        await supabase.from('credits').update({ amount_paid: newPaid, status: newStatus }).eq('id', credit.id);
        await supabase.from('users').update({ hue_coins: hc - actualRepay }).eq('username', payload.username);
        
        try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: 'credit_repay',
                amount: -actualRepay,
                balance_after: hc - actualRepay,
                comment: 'Погашение кредита'
            });
        } catch(e) {}
        
        if (ratingChange > 0) {
            let { data: wallets } = await supabase.from('wallet').select('*').eq('username', payload.username);
            if (wallets && wallets.length > 0) {
                let newRating = Math.min(1000, wallets[0].trust_rating + ratingChange);
                await supabase.from('wallet').update({ trust_rating: newRating }).eq('username', payload.username);
            }
        }
        
        return { success: true, repaid: actualRepay };
      }
      if (payload.action === 'getWalletHistory') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        
        try {
            let { data: transactions } = await supabase.from('transactions')
                .select('*')
                .eq('username', payload.username)
                .order('created_at', { ascending: false })
                .limit(100);
            return { success: true, transactions: transactions || [] };
        } catch(e) {
            return { success: true, transactions: [] };
        }
      }
      if (payload.action === 'claimRoyalties') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        
        let { data: wallets } = await supabase.from('wallet').select('*').eq('username', payload.username);
        let wallet = (wallets && wallets.length > 0) ? wallets[0] : null;
        if (!wallet || wallet.royalty_balance <= 0) return { success: false, error: "Нет доступных роялти" };
        
        if (wallet.last_royalty_claim) {
            let diff = (new Date() - new Date(wallet.last_royalty_claim)) / (1000 * 3600 * 24);
            if (diff < 3) {
                return { success: false, error: "Роялти можно забирать раз в 3 дня. Осталось " + Math.ceil(3 - diff) + " дн." };
            }
        }
        
        let claimAmount = wallet.royalty_balance;
        let hc = Number(auth.user.hue_coins) || 0;
        
        await supabase.from('wallet').update({ royalty_balance: 0, last_royalty_claim: new Date().toISOString() }).eq('username', payload.username);
        await supabase.from('users').update({ hue_coins: hc + claimAmount }).eq('username', payload.username);
        
        try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: 'royalty',
                amount: claimAmount,
                balance_after: hc + claimAmount,
                comment: 'Сбор роялти'
            });
        } catch(e) {}
        
        return { success: true, claimed: claimAmount };
      }
      // === END WALLET ENDPOINTS ===
`;

if (!apiCode.includes("payload.action === 'setupWallet'")) {
    apiCode = apiCode.replace("if (payload.action === 'getPublicData')", walletEndpoints + "\n      if (payload.action === 'getPublicData')");
    fs.writeFileSync('api.js', apiCode);
    console.log("api.js patched with new endpoints.");
}
