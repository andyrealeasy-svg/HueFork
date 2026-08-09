const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newCode = `
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
      return { success: false, error: "Неизвестное действие" };
`;
code = code.replace('      return { success: false, error: "Неизвестное действие" };', newCode);

fs.writeFileSync('api.js', code);
