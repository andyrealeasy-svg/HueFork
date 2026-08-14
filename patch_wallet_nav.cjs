const fs = require('fs');
let code = fs.readFileSync('wallet.js', 'utf8');

const oldNavRegex = /const nav = document\.createElement\('div'\);[\s\S]*?app\.appendChild\(nav\);/;

const newNavCode = `
    let walletContent = document.getElementById('wallet-content');
    let walletNav = document.getElementById('wallet-nav');
    let walletModals = document.getElementById('wallet-modals');
    
    if (!walletContent) {
        app.innerHTML = '<div id="wallet-content"></div><div id="wallet-nav"></div><div id="wallet-modals"></div>';
        walletContent = document.getElementById('wallet-content');
        walletNav = document.getElementById('wallet-nav');
        walletModals = document.getElementById('wallet-modals');
    }

    if (isHistory) {
        await renderHistory(walletContent, user);
    } else if (isRoyalty) {
        await renderRoyalty(walletContent, user, res);
    } else {
        renderHome(walletContent, user, res);
    }

    walletNav.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2 py-2 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-40 w-[95%] max-w-md transition-all duration-500 animate-slide-up';
    
    const getBtnCls = (isActive) => isActive ? 
        'flex-1 flex flex-col items-center justify-center gap-1 text-black dark:text-white transform scale-110 transition-all duration-500 bg-zinc-100 dark:bg-zinc-800 py-2 rounded-2xl' : 
        'flex-1 flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-black dark:hover:text-white transition-all duration-500 hover:scale-105 opacity-70 hover:opacity-100 py-2 rounded-2xl';

    // Instead of replacing innerHTML, let's just do it once or replace it. 
    // To get real CSS transitions on size, elements must persist.
    if (!walletNav.hasChildNodes() || walletNav.dataset.artist !== String(!!res.artistId)) {
        walletNav.dataset.artist = String(!!res.artistId);
        walletNav.innerHTML = \`
            <a href="#/wallet/history" id="nav-history" class="\${getBtnCls(isHistory)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">История</span>
            </a>
            <a href="#/wallet" id="nav-home" class="\${getBtnCls(!isHistory && !isRoyalty)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">Главная</span>
            </a>
            \${res.artistId ? \`<a href="#/wallet/royalty" id="nav-royalty" class="\${getBtnCls(isRoyalty)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">Роялти</span>
            </a>\` : ''}
        \`;
    } else {
        document.getElementById('nav-history').className = getBtnCls(isHistory);
        document.getElementById('nav-home').className = getBtnCls(!isHistory && !isRoyalty);
        if (res.artistId) {
            document.getElementById('nav-royalty').className = getBtnCls(isRoyalty);
        }
    }
`;

// Remove the old dispatching logic
code = code.replace(/if \(isHistory\) \{[\s\S]*?renderHome\(app, user, res\);\s*\}/, '');

code = code.replace(oldNavRegex, newNavCode);
code = code.replace(`const modalsContainer = document.createElement("div");\n    modalsContainer.id = "wallet-modals";\n    app.appendChild(modalsContainer);`, '');

fs.writeFileSync('wallet.js', code);
console.log("Patched wallet nav");
