import { callApi, getCurrentUser, setCurrentUser } from "./api.js";

export async function renderWallet() {
    const app = document.getElementById("app");
    const user = getCurrentUser();
    
    if (!user) {
        window.location.hash = "#/";
        return;
    }

    if (!document.getElementById('wallet-content')) {
        app.innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;
    } else {
        document.getElementById('wallet-content').innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;
    }

    const hash = window.location.hash;
    const isHistory = hash === "#/wallet/history";
    const isRoyalty = hash === "#/wallet/royalty";

    // Need to check PIN unless already authenticated in this session.
    if (!window.walletUnlocked) {
        // First check wallet info to know whether user needs to create a new PIN or enter existing
        const infoRes = await callApi({ action: 'getWalletInfo', username: user.username, token: user.token });
        const needsSetup = !infoRes.success || !infoRes.hasPin;

        app.innerHTML = `
            <div class="max-w-md mx-auto px-4 py-20 text-center animate-slide-up">
                <div class="mb-8">
                    <img src="https://i.postimg.cc/Y21vX809/file-00000000ead881f4a131ab5522c00968.png" alt="HueFork Wallet" class="h-16 mx-auto mb-4 object-contain rounded-2xl">
                    <h1 class="font-serif font-black text-3xl sm:text-4xl uppercase tracking-tighter text-zinc-900 dark:text-white">${needsSetup ? 'Создание PIN-кода' : 'Кошелек'}</h1>
                    <p class="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-bold">${needsSetup ? 'Придумайте 4-значный PIN-код для входа' : 'Введите 4-значный PIN-код'}</p>
                </div>
                
                <div class="flex justify-center gap-4 mb-8">
                    <input type="password" id="pin-1" maxlength="1" inputmode="numeric" class="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <input type="password" id="pin-2" maxlength="1" inputmode="numeric" class="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <input type="password" id="pin-3" maxlength="1" inputmode="numeric" class="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <input type="password" id="pin-4" maxlength="1" inputmode="numeric" class="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-500">
                </div>
                
                <button id="pin-submit" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300">
                    ${needsSetup ? 'Создать PIN-код' : 'Войти'}
                </button>
                <p id="pin-error" class="text-red-500 text-sm mt-4 hidden"></p>
            </div>
        `;

        const inputs = [
            document.getElementById('pin-1'),
            document.getElementById('pin-2'),
            document.getElementById('pin-3'),
            document.getElementById('pin-4')
        ];

        inputs[0]?.focus();

        const submitPin = async () => {
            const pin = inputs.map(i => i.value).join('');
            if (pin.length !== 4) return;

            const btn = document.getElementById('pin-submit');
            if (btn) {
                btn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-black mx-auto"></div>';
            }
            
            if (needsSetup) {
                const setupRes = await callApi({ action: 'setupWallet', username: user.username, token: user.token, pin });
                if (setupRes.success) {
                    window.walletUnlocked = true;
                    renderWallet();
                } else {
                    const errEl = document.getElementById('pin-error');
                    if (errEl) {
                        errEl.textContent = setupRes.error || 'Ошибка создания PIN-кода';
                        errEl.classList.remove('hidden');
                    }
                    if (btn) btn.innerHTML = 'Создать PIN-код';
                }
            } else {
                const checkRes = await callApi({ action: 'checkWalletPin', username: user.username, token: user.token, pin });
                if (checkRes.success) {
                    window.walletUnlocked = true;
                    renderWallet();
                } else if (checkRes.error === 'pin_not_set') {
                    // PIN was removed in DB, setup the new PIN directly
                    const setupRes = await callApi({ action: 'setupWallet', username: user.username, token: user.token, pin });
                    if (setupRes.success) {
                        window.walletUnlocked = true;
                        renderWallet();
                    } else {
                        const errEl = document.getElementById('pin-error');
                        if (errEl) {
                            errEl.textContent = setupRes.error || 'Ошибка настройки PIN-кода';
                            errEl.classList.remove('hidden');
                        }
                        if (btn) btn.innerHTML = 'Войти';
                    }
                } else {
                    const errEl = document.getElementById('pin-error');
                    if (errEl) {
                        errEl.textContent = checkRes.error || 'Неверный PIN-код';
                        errEl.classList.remove('hidden');
                    }
                    inputs.forEach(i => i.value = '');
                    inputs[0]?.focus();
                    if (btn) btn.innerHTML = 'Войти';
                }
            }
        };

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1) {
                    if (index < 3) {
                        inputs[index + 1].focus();
                    } else if (index === 3) {
                        submitPin();
                    }
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                } else if (e.key === 'Enter') {
                    submitPin();
                }
            });
        });

        document.getElementById('pin-submit')?.addEventListener('click', submitPin);
        return;
    }

    // Wallet is unlocked
    const res = await callApi({ action: 'getWalletInfo', username: user.username, token: user.token });
    
    

    
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
        walletNav.innerHTML = `
            <a href="#/wallet/history" id="nav-history" class="${getBtnCls(isHistory)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">История</span>
            </a>
            <a href="#/wallet" id="nav-home" class="${getBtnCls(!isHistory && !isRoyalty)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">Главная</span>
            </a>
            ${res.artistId ? `<a href="#/wallet/royalty" id="nav-royalty" class="${getBtnCls(isRoyalty)}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span class="text-[10px] uppercase font-bold tracking-widest">Роялти</span>
            </a>` : ''}
        `;
    } else {
        document.getElementById('nav-history').className = getBtnCls(isHistory);
        document.getElementById('nav-home').className = getBtnCls(!isHistory && !isRoyalty);
        if (res.artistId) {
            document.getElementById('nav-royalty').className = getBtnCls(isRoyalty);
        }
    }

    
    
}

