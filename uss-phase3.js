import { callApi, getCurrentUser } from "./api.js";
import { reviews, getArtist } from "./data.js";

function customAlert(message, callback) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">${message}</p>
            <button id="alert-ok" class="bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">OK</button>
        </div>
    `;
    document.body.appendChild(m);
    m.querySelector('#alert-ok').addEventListener('click', () => {
        m.remove();
        if (callback) callback();
    });
}

function customConfirm(message, onConfirm) {
    const m = document.createElement("div");
    m.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in";
    m.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
            <p class="text-zinc-900 dark:text-white font-medium mb-6">${message}</p>
            <div class="flex gap-4">
                <button id="confirm-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">Отмена</button>
                <button id="confirm-ok" class="flex-1 bg-red-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-xl transition-colors hover:bg-red-700">Да</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
    m.querySelector('#confirm-cancel').addEventListener('click', () => m.remove());
    m.querySelector('#confirm-ok').addEventListener('click', () => {
        m.remove();
        onConfirm();
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function showScoreDetailsModal(review, album) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in";
    
    // Calculate averages & score
    let tSum = 0, tCount = 0;
    if (review.trackRatings) {
        Object.values(review.trackRatings).forEach(v => {
            if (typeof v === 'number' && !isNaN(v)) { tSum += v; tCount++; }
        });
    }
    let cSum = 0, cCount = 0;
    if (review.criteriaRatings) {
        Object.values(review.criteriaRatings).forEach(v => {
            if (typeof v === 'number' && !isNaN(v)) { cSum += v; cCount++; }
        });
    }
    const tAvg = tCount ? tSum / tCount : 0;
    const cAvg = cCount ? cSum / cCount : 0;
    const finalScore = tAvg * 0.6 + cAvg * 0.4;
    const scoreFormatted = finalScore.toFixed(1);
    const isHigh = finalScore >= 8.0;

    const dateFormatted = review.date ? new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const avatarHtml = review.avatarUrl 
        ? `<img src="${review.avatarUrl}" alt="${review.username}" class="w-14 h-14 rounded-full object-cover shadow-md border-2 border-zinc-200 dark:border-zinc-800 shrink-0">`
        : `<div class="w-14 h-14 bg-red-800 text-white font-black font-serif rounded-full flex items-center justify-center text-2xl shrink-0 uppercase shadow-inner">${(review.username || '?').charAt(0)}</div>`;

    // Tracks ratings list
    let tracksHtml = '';
    const realTracks = album ? album.tracks.filter(t => !t.isSection) : [];
    if (realTracks.length > 0) {
        realTracks.forEach(t => {
            const val = review.trackRatings && review.trackRatings[t.title] !== undefined ? review.trackRatings[t.title] : '-';
            const isNum = typeof val === 'number';
            tracksHtml += `
                <div class="flex justify-between items-center py-2 px-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 text-sm hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors">
                    <span class="text-zinc-700 dark:text-zinc-300 font-medium truncate mr-3"><span class="text-zinc-400 font-mono text-xs mr-1.5">${t.number}.</span> ${t.title}</span>
                    <span class="font-bold font-serif text-sm ${isNum && val >= 8 ? 'text-red-600 dark:text-red-500' : 'text-zinc-900 dark:text-zinc-100'} bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-lg min-w-[32px] text-center">${val}</span>
                </div>
            `;
        });
    } else if (review.trackRatings) {
        Object.entries(review.trackRatings).forEach(([trackTitle, val], i) => {
            const isNum = typeof val === 'number';
            tracksHtml += `
                <div class="flex justify-between items-center py-2 px-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 text-sm hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors">
                    <span class="text-zinc-700 dark:text-zinc-300 font-medium truncate mr-3"><span class="text-zinc-400 font-mono text-xs mr-1.5">${i + 1}.</span> ${trackTitle}</span>
                    <span class="font-bold font-serif text-sm ${isNum && val >= 8 ? 'text-red-600 dark:text-red-500' : 'text-zinc-900 dark:text-zinc-100'} bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-lg min-w-[32px] text-center">${val}</span>
                </div>
            `;
        });
    }

    // Criteria ratings list
    let critHtml = '';
    const criteriaList = album ? album.criteria : [];
    if (criteriaList.length > 0) {
        criteriaList.forEach(c => {
            const val = review.criteriaRatings && review.criteriaRatings[c.title] !== undefined ? review.criteriaRatings[c.title] : '-';
            const isNum = typeof val === 'number';
            critHtml += `
                <div class="flex justify-between items-center py-2 px-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 text-sm hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors">
                    <span class="text-zinc-700 dark:text-zinc-300 font-medium truncate mr-3">${c.title}</span>
                    <span class="font-bold font-serif text-sm ${isNum && val >= 8 ? 'text-red-600 dark:text-red-500' : 'text-zinc-900 dark:text-zinc-100'} bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-lg min-w-[32px] text-center">${val}</span>
                </div>
            `;
        });
    } else if (review.criteriaRatings) {
        Object.entries(review.criteriaRatings).forEach(([critTitle, val]) => {
            const isNum = typeof val === 'number';
            critHtml += `
                <div class="flex justify-between items-center py-2 px-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 text-sm hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 rounded-lg transition-colors">
                    <span class="text-zinc-700 dark:text-zinc-300 font-medium truncate mr-3">${critTitle}</span>
                    <span class="font-bold font-serif text-sm ${isNum && val >= 8 ? 'text-red-600 dark:text-red-500' : 'text-zinc-900 dark:text-zinc-100'} bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-lg min-w-[32px] text-center">${val}</span>
                </div>
            `;
        });
    }

    modal.innerHTML = `
        <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up relative">
            <button id="modal-close" class="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <!-- User Header & Score Circle -->
            <div class="flex items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 pr-8">
                <div class="flex items-center gap-3.5 min-w-0">
                    <a href="#/users/${encodeURIComponent(review.username)}" class="group block shrink-0">
                        ${avatarHtml}
                    </a>
                    <div class="min-w-0">
                        <a href="#/users/${encodeURIComponent(review.username)}" class="font-bold text-base sm:text-lg text-zinc-900 dark:text-white hover:underline transition-colors block tracking-wide truncate" style="${review.nicknameColor ? `color: ${review.nicknameColor}` : ''}">
                            ${escapeHTML(review.username)}
                        </a>
                        <p class="text-zinc-400 text-xs font-medium">${dateFormatted}</p>
                        <span class="inline-block text-red-600 dark:text-red-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Гражданин USS</span>
                    </div>
                </div>

                <div class="flex flex-col items-center shrink-0">
                    <div class="w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg ${isHigh ? 'border-red-600 text-red-600' : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}">
                        ${scoreFormatted}
                    </div>
                    <span class="text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-1">Оценка</span>
                </div>
            </div>

            <!-- Review Text if exists -->
            ${review.text ? `
                <div class="mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800">
                    <p class="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Текст рецензии</p>
                    <p class="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed italic">"${escapeHTML(review.text)}"</p>
                </div>
            ` : ''}

            <!-- Summary Calculations -->
            <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-center">
                    <div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Ср. треки (60%)</div>
                    <div class="text-xl font-black font-serif text-zinc-900 dark:text-white">${tAvg.toFixed(1)}</div>
                </div>
                <div class="bg-zinc-50 dark:bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-center">
                    <div class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Ср. критерии (40%)</div>
                    <div class="text-xl font-black font-serif text-zinc-900 dark:text-white">${cAvg.toFixed(1)}</div>
                </div>
            </div>

            <!-- Track Breakdown -->
            <div class="mb-6">
                <h4 class="font-bold text-xs uppercase text-zinc-400 tracking-wider mb-2.5">Оценки треков</h4>
                <div class="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 max-h-56 overflow-y-auto">
                    ${tracksHtml || '<p class="text-zinc-400 text-xs p-2">Нет оценок треков</p>'}
                </div>
            </div>

            <!-- Criteria Breakdown -->
            <div class="mb-6">
                <h4 class="font-bold text-xs uppercase text-zinc-400 tracking-wider mb-2.5">Оценки критериев</h4>
                <div class="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                    ${critHtml || '<p class="text-zinc-400 text-xs p-2">Нет оценок критериев</p>'}
                </div>
            </div>

            <button id="modal-bottom-close" class="w-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors">
                Закрыть
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.classList.add("opacity-0");
        setTimeout(() => modal.remove(), 250);
    };

    modal.querySelector("#modal-close").addEventListener("click", closeModal);
    modal.querySelector("#modal-bottom-close").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

