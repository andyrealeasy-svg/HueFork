import { callApi, getCurrentUser } from './api.js';

let isChecking = false;

export async function checkEconomyPopups() {
    const user = getCurrentUser();
    if (!user || !user.username) return;

    // Do not show reminder if user is currently on the Drop page
    if (window.location.hash === '#/drop') return;

    // Do not show duplicate if modal is already open in DOM
    if (document.getElementById('economy-reminder-modal')) return;

    // Check if reminded in current session for this user
    if (sessionStorage.getItem('dailyBonusReminded_' + user.username)) return;

    if (isChecking) return;
    isChecking = true;

    try {
        const res = await callApi({ action: 'getUserEconomy', username: user.username, token: user.token });
        if (res && res.success) {
            if (res.canClaimRegister || res.canClaimDaily) {
                sessionStorage.setItem('dailyBonusReminded_' + user.username, 'true');
                showEconomyReminder(res.canClaimRegister);
            }
        }
    } catch (e) {
        console.error("Economy check error:", e);
    } finally {
        isChecking = false;
    }
}

export function resetEconomyReminderSession(username) {
    if (username) {
        sessionStorage.removeItem('dailyBonusReminded_' + username);
    } else {
        const user = getCurrentUser();
        if (user && user.username) {
            sessionStorage.removeItem('dailyBonusReminded_' + user.username);
        }
    }
}

function showEconomyReminder(isRegister = false) {
    if (document.getElementById('economy-reminder-modal')) return;
    if (window.location.hash === '#/drop') return;

    const modal = document.createElement("div");
    modal.id = "economy-reminder-modal";
    modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in";
    modal.innerHTML = `
      <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent pointer-events-none"></div>
        <div class="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-600 dark:text-yellow-500"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>
        </div>
        <h3 class="font-serif font-black text-2xl mb-2 tracking-tighter text-zinc-900 dark:text-white">Не забудьте!</h3>
        <p class="text-zinc-500 font-medium text-sm mb-8">${isRegister ? 'Вы еще не забрали свой приветственный бонус за регистрацию (50 HC). Загляните на страницу Дропа!' : 'Вы еще не забрали свой ежедневный бонус. Загляните на страницу Дропа!'}</p>
        <div class="flex flex-col gap-3">
            <button id="go-to-drop" class="w-full bg-yellow-500 text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md transform hover:scale-105 active:scale-95">Перейти в Дроп</button>
            <button id="close-reminder" class="w-full text-zinc-500 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:text-zinc-800 dark:hover:text-zinc-300 transition-all">Позже</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#go-to-drop").addEventListener("click", () => {
        modal.remove();
        window.location.hash = '#/drop';
    });
    modal.querySelector("#close-reminder").addEventListener("click", () => {
        modal.remove();
    });
}
