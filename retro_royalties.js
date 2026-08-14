import { createClient } from '@supabase/supabase-js';
import { reviews } from './data.js';

// Hardcode variables from supabaseClient.js for node context
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://uamwoljjhcgxeikjexpn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbXdvbGpqaGNneGVpa2pleHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTg0OTExMywiZXhwIjoyMTAxNDI1MTEzfQ.IoTyXPylwWADJTrUoS_NbHLZV4Llk4YW2OGO41ku980';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log("Starting retroactive royalties migration...");
    
    // Get all purchases
    const { data: purchases, error: purErr } = await supabase.from('purchases').select('*');
    if (purErr || !purchases) {
        console.error("Failed to fetch purchases", purErr);
        return;
    }
    
    console.log(`Found ${purchases.length} purchases.`);
    
    // Group royalties by artist username
    const artistRoyalties = {};
    
    for (const p of purchases) {
        const review = reviews.find(r => r.id === p.review_id);
        if (!review || !review.artistId) continue;
        
        // Find linked user for artist
        const { data: linked } = await supabase.from('linked_users').select('*').eq('artist_id', review.artistId);
        if (!linked || linked.length === 0) continue;
        
        const artistUser = linked[0].username;
        
        let amount = 0;
        if (p.type === 'digital') amount = 3;
        else if (p.type === 'cd') amount = 12;
        else if (p.type === 'vinyl') amount = 30;
        
        if (amount > 0) {
            if (!artistRoyalties[artistUser]) artistRoyalties[artistUser] = 0;
            artistRoyalties[artistUser] += amount;
        }
    }
    
    console.log("Calculated royalties to distribute:", artistRoyalties);
    
    for (const username of Object.keys(artistRoyalties)) {
        const amount = artistRoyalties[username];
        
        let { data: wallets } = await supabase.from('wallet').select('royalty_balance').eq('username', username);
        if (wallets && wallets.length > 0) {
            await supabase.from('wallet').update({ royalty_balance: wallets[0].royalty_balance + amount }).eq('username', username);
        } else {
            await supabase.from('wallet').insert({ username, pin: '0000', royalty_balance: amount, trust_rating: 500 });
        }
        
        console.log(`Added ${amount} HC to ${username}'s royalty_balance`);
    }
    
    console.log("Migration complete!");
}

migrate().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