export async function renderUssPhase3() {
    const app = document.getElementById("app");
    document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

    const user = getCurrentUser();
    if (!user) {
        window.location.hash = "#/uss-civil-war";
        return;
    }

    app.innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;

    const statsRes = await callApi({ action: 'getUssGlobalStats', username: user.username });
    const userRes = await callApi({ action: 'getUssData', username: user.username });

    const stats = statsRes.success ? statsRes : { stateVotes: {}, totalVotes: 0, reviews: [] };
    const userData = userRes.success && userRes.data ? userRes.data : null;

    if (!userData || !userData.phase2_completed) {
        app.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 py-12 text-center">
                <h2 class="text-3xl font-serif font-black uppercase text-zinc-900 dark:text-white mb-4">Доступ запрещен</h2>
                <p class="text-zinc-500 mb-8">Вы еще не завершили Фазу 2. Проголосуйте, чтобы получить доступ к итогам.</p>
                <a href="#/uss-civil-war" class="bg-red-600 text-white font-bold uppercase px-6 py-3 rounded-full hover:bg-red-700">Назад</a>
            </div>
        `;
        return;
    }

    const album = reviews.find(r => r.id === 'sicka-united-states-of-sicka');
    const hasCompletedPhase3 = !!(userData && userData.uss_review);

    app.innerHTML = `
        <div id="uss-wrapper" class="max-w-5xl mx-auto px-4 py-8 animate-slide-up pb-32">
            <div class="mb-12 border-b-2 border-red-800 pb-6 flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-4">
                    <a href="#/uss-civil-war" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white p-3 rounded-full transition-colors shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </a>
                    <div>
                        <h1 class="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tighter text-zinc-900 dark:text-white mb-1">ФАЗА 3: Итоги</h1>
                        <p class="text-red-800 dark:text-red-600 font-bold tracking-widest uppercase text-[10px] sm:text-xs">United States of SiCka (USS)</p>
                    </div>
                </div>
                ${hasCompletedPhase3 ? `
                    <a href="#/uss-civil-war/phase4" class="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2">
                        <span>Фаза 4: Финал</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                ` : `
                    <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-4 py-3 rounded-full">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <span>Фаза 4 заблокирована</span>
                    </div>
                `}
            </div>

            <!-- Итоги голосования -->
            <section class="mb-16 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white mb-6">Прогресс голосования штатов</h2>
                <div class="space-y-4" id="states-bars"></div>
            </section>
            
            <!-- Рецензия альбома -->
            <section class="mb-16">
                <h2 class="text-2xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white mb-6">Официальная рецензия</h2>
                <div class="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-8">
                    <img src="${album.cover}" class="w-full md:w-64 h-64 object-cover rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800" />
                    <div>
                        <h3 class="text-3xl font-black font-serif uppercase text-zinc-900 dark:text-white mb-2">${album.title}</h3>
                        <p class="text-zinc-500 uppercase tracking-widest text-sm font-bold mb-4">Исполнитель: SiCka</p>
                        <p class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 italic line-clamp-4">"${album.text.split('\n')[0]}"</p>
                        <a href="#/reviews/${album.id}" class="inline-flex bg-red-600 text-white font-bold uppercase text-xs px-6 py-3 rounded-full hover:bg-red-700 transition-colors">Читать полную рецензию</a>
                    </div>
                </div>
            </section>

            <!-- Дроп мерча -->
            <section class="mb-16 bg-zinc-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div class="absolute inset-0 opacity-10 bg-[url('https://i.postimg.cc/yddB6XY8/file-0000000083a47246a1087a141da0ebe2.png')] bg-cover bg-center mix-blend-overlay"></div>
                <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-black font-serif uppercase tracking-widest mb-2 text-red-500">Эксклюзивный Дроп</h2>
                        <p class="text-xl font-bold mb-2">United States Of SiCka: Deluxe CD</p>
                        <p class="text-zinc-400 text-sm mb-4">Лимитированное издание альбома, доступное только для граждан USS.</p>
                        <div class="text-2xl font-black text-red-500 mb-6">60 HueCoins</div>
                        <button id="buy-drop" class="bg-red-600 text-white font-bold uppercase text-sm px-8 py-4 rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-lg">Купить сейчас</button>
                    </div>
                    <img src="${album.cover}" class="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] border-4 border-red-900 animate-[spin_10s_linear_infinite]" />
                </div>
            </section>

            <!-- Ваша рецензия -->
            <section class="mb-16 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Ваша рецензия</h2>
                <p class="text-zinc-500 text-sm font-medium mb-6">Оцените альбом и напишите короткое ревью (1-3 предложения), которое увидят другие граждане.</p>
                
                ${userData.uss_review ? `
                    <div class="bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-400 p-4 rounded-xl font-medium flex items-center gap-3">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Вы уже оставили рецензию. Спасибо!
                    </div>
                ` : `
                    <div id="review-form" class="space-y-8">
                        <div>
                            <h3 class="font-bold text-sm uppercase text-zinc-800 dark:text-zinc-200 mb-4 tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">Оценка треков (1-10)</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="track-ratings"></div>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm uppercase text-zinc-800 dark:text-zinc-200 mb-4 tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">Оценка критериев (1-10)</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="criteria-ratings"></div>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm uppercase text-zinc-800 dark:text-zinc-200 mb-4 tracking-wider">Предварительный балл</h3>
                            <div class="w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-red-600 text-red-600" id="preview-score">0.0</div>
                        </div>
                        <div>
                            <h3 class="font-bold text-sm uppercase text-zinc-800 dark:text-zinc-200 mb-2 tracking-wider">Краткое ревью (1-3 предложения)</h3>
                            <textarea id="review-text" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none h-24" placeholder="Ваши мысли об альбоме..."></textarea>
                        </div>
                        <button id="submit-review" class="w-full bg-red-600 text-white font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-xl hover:bg-red-700 transition-colors">Опубликовать рецензию</button>
                    </div>
                `}
            </section>
            
            <!-- Рецензии граждан -->
            <section class="mb-16">
                <h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-900 dark:text-white mb-6">Рецензии граждан USS</h2>
                <div id="citizen-reviews" class="space-y-4"></div>
            </section>

            <!-- Переход в Фазу 4 -->
            ${hasCompletedPhase3 ? `
                <section class="bg-gradient-to-r from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 text-center text-white shadow-xl">
                    <p class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs mb-2">ФИНАЛЬНЫЙ ЭТАП СОБЫТИЯ</p>
                    <h3 class="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight mb-4">ФАЗА 4: ФИНАЛ И ТИТРЫ</h3>
                    <p class="text-zinc-400 text-sm max-w-xl mx-auto mb-6 leading-relaxed">Посмотрите персональные итоги вашего участия в гражданской войне USS, титры и благодарность.</p>
                    <a href="#/uss-civil-war/phase4" class="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all">
                        <span>Перейти к Фазе 4</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </section>
            ` : `
                <section class="bg-gradient-to-r from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 text-center text-white shadow-xl">
                    <p class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs mb-2">ФИНАЛЬНЫЙ ЭТАП СОБЫТИЯ</p>
                    <h3 class="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight mb-4">ФАЗА 4: ФИНАЛ И ТИТРЫ</h3>
                    <p class="text-zinc-400 text-sm max-w-xl mx-auto mb-6 leading-relaxed">Опубликуйте вашу рецензию на альбом выше, чтобы получить доступ к финальной фазе.</p>
                    <button class="inline-flex items-center gap-3 bg-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full cursor-not-allowed opacity-50" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-zinc-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <span>Доступ заблокирован</span>
                    </button>
                </section>
            `}
        </div>
    `;

    // Render bars
    const statesBars = document.getElementById("states-bars");
    const statesData = [
        { id: "divas-born", name: "Diva's Born", color: "bg-[#7a6458]" },
        { id: "7-1", name: "7/1", color: "bg-[#7a6458]" },
        { id: "sicka-gcd", name: "SiCka=gcd(x, ate)", color: "bg-[#7a6458]" },
        { id: "freaking-news", name: "Freaking News", color: "bg-[#1a1a1a]" },
        { id: "they-bow", name: "They Bow", color: "bg-[#d2c8bc]" },
        { id: "white-house-hoe", name: "White House Hoe", color: "bg-[#1a1a1a]" },
        { id: "mrs-president", name: "Mrs. President", color: "bg-[#d2c8bc]" },
        { id: "national-baddie", name: "National Baddie", color: "bg-[#1a1a1a]" },
        { id: "the-choir", name: "The Choir", color: "bg-[#6b6b6b]" },
        { id: "unknown", name: "??????", color: "bg-[#6b6b6b]" },
        { id: "wma", name: "WMA", color: "bg-[#d2c8bc]" }
    ];

    let barsHtml = '';
    statesData.forEach(s => {
        const count = stats.stateVotes[s.id] || 0;
        const percent = stats.totalVotes > 0 ? Math.round((count / stats.totalVotes) * 100) : 0;
        barsHtml += `
            <div class="relative">
                <div class="flex justify-between text-xs font-bold uppercase tracking-widest mb-1 text-zinc-700 dark:text-zinc-300">
                    <span>${s.name}</span>
                    <span>${percent}% (${count})</span>
                </div>
                <div class="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full ${s.color} transition-all duration-1000" style="width: ${percent}%"></div>
                </div>
            </div>
        `;
    });
    statesBars.innerHTML = barsHtml;

    // Drop buy button
    const buyDrop = document.getElementById("buy-drop");
    if (buyDrop) {
        buyDrop.addEventListener('click', () => {
            customConfirm("Вы уверены, что хотите купить 'United States Of SiCka: Deluxe CD' за 60 HueCoins?", () => {
                const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                buyDrop.textContent = "Покупка...";
                buyDrop.disabled = true;
                callApi({
                    action: 'buyItem',
                    username: currentUser.username,
                    token: currentUser.token,
                    price: 60,
                    reviewId: 'sicka-united-states-of-sicka',
                    points: 24,
                    type: 'drop_item'
                }).then(res => {
                    buyDrop.textContent = "Купить сейчас";
                    buyDrop.disabled = false;
                    if (res.success) {
                        customAlert("Вы успешно купили диск! Спасибо за поддержку.");
                    } else {
                        customAlert(res.error || "Ошибка оплаты");
                    }
                });
            });
        });
    }

    // Render forms
    if (!userData.uss_review) {
        const trackRatingsEl = document.getElementById("track-ratings");
        const criteriaRatingsEl = document.getElementById("criteria-ratings");
        const previewScoreEl = document.getElementById("preview-score");
        
        let tracksHtml = '';
        const realTracks = album.tracks.filter(t => !t.isSection);
        realTracks.forEach(t => {
            tracksHtml += `
                <div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate mr-2" title="${t.title}">${t.number}. ${t.title}</span>
                    <div class="rating-edit-view flex items-center gap-2">
                        <button data-action="minus" data-name="${t.title}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">-</button>
                        <span class="rate-val-display w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none track-input" data-name="${t.title}">10</span>
                        <button data-action="plus" data-name="${t.title}" class="rate-btn opacity-30 pointer-events-none w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">+</button>
                    </div>
                </div>
            `;
        });
        trackRatingsEl.innerHTML = tracksHtml;

        let critHtml = '';
        album.criteria.forEach(c => {
            critHtml += `
                <div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate mr-2">${c.title}</span>
                    <div class="rating-edit-view flex items-center gap-2">
                        <button data-action="minus" data-name="${c.title}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">-</button>
                        <span class="rate-val-display w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none crit-input" data-name="${c.title}">10</span>
                        <button data-action="plus" data-name="${c.title}" class="rate-btn opacity-30 pointer-events-none w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">+</button>
                    </div>
                </div>
            `;
        });
        criteriaRatingsEl.innerHTML = critHtml;

        const updateScore = () => {
            const tInputs = document.querySelectorAll('.track-input');
            const cInputs = document.querySelectorAll('.crit-input');
            let tSum = 0, tCount = 0;
            tInputs.forEach(inp => {
                let val = parseInt(inp.textContent);
                if (!isNaN(val)) { tSum += val; tCount++; }
            });
            let cSum = 0, cCount = 0;
            cInputs.forEach(inp => {
                let val = parseInt(inp.textContent);
                if (!isNaN(val)) { cSum += val; cCount++; }
            });
            
            const tAvg = tCount ? tSum / tCount : 0;
            const cAvg = cCount ? cSum / cCount : 0;
            const score = tAvg * 0.6 + cAvg * 0.4;
            previewScoreEl.textContent = `${score.toFixed(1)}`;
            if (score >= 8.0) {
                previewScoreEl.className = "w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-red-600 text-red-600";
            } else {
                previewScoreEl.className = "w-16 h-16 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center font-bold text-2xl border-4 shadow-lg border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400";
            }
        };

        app.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const valDisplay = e.currentTarget.parentElement.querySelector('.rate-val-display');
                let currentVal = valDisplay.textContent === "-" ? null : parseInt(valDisplay.textContent);
                
                if (action === "minus") {
                    if (currentVal === null) return;
                    currentVal -= 1;
                    if (currentVal < 0) currentVal = null;
                } else if (action === "plus") {
                    if (currentVal === null) currentVal = 0;
                    else currentVal += 1;
                    if (currentVal > 10) currentVal = 10;
                }
                
                valDisplay.textContent = currentVal !== null ? currentVal : "-";
                
                const minusBtn = e.currentTarget.parentElement.querySelector('[data-action="minus"]');
                const plusBtn = e.currentTarget.parentElement.querySelector('[data-action="plus"]');
                
                if (currentVal === null) minusBtn.classList.add("opacity-30", "pointer-events-none");
                else minusBtn.classList.remove("opacity-30", "pointer-events-none");
                
                if (currentVal !== null && currentVal >= 10) plusBtn.classList.add("opacity-30", "pointer-events-none");
                else plusBtn.classList.remove("opacity-30", "pointer-events-none");
                
                updateScore();
            });
        });
        updateScore();

        const submitBtn = document.getElementById("submit-review");
        submitBtn.addEventListener('click', () => {
            const text = document.getElementById("review-text").value.trim();
            if (text.length < 10) {
                customAlert("Напишите хотя бы одно предложение!");
                return;
            }
            const trackRatings = {};
            document.querySelectorAll('.track-input').forEach(inp => {
                let v = parseInt(inp.textContent);
                if (!isNaN(v)) trackRatings[inp.dataset.name] = v;
            });
            const criteriaRatings = {};
            document.querySelectorAll('.crit-input').forEach(inp => {
                let v = parseInt(inp.textContent);
                if (!isNaN(v)) criteriaRatings[inp.dataset.name] = v;
            });

            submitBtn.textContent = "Публикация...";
            submitBtn.disabled = true;

            const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
            callApi({
                action: 'saveUssReview',
                username: currentUser.username,
                token: currentUser.token,
                trackRatings,
                criteriaRatings,
                text
            }).then(res => {
                if (res.success) {
                    window.location.reload();
                } else {
                    customAlert(res.error || "Ошибка");
                    submitBtn.textContent = "Опубликовать рецензию";
                    submitBtn.disabled = false;
                }
            });
        });
    }

    // Render citizens reviews
    const citEl = document.getElementById("citizen-reviews");
    if (stats.reviews.length > 0) {
        let revHtml = '';
        // Sort by date descending
        stats.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        stats.reviews.forEach((r, idx) => {
            const hasLiked = (r.likedBy || []).some(u => (u || '').toLowerCase() === (user.username || '').toLowerCase());
            const date = r.date ? new Date(r.date).toLocaleDateString('ru-RU') : '';
            
            // Calc score
            let tSum = 0, cSum = 0, tCount = 0, cCount = 0;
            if (r.trackRatings) {
                Object.values(r.trackRatings).forEach(v => {
                    if (typeof v === 'number' && !isNaN(v)) { tSum += v; tCount++; }
                });
            }
            if (r.criteriaRatings) {
                Object.values(r.criteriaRatings).forEach(v => {
                    if (typeof v === 'number' && !isNaN(v)) { cSum += v; cCount++; }
                });
            }
            const tAvg = tCount ? tSum / tCount : 0;
            const cAvg = cCount ? cSum / cCount : 0;
            const score = tAvg * 0.6 + cAvg * 0.4;
            const scoreFormatted = score.toFixed(1);
            const isHigh = score >= 8.0;
            
            const avatarHtml = r.avatarUrl 
                ? `<img src="${r.avatarUrl}" alt="${r.username}" class="w-12 h-12 rounded-full object-cover shadow-inner border-2 border-zinc-200 dark:border-zinc-800 group-hover:scale-105 transition-transform" />`
                : `<div class="w-12 h-12 bg-red-800 text-white font-black font-serif rounded-full flex items-center justify-center text-xl shrink-0 uppercase shadow-inner group-hover:scale-105 transition-transform">${(r.username || '?').charAt(0)}</div>`;

            revHtml += `
                <div class="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-start relative">
                    <a href="#/users/${encodeURIComponent(r.username)}" class="group shrink-0">
                        ${avatarHtml}
                    </a>
                    <div class="flex-grow min-w-0">
                        <div class="flex justify-between items-start mb-2 gap-3">
                            <div class="min-w-0">
                                <a href="#/users/${encodeURIComponent(r.username)}" class="font-bold text-zinc-900 dark:text-white tracking-wide text-sm hover:underline block truncate" style="${r.nicknameColor ? `color: ${r.nicknameColor}` : ''}">
                                    ${escapeHTML(r.username)}
                                </a>
                                <p class="text-zinc-400 text-xs">${date}</p>
                            </div>
                            <button data-review-idx="${idx}" class="view-score-btn w-12 h-12 bg-white dark:bg-zinc-950 rounded-full flex items-center justify-center font-bold text-base border-2 ${isHigh ? 'border-red-600 text-red-600' : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'} shadow-sm flex-shrink-0 cursor-pointer hover:scale-110 active:scale-95 transition-all" title="Нажмите, чтобы посмотреть подробную оценку">
                                ${scoreFormatted}
                            </button>
                        </div>
                        <p class="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-4 italic">"${escapeHTML(r.text)}"</p>
                        <button data-target="${escapeHTML(r.rawUsername || r.username)}" class="like-btn flex items-center gap-2 ${hasLiked ? 'text-red-600' : 'text-zinc-400 hover:text-red-500'} transition-colors font-bold text-xs uppercase">
                            <svg class="w-5 h-5 ${hasLiked ? 'fill-current' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            <span class="like-count">${r.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;
        });
        citEl.innerHTML = revHtml;

        citEl.querySelectorAll('.view-score-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.reviewIdx);
                if (!isNaN(idx) && stats.reviews[idx]) {
                    showScoreDetailsModal(stats.reviews[idx], album);
                }
            });
        });
        
        citEl.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                callApi({
                    action: 'likeUssReview',
                    username: currentUser.username,
                    token: currentUser.token,
                    targetUsername: target
                }).then(res => {
                    if (res.success) {
                        btn.querySelector('.like-count').textContent = res.likes;
                        if (res.liked) {
                            btn.classList.add('text-red-600');
                            btn.classList.remove('text-zinc-400');
                            btn.querySelector('svg').classList.add('fill-current');
                        } else {
                            btn.classList.remove('text-red-600');
                            btn.classList.add('text-zinc-400');
                            btn.querySelector('svg').classList.remove('fill-current');
                        }
                    }
                });
            });
        });

    } else {
        citEl.innerHTML = `<p class="text-zinc-500 text-sm">Пока нет рецензий. Будьте первыми!</p>`;
    }
}
