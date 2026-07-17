const API = 'https://script.google.com/macros/s/AKfycbyJwOFajhYG4LSo1mEI-79b7PEOXU_Cl6klTyqc89Z0KXZMTkAhOn_Mar-1e-r6uDo55g/exec';
async function run() {
  const loginRes = await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'login', username: 'ai_bot_test', password: '123' }) }).then(r=>r.json());
  console.log('login:', loginRes);
  if (loginRes.success) {
    const ecoRes1 = await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'getUserEconomy', username: 'ai_bot_test', token: loginRes.user.token }) }).then(r=>r.json());
    console.log('eco1:', ecoRes1);
    
    const claimRes1 = await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'claimBonus', username: 'ai_bot_test', token: loginRes.user.token }) }).then(r=>r.json());
    console.log('claim1:', claimRes1);
    
    const claimRes2 = await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'claimBonus', username: 'ai_bot_test', token: loginRes.user.token }) }).then(r=>r.json());
    console.log('claim2:', claimRes2);
    
    const ecoRes2 = await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'getUserEconomy', username: 'ai_bot_test', token: loginRes.user.token }) }).then(r=>r.json());
    console.log('eco2:', ecoRes2);
  }
}
run();
