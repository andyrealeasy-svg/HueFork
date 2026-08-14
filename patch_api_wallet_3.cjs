const fs = require('fs');
let apiCode = fs.readFileSync('api.js', 'utf8');

if (!apiCode.includes("import { reviews } from './data.js';")) {
    apiCode = apiCode.replace("import { supabase }", "import { supabase } from './supabaseClient.js';\nimport { reviews } from './data.js';\n//");
}

const buyItemOldRegex = /if\s*\\(payload\.action === 'buyItem'\\)\s*{([\\s\\S]*?)return { success: false, error: "Недостаточно HueCoins" };\s*}\s*}/;
const buyItemMatch = apiCode.match(buyItemOldRegex);

if (buyItemMatch && !buyItemMatch[0].includes("transactions")) {
    const buyItemNew = `if (payload.action === 'buyItem') {
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
      }`;
    apiCode = apiCode.replace(buyItemOldRegex, buyItemNew);
    console.log("Patched buyItem.");
}

const claimDailyOldRegex = /if\s*\\(payload\.action === 'claimDaily'\\)\s*{([\\s\\S]*?)return { success: true, added, hueCoins: hc, type };\s*}/;
const claimDailyMatch = apiCode.match(claimDailyOldRegex);

if (claimDailyMatch && !claimDailyMatch[0].includes("transactions")) {
    const claimDailyNew = claimDailyMatch[0].replace(
        "return { success: true, added, hueCoins: hc, type };",
        `try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: type === 'register' ? 'registration' : 'bonus',
                amount: added,
                balance_after: hc,
                comment: type === 'register' ? 'Бонус за регистрацию' : 'Ежедневный бонус'
            });
        } catch(e) {}
        return { success: true, added, hueCoins: hc, type };`
    );
    apiCode = apiCode.replace(claimDailyOldRegex, claimDailyNew);
    console.log("Patched claimDaily.");
}

fs.writeFileSync('api.js', apiCode);
