const fs = require('fs');
let apiCode = fs.readFileSync('api.js', 'utf8');

if (!apiCode.includes("import { reviews } from './data.js';")) {
    apiCode = apiCode.replace("import { supabase }", "import { supabase } from './supabaseClient.js';\nimport { reviews } from './data.js';\n//");
}

let changed = false;

// buyItem
const buyItemSplit = apiCode.split("if (payload.action === 'buyItem') {");
if (buyItemSplit.length > 1) {
    const innerSplit = buyItemSplit[1].split("return { success: false, error: \"Недостаточно HueCoins\" };\n        }\n      }");
    if (innerSplit.length > 1 && !buyItemSplit[1].includes("transactions")) {
        const newBuyItem = `if (payload.action === 'buyItem') {
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
        apiCode = buyItemSplit[0] + newBuyItem + innerSplit.slice(1).join("return { success: false, error: \"Недостаточно HueCoins\" };\n        }\n      }");
        changed = true;
        console.log("Patched buyItem.");
    }
}

// claimDaily
if (apiCode.includes("return { success: true, added, hueCoins: hc, type };") && !apiCode.includes("transactions').insert({")) {
    apiCode = apiCode.replace("return { success: true, added, hueCoins: hc, type };", `try {
            await supabase.from('transactions').insert({
                username: payload.username,
                type: type === 'register' ? 'registration' : 'bonus',
                amount: added,
                balance_after: hc,
                comment: type === 'register' ? 'Бонус за регистрацию' : 'Ежедневный бонус'
            });
        } catch(e) {}
        return { success: true, added, hueCoins: hc, type };`);
    changed = true;
    console.log("Patched claimDaily.");
}

if (changed) {
    fs.writeFileSync('api.js', apiCode);
    console.log("api.js saved.");
}
