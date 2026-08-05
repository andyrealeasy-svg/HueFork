const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const newActions = `      if (payload.action === 'getUserPublicProfile') {
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
        return { success: true, profile: { username: userRow.username, avatarUrl: pData.avatarUrl, bannerUrl: pData.bannerUrl, nicknameColor: pData.nicknameColor, favorites: pData.favorites } };
      }
      if (payload.action === 'searchUsers') {
        let { data: users, error } = await supabase.from('users').select('username, data').ilike('username', \`%\${payload.query}%\`).limit(10);
        if (!users) return { success: true, users: [] };
        const results = users.map(u => {
           let avatar = "";
           if (u.data) {
             try {
               const allData = typeof u.data === 'string' ? JSON.parse(u.data) : u.data;
               const pData = typeof allData.personalProfile === 'string' ? JSON.parse(allData.personalProfile) : (allData.personalProfile || {});
               avatar = pData.avatarUrl || "";
             } catch(e) {}
           }
           return { username: u.username, avatar };
        });
        return { success: true, users: results };
      }
      if (payload.action === 'getUsersList') {`;

code = code.replace("if (payload.action === 'getUsersList') {", newActions);
fs.writeFileSync('api.js', code);
