const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const claimBonusOld = `
        if (!rc) {
            rc = true;
            hc += 50;
            added = 50;
            type = "register";
        } else if (lastBonus !== today) {
            lastBonus = today;
            hc += 25;
            added = 25;
            type = "daily";
        } else {
            return { success: false, error: "Вы уже получили сегодняшний бонус" };
        }

        await supabase.from('users').update({ hue_coins: hc, registered_claimed: rc, last_bonus_date: today }).eq('username', payload.username);
`;

const claimBonusNew = `
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
`;

code = code.replace(claimBonusOld.trim(), claimBonusNew.trim());
fs.writeFileSync('api.js', code);