function renderHome(app, user, data) {
    const { hueCoins, wallet, artistId } = data;
    
    app.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8 animate-slide-up pb-32">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="font-serif font-black text-3xl uppercase tracking-tighter text-zinc-900 dark:text-white">Кошелек</h1>
                    <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mt-1">Главная</p>
                </div>
            </div>

            <!-- 3D Card -->
            <div class="perspective-1000 mb-12 flex justify-center">
                <div id="wallet-card" class="relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl overflow-hidden cursor-pointer transform-style-3d transition-transform duration-200 border border-zinc-800">
                    <!-- Shine effect -->
                    <div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 pointer-events-none transform -skew-x-12 translate-x-[-150%] animate-shine"></div>
                    
                    <!-- Content -->
                    <div class="absolute inset-0 p-6 flex flex-col justify-between">
                        <div class="flex justify-end">
                            <img src="https://i.postimg.cc/65Jdqy2G/file-000000008820824386263b9fdee3be41.png" alt="HueBank" class="h-8 opacity-90 drop-shadow-md rounded-lg">
                        </div>
                        <div class="flex justify-between items-end">
                            <div class="text-zinc-300 font-mono text-sm uppercase tracking-widest truncate max-w-[60%]">
                                ${user.username}
                            </div>
                            <div class="text-right">
                                <div class="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">Баланс</div>
                                <div class="text-white font-black text-2xl tracking-tight">${hueCoins} <span class="text-sm text-zinc-400 font-normal">HC</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center gap-6 sm:gap-12 mb-12">
                <button onclick="window.openWalletModal('transfer')" class="group flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Перевести</span>
                </button>
                <button onclick="window.openWalletModal('topup')" class="group flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Пополнить</span>
                </button>
                <button onclick="window.openWalletModal('credit')" class="group flex flex-col items-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-widest text-zinc-500">Кредит</span>
                </button>
            </div>
            
            <style>
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                @keyframes shine {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                .animate-shine { animation: shine 3s infinite; }
            </style>
        </div>
        
        <!-- Modals Container -->
        
    `;

    setupCardAnimation();
    window.walletDataCache = data;
}

function setupCardAnimation() {
    const card = document.getElementById('wallet-card');
    if (!card) return;

    const handleMove = (e) => {
        let x, y;
        if (e.type === 'touchmove') {
            const rect = card.getBoundingClientRect();
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.offsetX;
            y = e.offsetY;
        }
        
        const cx = card.offsetWidth / 2;
        const cy = card.offsetHeight / 2;
        const rotateX = ((y - cy) / cy) * -10;
        const rotateY = ((x - cx) / cx) * 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleLeave = () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        card.style.transition = 'transform 0.5s ease';
    };
    
    const handleEnter = () => {
        card.style.transition = 'none';
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('mouseenter', handleEnter);
    
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const maxTilt = 40;
            const beta = Math.min(Math.max((e.beta || 0) - 45, -maxTilt), maxTilt);
            const gamma = Math.min(Math.max((e.gamma || 0), -maxTilt), maxTilt);
            card.style.transition = 'transform 0.2s ease-out';
            card.style.transform = `rotateX(${-beta}deg) rotateY(${gamma}deg)`;
        });
    }
}

window.openWalletModal = (type) => {
    const container = document.getElementById('wallet-modals');
    const user = getCurrentUser();
    const data = window.walletDataCache;
    
    let html = '';
    
    if (type === 'transfer') {
        html = `
            <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
                <div class="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800">
                    <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-6">Перевод</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Получатель (ник)</label>
                            <div class="relative">
                                <input type="text" id="transfer-target" autocomplete="off" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                                <div id="transfer-autocomplete" class="absolute z-10 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg hidden overflow-hidden max-h-48 overflow-y-auto"></div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Сумма (HC)</label>
                            <input type="number" id="transfer-amount" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Комментарий</label>
                            <input type="text" id="transfer-comment" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                        </div>
                        <p id="transfer-error" class="text-red-500 text-sm hidden"></p>
                    </div>
                    <div class="mt-8 flex gap-3">
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''" class="flex-1 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Отмена</button>
                        <button id="transfer-submit" class="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Перевести</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    if (type === 'topup') {
        html = `
            <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
                <div class="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                    <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-6">Пополнить</h3>
                    
                    <div class="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-700 mb-6">
                        <div class="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                            <span class="text-2xl font-black uppercase text-zinc-500">${user.username[0]}</span>
                        </div>
                        <p class="font-bold text-lg text-zinc-900 dark:text-white">${user.username}</p>
                        <p class="text-xs text-zinc-500 uppercase tracking-widest mt-1">Отправьте HC по этому нику</p>
                    </div>

                    <button id="topup-share" class="w-full bg-[#0088cc] text-white hover:bg-[#0077b3] px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        Поделиться в Telegram
                    </button>
                    <button onclick="document.getElementById('wallet-modals').innerHTML=''" class="w-full mt-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Закрыть</button>
                </div>
            </div>
        `;
    }

    if (type === 'credit') {
        const tr = data.wallet ? data.wallet.trust_rating : 500;
        let limit = 0;
        if (tr >= 200 && tr < 400) limit = 25;
        else if (tr >= 400 && tr < 600) limit = 50;
        else if (tr >= 600 && tr < 800) limit = 100;
        else if (tr >= 800 && tr < 950) limit = 150;
        else if (tr >= 950) limit = 200;

        const hasActive = data.activeCredits.length > 0 || data.overdueCredits.length > 0;
        let activeHTML = '';
        
        if (hasActive) {
            const c = data.overdueCredits.length > 0 ? data.overdueCredits[0] : data.activeCredits[0];
            const remaining = c.amount_due - c.amount_paid;
            const statusLabel = c.status === 'overdue' ? '<span class="text-red-500">ПРОСРОЧЕН</span>' : '<span class="text-emerald-500">АКТИВЕН</span>';
            activeHTML = `
                <div class="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 mb-6 text-left space-y-2">
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest"><span class="text-zinc-500">Статус</span>${statusLabel}</div>
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest"><span class="text-zinc-500">К погашению</span><span class="text-zinc-900 dark:text-white">${remaining} HC</span></div>
                    <div class="flex justify-between text-xs font-bold uppercase tracking-widest"><span class="text-zinc-500">Срок</span><span class="text-zinc-900 dark:text-white">${new Date(c.due_date).toLocaleDateString()}</span></div>
                    
                    <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div class="flex gap-2">
                            <input type="number" id="repay-amount" placeholder="Сумма" value="${remaining}" class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black">
                            <button id="repay-submit" class="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px]">Погасить</button>
                        </div>
                        <p id="repay-error" class="text-red-500 text-[10px] mt-1 hidden"></p>
                    </div>
                </div>
            `;
        }

        html = `
            <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
                <div class="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center max-h-[90vh] overflow-y-auto">
                    <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-6">Кредит</h3>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
                            <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Рейтинг доверия</div>
                            <div class="text-2xl font-black ${tr < 400 ? 'text-red-500' : tr > 800 ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'}">${tr}</div>
                        </div>
                        <div class="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
                            <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Лимит</div>
                            <div class="text-2xl font-black text-zinc-900 dark:text-white">${limit} <span class="text-xs text-zinc-400">HC</span></div>
                        </div>
                    </div>

                    ${activeHTML}

                    ${!hasActive && limit > 0 ? `
                        <div class="space-y-4 mb-6 text-left">
                            <div>
                                <label class="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Сумма (HC)</label>
                                <input type="number" id="credit-amount" placeholder="До ${limit}" max="${limit}" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                            </div>
                            <p class="text-[10px] text-zinc-500">Срок возврата: 14 дней. Процент: 5%.</p>
                            <p id="credit-error" class="text-red-500 text-[10px] hidden"></p>
                            <button id="credit-submit" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Взять кредит</button>
                        </div>
                    ` : ''}
                    
                    <button onclick="document.getElementById('wallet-modals').innerHTML=''" class="w-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Закрыть</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;

    // Overlay click to close
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') container.innerHTML = '';
    });

    // Topup share

    const targetInput = document.getElementById('transfer-target');
    const autocompleteBox = document.getElementById('transfer-autocomplete');
    if (targetInput && autocompleteBox) {
        let timeout = null;
        targetInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            const query = e.target.value.trim();
            if (query.length === 0) {
                autocompleteBox.innerHTML = '';
                autocompleteBox.classList.add('hidden');
                return;
            }
            timeout = setTimeout(async () => {
                const res = await callApi({ action: 'searchUsers', query });
                if (res.success && res.users.length > 0) {
                    autocompleteBox.innerHTML = res.users.map(u => `
                        <div class="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors" onclick="document.getElementById('transfer-target').value='${u.username}'; document.getElementById('transfer-autocomplete').classList.add('hidden');">
                            <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 bg-cover bg-center" style="${u.avatar ? `background-image: url('${u.avatar}')` : ''}"></div>
                            <span class="font-bold text-sm">${u.username}</span>
                        </div>
                    `).join('');
                    autocompleteBox.classList.remove('hidden');
                } else {
                    autocompleteBox.innerHTML = '<div class="p-4 text-xs text-zinc-500 text-center uppercase tracking-widest">Не найдено</div>';
                    autocompleteBox.classList.remove('hidden');
                }
            }, 300);
        });
        
        // Hide on click outside
        document.addEventListener('click', (ev) => {
            if (!targetInput.contains(ev.target) && !autocompleteBox.contains(ev.target)) {
                autocompleteBox.classList.add('hidden');
            }
        });
    }

    document.getElementById('topup-share')?.addEventListener('click', () => {
        const text = encodeURIComponent(`Чтобы пожертвовать мне HueCoins в @HueForkBot, переведи мне свои деньги по этому нику: ${user.username}`);
        window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
    });

    // Transfer logic
    document.getElementById('transfer-submit')?.addEventListener('click', async () => {
        const target = document.getElementById('transfer-target').value;
        const amount = document.getElementById('transfer-amount').value;
        const comment = document.getElementById('transfer-comment').value;
        const err = document.getElementById('transfer-error');
        
        if (!target || !amount) return;
        
        const btn = document.getElementById('transfer-submit');
        btn.innerHTML = '...';
        
        const res = await callApi({ action: 'transferHueCoins', username: user.username, token: user.token, targetUsername: target, amount, comment });
        
        if (res.success) {
            document.getElementById('wallet-modals').innerHTML = `
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-zinc-950 p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <img src="https://i.postimg.cc/65Jdqy2G/file-000000008820824386263b9fdee3be41.png" alt="Bank" class="h-10 mx-auto mb-6 rounded-xl">
                        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <p class="text-xs text-zinc-500 mb-2 line-through">${data.hueCoins} HC</p>
                        <p class="text-sm font-bold text-emerald-500 mb-4">${res.hueCoins} HC</p>
                        <p class="text-2xl font-black mb-1">-${amount} HC</p>
                        <p class="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-8">Отправлено: ${target}</p>
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());" class="w-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Вернуться назад</button>
                    </div>
                </div>
            `;
        } else {
            err.textContent = res.error || 'Ошибка';
            err.classList.remove('hidden');
            btn.innerHTML = 'Перевести';
        }
    });

    // Credit borrow logic
    document.getElementById('credit-submit')?.addEventListener('click', async () => {
        const amount = document.getElementById('credit-amount').value;
        const err = document.getElementById('credit-error');
        if (!amount) return;
        
        const res = await callApi({ action: 'takeCredit', username: user.username, token: user.token, amount });
        if (res.success) {
            
            document.getElementById('wallet-modals').innerHTML = `
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-zinc-950 p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-4">Успешно!</h3>
                        <p class="text-zinc-500 mb-8 text-sm">Операция выполнена успешно.</p>
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Отлично</button>
                    </div>
                </div>
            `;
        } else {
            err.textContent = res.error || 'Ошибка';
            err.classList.remove('hidden');
        }
    });

    // Credit repay logic
    document.getElementById('repay-submit')?.addEventListener('click', async () => {
        const amount = document.getElementById('repay-amount').value;
        const err = document.getElementById('repay-error');
        if (!amount) return;
        
        const res = await callApi({ action: 'repayCredit', username: user.username, token: user.token, amount });
        if (res.success) {
            
            document.getElementById('wallet-modals').innerHTML = `
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-zinc-950 p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-4">Успешно!</h3>
                        <p class="text-zinc-500 mb-8 text-sm">Операция выполнена успешно.</p>
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Отлично</button>
                    </div>
                </div>
            `;
        } else {
            err.textContent = res.error || 'Ошибка';
            err.classList.remove('hidden');
        }
    });
}

async function renderHistory(app, user) {
    const res = await callApi({ action: 'getWalletHistory', username: user.username, token: user.token });
    
    let listHTML = '<div class="text-center text-zinc-500 mt-12 text-sm uppercase tracking-widest">Нет транзакций</div>';
    let summaryHTML = '';
    
    if (res.success && res.transactions && res.transactions.length > 0) {
        window.walletTransactionsCache = res.transactions;
        // Compute monthly summary
        const monthly = {};
        res.transactions.forEach(t => {
            const date = new Date(t.created_at);
            const month = date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
            if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
            if (t.amount > 0) monthly[month].income += t.amount;
            else monthly[month].expense += Math.abs(t.amount);
        });

        summaryHTML = Object.entries(monthly).map(([m, data]) => `
            <div class="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <span class="text-sm font-bold capitalize">${m}</span>
                <div class="text-right text-xs">
                    <span class="text-emerald-500">+${data.income} HC</span> / 
                    <span class="text-red-500">-${data.expense} HC</span>
                </div>
            </div>
        `).join('');

        const grouped = {};
        res.transactions.forEach(t => {
            const d = new Date(t.created_at);
            const dateStr = d.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'long', year: 'numeric' });
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(t);
        });

        listHTML = Object.entries(grouped).map(([date, txs]) => {
            let dayHtml = `<div class="bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 sticky top-0 z-10 border-b border-zinc-100 dark:border-zinc-800">${date}</div>`;
            
            dayHtml += txs.map(t => {
                const isIncome = t.amount > 0;
                const color = isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white';
                const sign = isIncome ? '+' : '';
                
                let icon = '<circle cx="12" cy="12" r="10"/>';
                if (t.type === 'transfer_in' || t.type === 'transfer_out' || t.type === 'transfer') icon = '<path d="M5 12h14M12 5l7 7-7 7"/>';
                if (t.type === 'purchase') icon = '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>';
                if (t.type === 'bonus' || t.type === 'registration') icon = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
                
                const typeNames = {
                    'credit_repay': 'Погашение кредита',
                    'credit_borrow': 'Взят кредит',
                    'transfer_out': 'Перевод (исх)',
                    'transfer_in': 'Перевод (вх)',
                    'transfer': 'Перевод',
                    'purchase': 'Покупка',
                    'bonus': 'Ежедневный бонус',
                    'registration': 'Бонус за регистрацию',
                    'royalty': 'Роялти',
                    'royalty_claim': 'Вывод роялти'
                };
                const typeName = typeNames[t.type.toLowerCase()] || t.type;
                const timeStr = new Date(t.created_at).toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' });

                return `
                    <div onclick="window.openTxDetails('${t.id}')" class="cursor-pointer flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">${typeName}</p>
                                ${t.comment ? `<p class="text-[10px] text-zinc-500 mt-1 max-w-[150px] sm:max-w-[300px] truncate">${t.comment}</p>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-black ${color}">${sign}${t.amount} HC</p>
                            <p class="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">${timeStr}</p>
                        </div>
                    </div>
                `;
            }).join('');
            return dayHtml;
        }).join('');
    }

    app.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8 animate-slide-up pb-32">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    <div>
                        <h1 class="font-serif font-black text-3xl uppercase tracking-tighter text-zinc-900 dark:text-white">История</h1>
                        <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mt-1">Транзакции</p>
                    </div>
                </div>
                ${summaryHTML ? `
                <button onclick="document.getElementById('monthly-summary').classList.toggle('hidden')" class="bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-colors">
                    Сводка
                </button>
                ` : ''}
            </div>

            ${summaryHTML ? `
            <div id="monthly-summary" class="hidden bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm">
                <h4 class="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-4">По месяцам</h4>
                ${summaryHTML}
            </div>
            ` : ''}
            
            <div class="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                ${listHTML}
            </div>
        </div>
    `;
}

async function renderRoyalty(app, user, data) {
    if (!data.artistId) {
        window.location.hash = "#/wallet";
        return;
    }

    const bal = data.wallet ? data.wallet.royalty_balance : 0;
    
    // Fetch history
    const histRes = await callApi({ action: 'getRoyaltyHistory', username: user.username, token: user.token });
    const history = histRes.success && histRes.history ? histRes.history : [];
    
    let histHtml = '<div class="text-center text-zinc-500 mt-12 text-sm uppercase tracking-widest">Нет покупок</div>';
    if (history.length > 0) {
        const typeNames = {
            'digital': 'Digital',
            'cd': 'CD',
            'vinyl': 'Винил'
        };
        histHtml = history.map(item => {
            const tName = typeNames[item.type] || item.type;
            const d = new Date(item.date).toLocaleDateString('ru-RU');
            return `
                <div class="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-left">
                    <div>
                        <p class="font-bold text-zinc-900 dark:text-white mb-1">${item.reviewTitle}</p>
                        <p class="text-xs text-zinc-500 uppercase tracking-widest">${d} &middot; ${item.buyer} &middot; ${tName}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-emerald-500 font-bold">+${item.amount} HC</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    app.innerHTML = `
        <div class="max-w-3xl mx-auto px-4 py-8 animate-slide-up pb-32 text-center">
            <!-- Header -->
            <div class="flex items-center gap-4 mb-12 text-left">
                <div>
                    <h1 class="font-serif font-black text-3xl uppercase tracking-tighter text-zinc-900 dark:text-white">Роялти</h1>
                    <p class="text-zinc-500 uppercase tracking-widest text-xs font-bold mt-1">Для артистов</p>
                </div>
            </div>

            <div class="mb-12">
                <p class="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Накоплено</p>
                <div class="text-6xl sm:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">${bal} <span class="text-xl sm:text-2xl text-zinc-300">HC</span></div>
            </div>

            <button id="claim-royalty" class="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-xl hover:-translate-y-1 mb-16 ${bal <= 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                Забрать средства
            </button>
            <p id="claim-error" class="text-red-500 text-sm mt-4 hidden"></p>
            
            <div class="mt-8 text-left max-w-2xl mx-auto">
                <h3 class="font-serif font-black text-2xl uppercase tracking-tighter text-zinc-900 dark:text-white mb-6 text-center">История покупок</h3>
                <div class="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                    ${histHtml}
                </div>
            </div>
        </div>
    `;

    document.getElementById('claim-royalty')?.addEventListener('click', async () => {
        if (bal <= 0) return;
        const btn = document.getElementById('claim-royalty');
        btn.innerHTML = '...';
        
        const res = await callApi({ action: 'claimRoyalties', username: user.username, token: user.token });
        if (res.success) {
            document.getElementById('wallet-modals').innerHTML = `
                <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-zinc-950 p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                        <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-4">Успешно!</h3>
                        <p class="text-zinc-500 mb-8 text-sm">Операция выполнена успешно.</p>
                        <button onclick="document.getElementById('wallet-modals').innerHTML=''; import('./wallet.js').then(m => m.renderWallet());" class="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">Отлично</button>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('claim-error').textContent = res.error || 'Ошибка';
            document.getElementById('claim-error').classList.remove('hidden');
            btn.innerHTML = 'Забрать средства';
        }
    });
}
window.openTxDetails = (id) => {
    if (!window.walletTransactionsCache) return;
    const t = window.walletTransactionsCache.find(x => x.id === id);
    if (!t) return;
    
    const isIncome = t.amount > 0;
    const color = isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white';
    const sign = isIncome ? '+' : '';
    
    let typeNames = {
        'credit_repay': 'Погашение кредита',
        'credit_borrow': 'Взят кредит',
        'transfer_out': 'Перевод (исх)',
        'transfer_in': 'Перевод (вх)',
        'transfer': 'Перевод',
        'purchase': 'Покупка',
        'bonus': 'Ежедневный бонус',
        'registration': 'Бонус за регистрацию',
        'royalty': 'Роялти',
        'royalty_claim': 'Вывод роялти'
    };
    const typeName = typeNames[t.type.toLowerCase()] || t.type;
    
    document.getElementById('wallet-modals').innerHTML = `
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" id="modal-overlay">
            <div class="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl w-full max-w-md animate-slide-up shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
                <button onclick="document.getElementById('wallet-modals').innerHTML=''" class="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white p-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div class="text-center mb-8 pt-4">
                    <p class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">${typeName}</p>
                    <p class="text-4xl font-black ${color} tracking-tighter">${sign}${t.amount} <span class="text-lg text-zinc-400">HC</span></p>
                </div>
                
                <div class="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Дата и время</span>
                        <span class="font-mono text-zinc-900 dark:text-white">${new Date(t.created_at).toLocaleString('ru-RU')}</span>
                    </div>
                    ${t.target_username ? `
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">${isIncome ? 'Отправитель' : 'Получатель'}</span>
                        <span class="font-bold text-zinc-900 dark:text-white">${t.target_username}</span>
                    </div>
                    ` : ''}
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Остаток</span>
                        <span class="font-bold text-zinc-900 dark:text-white">${t.balance_after} HC</span>
                    </div>
                    ${t.comment ? `
                    <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <span class="block text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2">Комментарий</span>
                        <span class="text-sm text-zinc-900 dark:text-white leading-relaxed">${t.comment}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
};
