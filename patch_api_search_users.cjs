const fs = require('fs');
let apiCode = fs.readFileSync('api.js', 'utf8');

if (!apiCode.includes("payload.action === 'searchUsers'")) {
    const searchCode = `
      if (payload.action === 'searchUsers') {
        const query = (payload.query || "").trim();
        if (query.length < 1) return { success: true, users: [] };
        
        let { data: users } = await supabase.from('users').select('username, data').ilike('username', \`%\${query}%\`).limit(5);
        let result = (users || []).map(u => {
            let d = {};
            try { d = typeof u.data === 'string' ? JSON.parse(u.data) : (u.data || {}); } catch(e) {}
            let avatar = (d.personalProfile && d.personalProfile.avatar) ? d.personalProfile.avatar : '';
            return { username: u.username, avatar };
        });
        
        return { success: true, users: result };
      }
`;
    apiCode = apiCode.replace("if (payload.action === 'transferHueCoins') {", searchCode + "      if (payload.action === 'transferHueCoins') {");
    fs.writeFileSync('api.js', apiCode);
    console.log("Patched api.js with searchUsers");
} else {
    console.log("Already patched");
}
