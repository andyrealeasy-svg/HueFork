import { supabase } from './supabaseClient.js';
import { reviews } from './data.js';
// from './supabaseClient.js';

export const API_URL = "SUPABASE_BYPASS";

async function checkAuth(payload) {
    if (!payload || !payload.username || !payload.token) return { success: false, error: "Нет данных авторизации" };
    let { data: users } = await supabase.from('users').select('*').ilike('username', payload.username).eq('token', payload.token);
    if (!users || users.length === 0) return { success: false, error: "Не авторизован (неверный токен)" };
    return { success: true, user: users[0] };
}

export async function callApi(payload) {
  try {
      if (payload.action === 'login') {
        let { data: users, error } = await supabase.from('users').select('*').ilike('username', payload.username);
        if (users && users.length > 0 && String(users[0].password) === String(payload.password)) {
            const user = users[0];
            let { data: linked } = await supabase.from('linked_users').select('*').eq('username', user.username).single();
            if (payload.localData && !user.data) {
                await supabase.from('users').update({ data: payload.localData }).eq('username', user.username);
                user.data = payload.localData;
            }
            return { success: true, user: { username: user.username, role: user.role, token: user.token, linkedArtistId: linked ? linked.artist_id : undefined }, userData: user.data };
        }
        return { success: false, error: "Неверный логин или пароль" };
      }
      if (payload.action === 'register') {
        let { data: users } = await supabase.from('users').select('*').ilike('username', payload.username);
        if (users && users.length > 0) {
           return { success: false, error: "Пользователь уже существует" };
        }
        let { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const isFirst = count === 0;
        const newToken = Math.random().toString(36).substring(2);
        const role = isFirst ? 'moderator' : 'user';
        const localDataStr = payload.localData || "";
        await supabase.from('users').insert({ username: payload.username, password: payload.password, role, token: newToken, data: localDataStr });
        return { success: true, user: { username: payload.username, role, token: newToken, linkedArtistId: undefined }, userData: localDataStr };
      }
      
      // === WALLET ENDPOINTS ===
      if (payload.action === 'setupWallet' || payload.action === 'setWalletPin') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        const pin = String(payload.pin || '').trim();
        if (!/^\d{4}$/.test(pin)) return { success: false, error: "PIN-код должен состоять из 4 цифр" };

        let { data: existing } = await supabase.from('wallet').select('*').ilike('username', payload.username);
        if (existing && existing.length > 0) {
          await supabase.from('wallet').update({ pin }).ilike('username', payload.username);
        } else {
          await supabase.from('wallet').insert({ username: payload.username, pin, trust_rating: 500, royalty_balance: 0 });
        }
        return { success: true };
      }
      if (payload.action === 'checkWalletPin') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let { data: wallet } = await supabase.from('wallet').select('pin').ilike('username', payload.username);
        if (!wallet || wallet.length === 0 || !wallet[0].pin || String(wallet[0].pin).trim() === '') {
          return { success: false, error: "pin_not_set" };
        }
        if (String(wallet[0].pin) !== String(payload.pin)) {
          return { success: false, error: "Неверный PIN-код" };
        }
        return { success: true };
      }
      if (payload.action === 'getWalletInfo') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        let { data: wallets } = await supabase.from('wallet').select('*').ilike('username', payload.username);
        let wallet = (wallets && wallets.length > 0) ? wallets[0] : null;
        let { data: credits } = await supabase.from('credits').select('*').ilike('username', payload.username).eq('status', 'active');
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
        
        let { data: overdueCredits } = await supabase.from('credits').select('*').ilike('username', payload.username).eq('status', 'overdue');
        if (overdueCredits && overdueCredits.length > 0) {
            for (let c of overdueCredits) {
                currentDebt += (c.amount_due - c.amount_paid);
            }
        }

        if (creditUpdated && wallet) {
            await supabase.from('wallet').update({ trust_rating: trustRating }).ilike('username', payload.username);
            wallet.trust_rating = trustRating;
        }

        let { data: linked } = await supabase.from('linked_users').select('*').ilike('username', payload.username);
        let artistId = (linked && linked.length > 0) ? linked[0].artist_id : null;

        const hasPin = !!(wallet && wallet.pin && String(wallet.pin).trim().length === 4);

        return { success: true, hueCoins, wallet: wallet || null, hasPin, currentDebt, artistId, overdueCredits: overdueCredits || [], activeCredits: credits || [] };
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
      
      if (payload.action === 'getRoyaltyHistory') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username);
        let artistId = (linked && linked.length > 0) ? linked[0].artist_id : null;
        if (!artistId) return { success: false, error: "Not an artist" };

        const artistReviewIds = reviews.filter(r => r.artistId === artistId).map(r => r.id);
        
        let { data: purchases } = await supabase.from('purchases').select('*').in('review_id', artistReviewIds).order('date', { ascending: false });
        
        let history = (purchases || []).map(p => {
            const review = reviews.find(r => r.id === p.review_id);
            let amount = 0;
            if (p.type === 'digital') amount = 3;
            else if (p.type === 'cd') amount = 12;
            else if (p.type === 'vinyl') amount = 30;
            return {
                id: p.id,
                date: p.date,
                reviewTitle: review ? review.title : p.review_id,
                type: p.type,
                amount: amount,
                buyer: p.username
            };
        });

        return { success: true, history };
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

      if (payload.action === 'getPublicData') {
        let { data: artistRows } = await supabase.from('artist_info').select('*');
        let { data: commentRows } = await supabase.from('comments').select('*');
        let { data: linkedRows } = await supabase.from('linked_users').select('*');
        
        let publicData = { artists: {}, comments: {}, verifiedArtists: [] };
        (artistRows || []).forEach(r => {
           publicData.artists[r.artist_id] = { description: String(r.description || ''), pinnedReleaseId: String(r.pinned_release_id || '') };
        });
        (commentRows || []).forEach(r => {
           if (!publicData.comments[r.review_id]) publicData.comments[r.review_id] = [];
           publicData.comments[r.review_id].push({ artistId: r.artist_id, text: String(r.text), timestamp: r.timestamp });
        });
        (linkedRows || []).forEach(r => {
           if (r.artist_id && !publicData.verifiedArtists.includes(r.artist_id)) {
               publicData.verifiedArtists.push(r.artist_id);
           }
        });
        return { success: true, data: publicData };
      }
      if (payload.action === 'requestLink') {
        let { data: reqs } = await supabase.from('link_requests').select('*').eq('username', payload.username);
        if (reqs && reqs.length > 0) return { success: false, error: "Ваш запрос уже находится на рассмотрении модератора." };
        await supabase.from('link_requests').insert({ username: payload.username, artist_id: payload.artistId });
        return { success: true };
      }
      if (payload.action === 'getAdminData') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        let { data: requests } = await supabase.from('link_requests').select('*');
        let { data: linked } = await supabase.from('linked_users').select('*');
        return {
            success: true,
            requests: (requests || []).map(r => ({ username: r.username, artistId: r.artist_id })),
            linked: (linked || []).map(r => ({ username: r.username, artistId: r.artist_id }))
        };
      }
      if (payload.action === 'approveLink') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('link_requests').delete().eq('username', payload.targetUser);
        let { data: existing } = await supabase.from('linked_users').select('*').eq('artist_id', payload.artistId).single();
        if (existing) {
            await supabase.from('linked_users').update({ username: payload.targetUser }).eq('artist_id', payload.artistId);
        } else {
            await supabase.from('linked_users').insert({ username: payload.targetUser, artist_id: payload.artistId });
        }
        return { success: true };
      }
      if (payload.action === 'rejectLink') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('link_requests').delete().eq('username', payload.targetUser);
        return { success: true };
      }
      if (payload.action === 'unlinkAccount') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('linked_users').delete().eq('username', payload.targetUser);
        return { success: true };
      }
            if (payload.action === 'getUserPublicProfile') {
        let { data: users, error } = await supabase.from('users').select('username, data').ilike('username', payload.targetUsername);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const userRow = users[0];
        let pData = {};
        if (userRow.data) {
           try {
             const allData = typeof userRow.data === 'string' ? JSON.parse(userRow.data) : userRow.data;
             pData = typeof allData.personalProfile === 'string' ? JSON.parse(allData.personalProfile) : (allData.personalProfile || {});
           } catch(e) {}
        }
        return { success: true, profile: { username: userRow.username, avatarUrl: pData.avatarUrl, bannerUrl: pData.bannerUrl, nicknameColor: pData.nicknameColor, favorites: pData.favorites, favoriteTracks: pData.favoriteTracks, bio: pData.bio, pronouns: pData.pronouns, privateProfile: pData.privateProfile } };
      }
      if (payload.action === 'searchUsers') {
        let { data: users, error } = await supabase.from('users').select('username, data').ilike('username', `%${payload.query}%`).limit(10);
        if (!users) return { success: true, users: [] };
        let results = [];
        for (const u of users) {
           let avatar = "";
           let nicknameColor = "";
           let searchable = true;
           if (u.data) {
             try {
               const allData = typeof u.data === 'string' ? JSON.parse(u.data) : u.data;
               const pData = typeof allData.personalProfile === 'string' ? JSON.parse(allData.personalProfile) : (allData.personalProfile || {});
               if (pData.searchable === false) searchable = false;
               avatar = pData.avatarUrl || "";
               nicknameColor = pData.nicknameColor || "";
             } catch(e) {}
           }
           if (searchable) {
             results.push({ username: u.username, avatar, nicknameColor });
           }
        }
        return { success: true, users: results };
      }
      if (payload.action === 'getUsersList') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        let { data: users } = await supabase.from('users').select('username').neq('username', payload.username);
        return { success: true, data: (users || []).map(u => u.username) };
      }
      if (payload.action === 'transferModerator') {
        const auth = await checkAuth(payload);
        if (!auth.success || auth.user.role !== 'moderator') return { success: false, error: "Нет доступа" };
        await supabase.from('users').update({ role: 'user' }).eq('username', payload.username);
        await supabase.from('users').update({ role: 'moderator' }).eq('username', payload.targetUser);
        return { success: true };
      }
      if (payload.action === 'resignModerator') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        await supabase.from('users').update({ role: 'user' }).eq('username', payload.username);
        return { success: true };
      }
      if (payload.action === 'updateArtistInfo') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        if (!linked) return { success: false, error: "У вас нет привязанного профиля" };
        let { data: existing } = await supabase.from('artist_info').select('*').eq('artist_id', linked.artist_id).single();
        if (existing) {
            await supabase.from('artist_info').update({ description: payload.description, pinned_release_id: payload.pinnedReleaseId }).eq('artist_id', linked.artist_id);
        } else {
            await supabase.from('artist_info').insert({ artist_id: linked.artist_id, description: payload.description, pinned_release_id: payload.pinnedReleaseId });
        }
        return { success: true };
      }
      if (payload.action === 'addComment') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Нет доступа" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        if (!linked) return { success: false, error: "У вас нет привязанного профиля" };
        await supabase.from('comments').delete().eq('review_id', payload.reviewId).eq('artist_id', linked.artist_id);
        if (payload.commentText && String(payload.commentText).trim() !== "") {
            await supabase.from('comments').insert({ review_id: payload.reviewId, artist_id: linked.artist_id, text: payload.commentText, timestamp: Date.now() });
        }
        return { success: true };
      }
      if (payload.action === 'submitEventReview') {
        let { data: duplicates } = await supabase.from('event_reviews').select('*').eq('username', payload.username);
        if (duplicates && duplicates.length > 0) return { success: false, error: "Вы уже отправили рецензию." };
        if (payload.review && payload.review.artist && payload.review.title) {
            let { data: relDup } = await supabase.from('event_reviews').select('*').ilike('artist', payload.review.artist).ilike('title', payload.review.title);
            if (relDup && relDup.length > 0) return { success: false, error: "Этот релиз уже был отправлен кем-то другим." };
        }
        await supabase.from('event_reviews').insert({
            review_id: Math.random().toString(36).substring(2),
            username: payload.username,
            artist: payload.review.artist,
            title: payload.review.title,
            type: payload.review.type,
            review_text: payload.review.reviewText,
            date: payload.review.date,
            scores_json: JSON.stringify(payload.review.scores || []),
            tracks_json: JSON.stringify(payload.review.tracks || [])
        });
        return { success: true };
      }
      if (payload.action === 'syncUserData') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Пользователь не найден" };
        await supabase.from('users').update({ data: payload.localData }).eq('username', payload.username);
        return { success: true };
      }
      if (payload.action === 'checkSession') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Не авторизован" };
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username).single();
        return { success: true, user: { username: auth.user.username, role: auth.user.role, token: auth.user.token, linkedArtistId: linked ? linked.artist_id : undefined }, userData: auth.user.data };
      }
      if (payload.action === 'getMGRVotes') {
        let { data: mgrVotes } = await supabase.from('mgr_votes').select('*');
        let totalVotes = {};
        let myVotes = {};
        (mgrVotes || []).forEach(r => {
            try {
                const obj = JSON.parse(r.votes_json);
                if (r.username === payload.username) myVotes = obj;
                for (const [revId, count] of Object.entries(obj)) {
                    totalVotes[revId] = (totalVotes[revId] || 0) + Number(count);
                }
            } catch(e) {}
        });
        return { success: true, totalVotes, myVotes };
      }
      if (payload.action === 'submitMGRVotes') {
        if (!payload.username) return { success: false, error: "Необходима авторизация" };
        let { data: existing } = await supabase.from('mgr_votes').select('*').eq('username', payload.username).single();
        if (existing) {
            await supabase.from('mgr_votes').update({ votes_json: JSON.stringify(payload.votes) }).eq('username', payload.username);
        } else {
            await supabase.from('mgr_votes').insert({ username: payload.username, votes_json: JSON.stringify(payload.votes) });
        }
        return { success: true };
      }
      if (payload.action === 'getUssData') {
        let { data: existing } = await supabase.from('uss_civil_war').select('*').ilike('username', payload.username);
        if (existing && existing.length > 0) {
            try { return { success: true, data: JSON.parse(existing[0].data_json) }; } catch(e) { return { success: true, data: null }; }
        }
        return { success: true, data: null };
      }
      if (payload.action === 'saveUssData') {
        if (!payload.username) return { success: false, error: "Необходима авторизация" };
        let { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(payload.data) }).eq('username', payload.username);
        } else {
            await supabase.from('uss_civil_war').insert({ username: payload.username, data_json: JSON.stringify(payload.data) });
        }
        return { success: true };
      }
      if (payload.action === 'getUserEconomy') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        const user = auth.user;
        let hc = Number(user.hue_coins) || 0;
        let rc = user.registered_claimed === true || String(user.registered_claimed).toLowerCase() === 'true';
        let rawDate = user.last_bonus_date;
        let lastBonus = String(rawDate || "");
        const now = new Date();
        const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];
        const canClaimDaily = rc && lastBonus !== today;
        const canClaimRegister = !rc;
        return { success: true, hueCoins: hc, canClaimRegister, canClaimDaily };
      }
      if (payload.action === 'claimBonus') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        const user = auth.user;
        let hc = Number(user.hue_coins) || 0;
        let rc = user.registered_claimed === true || String(user.registered_claimed).toLowerCase() === 'true';
        let rawDate = user.last_bonus_date;
        let lastBonus = String(rawDate || "");
        const now = new Date();
        const today = new Date(now.getTime() + 3 * 3600 * 1000).toISOString().split("T")[0];

        let added = 0;
        let type = "";

        let allData = typeof user.data === 'string' ? JSON.parse(user.data) : (user.data || {});
        let streak = allData.streak || 0;
        const yesterday = new Date(now.getTime() - 24 * 3600 * 1000 + 3 * 3600 * 1000).toISOString().split("T")[0];

        if (!rc) {
            rc = true;
            hc += 50;
            added = 50;
            type = "register";
            streak = 1;
        } else if (lastBonus !== today) {
            if (lastBonus === yesterday) {
                streak += 1;
            } else {
                streak = 1;
            }
            lastBonus = today;
            hc += 25;
            added = 25;
            type = "daily";
        } else {
            return { success: false, error: "Вы уже получили сегодняшний бонус" };
        }
        
        allData.streak = streak;

        await supabase.from('users').update({ hue_coins: hc, registered_claimed: rc, last_bonus_date: today, data: JSON.stringify(allData) }).eq('username', payload.username);
        try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: type === 'register' ? 'registration' : 'bonus',
                amount: added,
                balance_after: hc,
                comment: type === 'register' ? 'Бонус за регистрацию' : 'Ежедневный бонус'
            });
        } catch(e) {}
        return { success: true, added, hueCoins: hc, type };
      }
      if (payload.action === 'buyItem') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Пользователь не найден" };
        const user = auth.user;
        let hueCoins = Number(user.hue_coins) || 0;
        let price = Number(payload.price) || 0;

        if (hueCoins >= price) {
            hueCoins -= price;
            await supabase.from('users').update({ hue_coins: hueCoins }).eq('username', payload.username);
            await supabase.from('purchases').insert({ username: payload.username, review_id: payload.reviewId, points: payload.points, type: payload.type, date: new Date().toISOString() });
            
            try {
                await supabase.from('transactions').insert({
                    username: payload.username,
                    type: 'purchase',
                    amount: -price,
                    balance_after: hueCoins,
                    comment: 'Покупка релиза в Drop: ' + payload.reviewId
                });

                const review = reviews.find(r => r.id === payload.reviewId);
                if (review && review.artistId) {
                    let royaltyAmount = 0;
                    if (payload.type === 'digital') royaltyAmount = 3;
                    else if (payload.type === 'cd') royaltyAmount = 12;
                    else if (payload.type === 'vinyl') royaltyAmount = 30;

                    if (royaltyAmount > 0) {
                        let { data: linked } = await supabase.from('linked_users').select('*').eq('artist_id', review.artistId);
                        if (linked && linked.length > 0) {
                            let artistUser = linked[0].username;
                            let { data: wallets } = await supabase.from('wallet').select('royalty_balance').eq('username', artistUser);
                            if (wallets && wallets.length > 0) {
                                await supabase.from('wallet').update({ royalty_balance: (wallets[0].royalty_balance || 0) + royaltyAmount }).eq('username', artistUser);
                            } else {
                                await supabase.from('wallet').insert({ username: artistUser, royalty_balance: royaltyAmount, trust_rating: 500 });
                            }
                        }
                    }
                }
            } catch(e) {}

            return { success: true, hueCoins, newBalance: hueCoins };
        } else {
            return { success: false, error: "Недостаточно HueCoins" };
        }
      }
      if (payload.action === 'getChartData') {
        let { data: purchases } = await supabase.from('purchases').select('*');
        return { success: true, purchases: (purchases || []).map(r => ({ reviewId: String(r.review_id), points: Number(r.points), type: String(r.type), date: String(r.date) })) };
      }

      if (payload.action === 'changeUsername') {
        let { data: users } = await supabase.from('users').select('*').ilike('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        const newUsername = (payload.newUsername || "").trim();
        if (newUsername.length < 3 || newUsername.length > 20) return { success: false, error: "Ник должен быть от 3 до 20 символов" };
        if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) return { success: false, error: "Ник может содержать только латинские буквы, цифры и подчеркивания" };
        
        let { data: existing } = await supabase.from('users').select('username').ilike('username', newUsername);
        if (existing && existing.length > 0) return { success: false, error: "Ник уже занят" };

        let { error: insertErr } = await supabase.from('users').insert({
          username: newUsername,
          password: user.password,
          role: user.role,
          token: user.token,
          data: user.data,
          hue_coins: user.hue_coins,
          registered_claimed: user.registered_claimed,
          last_bonus_date: user.last_bonus_date
        });
        if (insertErr) {
            console.error(insertErr);
            return { success: false, error: "Ошибка при смене ника. Возможно он уже занят." };
        }
        
        await supabase.from('linked_users').update({ username: newUsername }).eq('username', user.username);
        await supabase.from('link_requests').update({ username: newUsername }).eq('username', user.username);
        await supabase.from('purchases').update({ username: newUsername }).eq('username', user.username);
        await supabase.from('mgr_votes').update({ username: newUsername }).eq('username', user.username);
        await supabase.from('uss_civil_war').update({ username: newUsername }).eq('username', user.username);
        
        await supabase.from('users').delete().eq('username', user.username);
        
        return { success: true, newUsername };
      }
      if (payload.action === 'changePassword') {
        let { data: users } = await supabase.from('users').select('*').ilike('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        if (user.password !== payload.oldPassword) return { success: false, error: "Неверный текущий пароль" };
        
        const newPassword = (payload.newPassword || "").trim();
        if (newPassword.length < 6) return { success: false, error: "Новый пароль должен быть не менее 6 символов" };
        
        const newToken = Math.random().toString(36).substring(2);
        await supabase.from('users').update({ password: newPassword, token: newToken }).eq('username', user.username);
        return { success: true, newToken };
      }
      if (payload.action === 'deleteAccount') {
        let { data: users } = await supabase.from('users').select('*').ilike('username', payload.username);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const user = users[0];
        if (user.token !== payload.token) return { success: false, error: "Неверная сессия" };
        if (user.password !== payload.password) return { success: false, error: "Неверный пароль" };
        
        await supabase.from('linked_users').delete().eq('username', user.username);
        await supabase.from('link_requests').delete().eq('username', user.username);
        await supabase.from('purchases').delete().eq('username', user.username);
        await supabase.from('mgr_votes').delete().eq('username', user.username);
        await supabase.from('uss_civil_war').delete().eq('username', user.username);
        await supabase.from('users').delete().eq('username', user.username);
        
        return { success: true };
      }

      if (payload.action === 'getUserStats') {
        let { data: users, error } = await supabase.from('users').select('username, data').ilike('username', payload.targetUsername);
        if (!users || users.length === 0) return { success: false, error: "Пользователь не найден" };
        const userRow = users[0];
        let pData = {};
        let streak = 0;
        if (userRow.data) {
           try {
             const allData = typeof userRow.data === 'string' ? JSON.parse(userRow.data) : userRow.data;
             pData = typeof allData.personalProfile === 'string' ? JSON.parse(allData.personalProfile) : (allData.personalProfile || {});
             streak = allData.streak || 0;
           } catch(e) {}
        }
        
        // Fetch purchases
        let { data: purchases } = await supabase.from('purchases').select('review_id, type, points').eq('username', userRow.username);
        purchases = purchases || [];
        
        let expenses = 0;
        let formatCounts = { digital: 0, cd: 0, vinyl: 0 };
        let reviewCounts = {};
        
        for (let p of purchases) {
            expenses += (p.points || 0);
            if (p.type) {
                formatCounts[p.type] = (formatCounts[p.type] || 0) + 1;
            }
            if (p.review_id) {
                reviewCounts[p.review_id] = (reviewCounts[p.review_id] || 0) + 1;
            }
        }
        
        let favFormat = null;
        let maxFormat = 0;
        for (let f in formatCounts) {
            if (formatCounts[f] > maxFormat) {
                maxFormat = formatCounts[f];
                favFormat = f;
            }
        }
        
        return { success: true, stats: { 
            collectionSize: purchases.length,
            expenses,
            favFormat,
            reviewCounts,
            streak,
            showStats: pData.showStats !== false // default true
        }};
      }

      if (payload.action === 'payUssRansom') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        const user = auth.user;
        let hc = Number(user.hue_coins) || 0;
        if (hc < 50) return { success: false, error: "Недостаточно HueCoins (нужно 50)" };
        
        let { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            let data = {};
            try { data = JSON.parse(existing.data_json); } catch(e) {}
            data.deported = false;
            data.ransom_paid = true;
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', payload.username);
            await supabase.from('users').update({ hue_coins: hc - 50 }).eq('username', payload.username);
            return { success: true, hueCoins: hc - 50 };
        }
        return { success: false, error: "Грин-карта не найдена" };
      }

      if (payload.action === 'saveUssVotes') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        let { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            let data = {};
            try { data = JSON.parse(existing.data_json); } catch(e) {}
            if (data.phase2_completed) return { success: false, error: "Вы уже проголосовали" };
            
            data.votes = payload.votes;
            data.phase2_completed = true;
            
            // Check deportation
            let ownVotes = 0;
            let otherVotes = 0;
            
            for (const [stateId, count] of Object.entries(payload.votes)) {
                const stateIdeology = payload.statesIdeologies[stateId];
                if (data.ideology && data.ideology.startsWith(stateIdeology)) {
                    ownVotes += count;
                } else {
                    otherVotes += count;
                }
            }
            
            if (otherVotes > ownVotes) {
                data.deported = true;
            }
            
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', payload.username);
            return { success: true, deported: data.deported === true };
        }
        return { success: false, error: "Грин-карта не найдена" };
      }
      
      
      if (payload.action === 'getUssGlobalStats') {
        const { data: allUsers } = await supabase.from('uss_civil_war').select('username, data_json');
        let stateVotes = {};
        let totalVotes = 0;
        let reviews = [];
        let reviewUsernames = [];

        if (allUsers) {
            for (const user of allUsers) {
                let data = {};
                try { data = JSON.parse(user.data_json); } catch(e) {}
                if (data.votes) {
                    for (const [stateId, count] of Object.entries(data.votes)) {
                        stateVotes[stateId] = (stateVotes[stateId] || 0) + count;
                        totalVotes += count;
                    }
                }
                if (data.uss_review) {
                    let r = data.uss_review;
                    r.rawUsername = user.username;
                    r.username = user.username;
                    reviews.push(r);
                    reviewUsernames.push(user.username);
                }
            }
        }

        // Fetch user metadata (exact username casing, avatarUrl, nicknameColor)
        if (reviewUsernames.length > 0) {
            const { data: dbUsers } = await supabase.from('users').select('username, data');
            const userMap = {};
            if (dbUsers) {
                for (const u of dbUsers) {
                    let avatarUrl = "";
                    let nicknameColor = "";
                    if (u.data) {
                        try {
                            const allData = typeof u.data === 'string' ? JSON.parse(u.data) : u.data;
                            const pData = typeof allData.personalProfile === 'string' ? JSON.parse(allData.personalProfile) : (allData.personalProfile || {});
                            avatarUrl = pData.avatarUrl || "";
                            nicknameColor = pData.nicknameColor || "";
                        } catch(e) {}
                    }
                    userMap[u.username.toLowerCase()] = {
                        exactUsername: u.username,
                        avatarUrl,
                        nicknameColor
                    };
                }
            }

            for (const r of reviews) {
                const uInfo = userMap[(r.rawUsername || r.username || "").toLowerCase()];
                if (uInfo) {
                    r.username = uInfo.exactUsername;
                    r.avatarUrl = uInfo.avatarUrl;
                    r.nicknameColor = uInfo.nicknameColor;
                } else {
                    r.avatarUrl = "";
                    r.nicknameColor = "";
                }
            }
        }
        
        return { success: true, stateVotes, totalVotes, reviews };
      }
      if (payload.action === 'saveUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        const { data: existing } = await supabase.from('uss_civil_war').select('*').ilike('username', payload.username);
        if (existing && existing.length > 0) {
            const row = existing[0];
            let data = {};
            try { data = JSON.parse(row.data_json); } catch(e) {}
            data.uss_review = {
                trackRatings: payload.trackRatings,
                criteriaRatings: payload.criteriaRatings,
                text: payload.text,
                likes: 0,
                likedBy: [],
                date: new Date().toISOString()
            };
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', row.username);
            return { success: true };
        }
        return { success: false, error: "Пользователь не участвует в ивенте" };
      }
      if (payload.action === 'likeUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        const { data: existing } = await supabase.from('uss_civil_war').select('*').ilike('username', payload.targetUsername);
        if (existing && existing.length > 0) {
            const row = existing[0];
            let data = {};
            try { data = JSON.parse(row.data_json); } catch(e) {}
            if (data.uss_review) {
                let likedBy = data.uss_review.likedBy || [];
                const currentUsernameLower = (payload.username || "").toLowerCase();
                const existingIdx = likedBy.findIndex(u => (u || "").toLowerCase() === currentUsernameLower);
                if (existingIdx !== -1) {
                    likedBy.splice(existingIdx, 1);
                } else {
                    likedBy.push(payload.username);
                }
                data.uss_review.likedBy = likedBy;
                data.uss_review.likes = likedBy.length;
                await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', row.username);
                return { success: true, likes: likedBy.length, liked: existingIdx === -1 };
            }
        }
        return { success: false };
      }

      if (payload.action === 'getUssPhase4Data') {
        let { data: existing } = await supabase.from('uss_civil_war').select('*').ilike('username', payload.username);
        let userData = null;
        if (existing && existing.length > 0) {
          try { userData = JSON.parse(existing[0].data_json); } catch(e) {}
        }
        
        let { data: purchases } = await supabase.from('purchases').select('*').ilike('username', payload.username);
        let deluxePurchasesCount = 0;
        if (purchases) {
          deluxePurchasesCount = purchases.filter(p => 
            p.review_id === 'sicka-united-states-of-sicka' || 
            p.review_id === 'uss-deluxe-cd' ||
            p.type === 'drop_item'
          ).length;
        }
        
        return { success: true, userData, deluxePurchasesCount };
      }

      return { success: false, error: "Неизвестное действие" };
    } catch (e) {
    console.error("API call error:", e);
    return { success: false, error: e.message || "Ошибка соединения с сервером" };
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem("hf_user");
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user) {
  localStorage.setItem("hf_user", JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
}

export function logoutUser() {
  localStorage.removeItem("hf_user");
  window.walletUnlocked = false;
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: null }));
}

