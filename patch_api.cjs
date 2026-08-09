const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newAction = `
      if (payload.action === 'getUssGlobalStats') {
        const { data: allUsers } = await supabase.from('uss_civil_war').select('data_json');
        let stateVotes = {};
        let totalVotes = 0;
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
            }
        }
        
        const { data: reviews } = await supabase.from('uss_reviews').select('*');
        return { success: true, stateVotes, totalVotes, reviews: reviews || [] };
      }
      if (payload.action === 'saveUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        await supabase.from('uss_reviews').insert({
            username: payload.username,
            track_ratings: JSON.stringify(payload.trackRatings),
            criteria_ratings: JSON.stringify(payload.criteriaRatings),
            text: payload.text,
            likes: 0,
            date: new Date().toISOString()
        });
        return { success: true };
      }
      if (payload.action === 'likeUssReview') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Access denied" };
        
        const { data: existing } = await supabase.from('uss_reviews').select('*').eq('id', payload.reviewId).single();
        if (existing) {
            let liked_by = [];
            try { liked_by = JSON.parse(existing.liked_by || "[]"); } catch(e) {}
            if (liked_by.includes(payload.username)) {
                liked_by = liked_by.filter(u => u !== payload.username);
            } else {
                liked_by.push(payload.username);
            }
            await supabase.from('uss_reviews').update({ likes: liked_by.length, liked_by: JSON.stringify(liked_by) }).eq('id', payload.reviewId);
            return { success: true, likes: liked_by.length, liked: liked_by.includes(payload.username) };
        }
        return { success: false };
      }
`;

code = code.replace(/return \{ success: false, error: "Неизвестное действие" \};/, newAction + '\n      return { success: false, error: "Неизвестное действие" };');
fs.writeFileSync('api.js', code);
