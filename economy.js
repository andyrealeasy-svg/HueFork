import { callApi, getCurrentUser, setCurrentUser } from './api.js';

export async function checkEconomyPopups() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        const res = await callApi({ action: 'getUserEconomy', username: user.username, token: user.token });
        if (res.success) {
            if (res.canClaimRegister) {
                showEconomyPopup("Регистрация завершена!", "За регистрацию вам начислено 50 HueCoins.", 50);
            } else if (res.canClaimDaily) {
                showEconomyPopup("Ежедневный бонус", "Вам начислено 25 HueCoins за ежедневный вход.", 25);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

function showEconomyPopup(title, description, amount) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
    modal.innerHTML = `
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent pointer-events-none"></div>
        <div class="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600 dark:text-yellow-500"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
        </div>
        <h3 class="font-serif font-black text-2xl mb-2 tracking-tighter text-zinc-900 dark:text-white">${title}</h3>
        <p class="text-zinc-500 font-medium text-sm mb-8">${description}</p>
        <button id="claim-btn" class="w-full bg-yellow-500 text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95">Забрать</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#claim-btn").addEventListener("click", async () => {
        const btn = modal.querySelector("#claim-btn");
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-pulse">Загрузка...</span>`;
        const user = getCurrentUser();
        const res = await callApi({ action: 'claimBonus', username: user.username, token: user.token });
        if (res.success) {
            modal.remove();
            // Try check again if daily is also available after register
            if (res.type === 'register') {
                checkEconomyPopups();
            }
        } else {
            alert(res.error || "Ошибка при получении бонуса");
            modal.remove();
        }
    });
}