export async function syncUserLocalData() {
  const user = getCurrentUser();
  if (user) {
    const localData = {
      userRatings: localStorage.getItem("userRatings") || "{}",
      subscribedArtists: localStorage.getItem("subscribedArtists") || "[]",
      huev_2026_watched: localStorage.getItem("huev_2026_watched") || "",
      reviewNotes: localStorage.getItem("reviewNotes") || "{}",
      myGlobalReview: localStorage.getItem("myGlobalReview") || "{}",
      personalProfile: localStorage.getItem("personalProfile") || "{}"
    };
    await callApi({
        action: 'syncUserData',
        username: user.username,
        token: user.token,
        localData: JSON.stringify(localData)
    });
  }
}

export async function refreshSession() {
  const user = getCurrentUser();
  if (!user) return false;
  try {
    const res = await callApi({ action: 'checkSession', username: user.username, token: user.token });
    if (res.success && res.user) {
       const beforeLinked = user.linkedArtistId;
       const beforeRole = user.role;
       setCurrentUser(res.user);
       if (res.userData) {
         const data = typeof res.userData === "string" ? JSON.parse(res.userData) : res.userData;
         if (data.userRatings) localStorage.setItem("userRatings", data.userRatings);
         if (data.subscribedArtists) localStorage.setItem("subscribedArtists", data.subscribedArtists);
         if (data.huev_2026_watched) localStorage.setItem("huev_2026_watched", data.huev_2026_watched);
         if (data.reviewNotes) localStorage.setItem("reviewNotes", data.reviewNotes);
         if (data.myGlobalReview) localStorage.setItem("myGlobalReview", data.myGlobalReview);
         if (data.personalProfile) localStorage.setItem("personalProfile", data.personalProfile);
       }
       if (beforeLinked !== res.user.linkedArtistId || beforeRole !== res.user.role) {
           return true;
       }
    }
  } catch(e) { console.error(e); }
  return false;
}
