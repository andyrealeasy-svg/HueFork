const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newAction = `
      if (payload.action === 'getUssGlobalStats') {
        const { data: allUsers } = await supabase.from('uss_civil_war').select('username, data_json');
        let stateVotes = {};
        let totalVotes = 0;
        let reviews = [];
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
                    r.username = user.username;
                    reviews.push(r);
                }
            }
        }
        
        return { success: true, stateVotes, totalVotes, reviews };
      }
      if (payload.action === 'saveUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        const { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.username).single();
        if (existing) {
            let data = {};
            try { data = JSON.parse(existing.data_json); } catch(e) {}
            data.uss_review = {
                trackRatings: payload.trackRatings,
                criteriaRatings: payload.criteriaRatings,
                text: payload.text,
                likes: 0,
                likedBy: [],
                date: new Date().toISOString()
            };
            await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', payload.username);
            return { success: true };
        }
        return { success: false, error: "Пользователь не участвует в ивенте" };
      }
      if (payload.action === 'likeUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        const { data: existing } = await supabase.from('uss_civil_war').select('*').eq('username', payload.targetUsername).single();
        if (existing) {
            let data = {};
            try { data = JSON.parse(existing.data_json); } catch(e) {}
            if (data.uss_review) {
                let likedBy = data.uss_review.likedBy || [];
                if (likedBy.includes(payload.username)) {
                    likedBy = likedBy.filter(u => u !== payload.username);
                } else {
                    likedBy.push(payload.username);
                }
                data.uss_review.likedBy = likedBy;
                data.uss_review.likes = likedBy.length;
                await supabase.from('uss_civil_war').update({ data_json: JSON.stringify(data) }).eq('username', payload.targetUsername);
                return { success: true, likes: likedBy.length, liked: likedBy.includes(payload.username) };
            }
        }
        return { success: false };
      }
`;

// we first remove the old code we added
const regex = /if\s*\(payload\.action === 'getUssGlobalStats'\)\s*\{[\s\S]*?return \{ success: false, error: "Неизвестное действие" \};\s*\}/m;
code = code.replace(regex, newAction + '\n      return { success: false, error: "Неизвестное действие" };');
fs.writeFileSync('api.js', code);
