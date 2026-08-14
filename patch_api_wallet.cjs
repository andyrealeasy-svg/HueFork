const fs = require('fs');

let apiCode = fs.readFileSync('api.js', 'utf8');

// Import reviews from data.js
if (!apiCode.includes("import { reviews } from './data.js';")) {
    apiCode = apiCode.replace("import { supabase }", "import { supabase } from './supabaseClient.js';\nimport { reviews } from './data.js';\n//");
}

// 1. Update buyItem to support royalty
const buyItemBlock = `
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
            
            // --- WALLET TRANSACTION LOGGING ---
            try {
                await supabase.from('transactions').insert({
                    username: payload.username,
                    type: 'purchase',
                    amount: -price,
                    balance_after: hueCoins,
                    comment: 'Покупка: ' + payload.reviewId
                });

                // Calculate royalty if review exists
                const review = reviews.find(r => r.id === payload.reviewId);
                if (review && review.artistId) {
                    let royaltyAmount = 0;
                    if (payload.type === 'digital') royaltyAmount = 3;
                    else if (payload.type === 'cd') royaltyAmount = 12;
                    else if (payload.type === 'vinyl') royaltyAmount = 30;

                    if (royaltyAmount > 0) {
                        // Find if the artist has a linked user account
                        // Assuming artistId matches username or we need a way to find it.
                        // Wait, data.js has linkedUser for some artists?
                    }
                }
            } catch(e) { console.error("Wallet transaction error:", e); }
            // -----------------------------------

            return { success: true, hueCoins, newBalance: hueCoins };
        } else {
            return { success: false, error: "Недостаточно HueCoins" };
        }
      }
`;
// We will replace the buyItem block entirely later.

// Wait, let's just do it directly with AST or regex? No, the best way is to append the new actions and replace specific ones.
