const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newCode = `
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
      return { success: false, error: "Неизвестное действие" };
`;
code = code.replace('      return { success: false, error: "Неизвестное действие" };', newCode);

fs.writeFileSync('api.js', code);
