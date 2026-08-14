const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

const getRoyaltyHistoryCode = `
      if (payload.action === 'getRoyaltyHistory') {
        const auth = await checkAuth(payload);
        if (!auth.success) return { success: false, error: "Auth failed" };
        
        let { data: linked } = await supabase.from('linked_users').select('*').eq('username', payload.username);
        let artistId = (linked && linked.length > 0) ? linked[0].artist_id : null;
        if (!artistId) return { success: false, error: "Not an artist" };

        const artistReviewIds = reviews.filter(r => r.artistId === artistId).map(r => r.id);
        
        let { data: purchases } = await supabase.from('purchases').select('*').in('review_id', artistReviewIds).order('date', { ascending: false });
        
        let history = (purchases || []).map(p => {
            const review = reviews.find(r => r.id === p.review_id);
            let amount = 0;
            if (p.type === 'digital') amount = 3;
            else if (p.type === 'cd') amount = 12;
            else if (p.type === 'vinyl') amount = 30;
            return {
                id: p.id,
                date: p.date,
                reviewTitle: review ? review.title : p.review_id,
                type: p.type,
                amount: amount,
                buyer: p.username
            };
        });

        return { success: true, history };
      }
`;

if (!code.includes("getRoyaltyHistory")) {
    code = code.replace("if (payload.action === 'claimRoyalties') {", getRoyaltyHistoryCode + "      if (payload.action === 'claimRoyalties') {");
    fs.writeFileSync('api.js', code);
    console.log("Patched api.js with getRoyaltyHistory");
}
