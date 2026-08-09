const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newCode = `
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
      return { success: false, error: "Неизвестное действие" };
`;
code = code.replace('      return { success: false, error: "Неизвестное действие" };', newCode);

fs.writeFileSync('api.js', code);
