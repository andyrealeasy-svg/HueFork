import { callApi, getCurrentUser } from "./api.js";
import { reviews } from "./data.js";

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Gunshot Web Audio synthesis
function playGunshotSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // 1. White noise burst with lowpass sweep & fast decay
        const bufferSize = Math.floor(ctx.sampleRate * 1.2);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4500, now);
        filter.frequency.exponentialRampToValueAtTime(140, now + 0.35);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(1.0, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        // 2. Low-frequency punch oscillator
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(1.0, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        // 3. Tail / Reverb resonance
        const tailOsc = ctx.createOscillator();
        tailOsc.type = 'sine';
        tailOsc.frequency.setValueAtTime(90, now);
        tailOsc.frequency.exponentialRampToValueAtTime(20, now + 0.8);

        const tailGain = ctx.createGain();
        tailGain.gain.setValueAtTime(0.4, now);
        tailGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        tailOsc.connect(tailGain);
        tailGain.connect(ctx.destination);

        noise.start(now);
        osc.start(now);
        tailOsc.start(now);

        noise.stop(now + 1.2);
        osc.stop(now + 1.2);
        tailOsc.stop(now + 1.2);
    } catch (e) {
        console.warn("Gunshot sound playback error:", e);
    }
}

// Magical chime sound for DVD letters
function playMagicChime(index) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00];
        const baseFreq = freqs[index % freqs.length] || 880;

        // Primary Sine Bell
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, now);

        // Harmonic overtone
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 2.005, now);

        // Shimmer high sine
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(baseFreq * 3.015, now);

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

        const gain3 = ctx.createGain();
        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(0.1, now + 0.015);
        gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(ctx.destination);
        gain2.connect(ctx.destination);
        gain3.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + 0.9);
        osc2.stop(now + 0.7);
        osc3.stop(now + 0.6);
    } catch (e) {
        console.warn("Magic chime sound error:", e);
    }
}

export async function renderUssPhase4() {
    const app = document.getElementById("app");
    document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

    const oldOverlay = document.getElementById("uss-phase4-root");
    if (oldOverlay) oldOverlay.remove();

    const user = getCurrentUser();
    if (!user) {
        window.location.hash = "#/uss-civil-war";
        return;
    }

    // Show a loader while fetching data
    app.innerHTML = `<div class="flex items-center justify-center min-h-[50vh]"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div></div>`;

    // Fetch user phase 4 stats
    const res = await callApi({ action: 'getUssPhase4Data', username: user.username });
    const userData = (res.success && res.userData) ? res.userData : null;

    if (!userData || !userData.phase2_completed || !userData.uss_review) {
        // Find which phase is missing
        let missingPhaseText = "";
        let missingPhaseLink = "";
        let missingPhaseBtn = "";
        if (!userData || !userData.phase2_completed) {
            missingPhaseText = "Вы еще не завершили Фазу 2. Для перехода к финалу вам необходимо распределить свои голоса на карте штатов.";
            missingPhaseLink = "#/uss-civil-war";
            missingPhaseBtn = "К карте штатов (Фаза 2)";
        } else {
            missingPhaseText = "Вы еще не завершили Фазу 3. Для перехода к финалу вам необходимо опубликовать рецензию на альбом.";
            missingPhaseLink = "#/uss-civil-war/phase3";
            missingPhaseBtn = "К Фазе 3 (Рецензия)";
        }

        app.innerHTML = `
            <div id="uss-wrapper" class="max-w-3xl mx-auto px-4 py-12 text-center animate-slide-up pb-32">
                <div class="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <h1 class="font-serif font-black text-2xl sm:text-4xl uppercase tracking-tighter text-zinc-900 dark:text-white mb-1">Доступ ограничен</h1>
                    <p class="text-red-800 dark:text-red-600 font-bold tracking-widest uppercase text-[10px] sm:text-xs">United States of SiCka (USS)</p>
                </div>
                <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-lg max-w-xl mx-auto space-y-6">
                    <div class="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <p class="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">${missingPhaseText}</p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <a href="#/uss-civil-war" class="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full transition-all">
                            На главную ивента
                        </a>
                        <a href="${missingPhaseLink}" class="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-md transition-all">
                            ${missingPhaseBtn}
                        </a>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const deluxeCount = (res.success && typeof res.deluxePurchasesCount === 'number') ? res.deluxePurchasesCount : 0;
    const album = reviews.find(r => r.id === 'sicka-united-states-of-sicka');

    // 1. Instant blackout overlay & Gunshot Sound
    const overlay = document.createElement("div");
    overlay.id = "uss-phase4-root";
    overlay.className = "fixed inset-0 bg-black z-[200] overflow-hidden text-white flex flex-col justify-center items-center select-none font-sans";
    overlay.innerHTML = `
        <div id="phase4-initial-blackout" class="absolute inset-0 bg-black flex items-center justify-center pointer-events-none transition-opacity duration-1000">
            <div id="flash-effect" class="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75"></div>
        </div>
        <div id="phase4-content" class="w-full h-full relative overflow-hidden flex flex-col items-center justify-center opacity-0 transition-opacity duration-1000"></div>
    `;

    document.body.appendChild(overlay);

    // Trigger gunshot sound & quick muzzle flash
    playGunshotSound();
    const flash = overlay.querySelector("#flash-effect");
    if (flash) {
        flash.style.opacity = "0.7";
        setTimeout(() => {
            flash.style.opacity = "0";
        }, 80);
    }

    // Wait a couple of seconds before starting credits
    setTimeout(() => {
        startCreditsSequence(overlay, userData, deluxeCount, album, user);
    }, 2200);
}

function startCreditsSequence(overlay, userData, deluxeCount, album, user) {
    const content = overlay.querySelector("#phase4-content");
    if (!content) return;

    content.style.opacity = "1";

    const dateFormatted = userData.date ? new Date(userData.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Не указана';
    const citizenName = userData.name || user.username;
    const tgUsername = userData.telegram || "Не указан";
    const ideology = userData.ideology || "Не выбрана";
    const oath = userData.oath || "Присяга не зафиксирована";
    const favReview = userData.favReview || "Не указана";
    const listens = userData.listens || "Не указано";

    // Format Phase 2 Votes
    const stateNames = {
        "divas-born": "Diva's Born",
        "7-1": "7/1",
        "sicka-gcd": "SiCka=gcd(x, ate)",
        "freaking-news": "Freaking News",
        "they-bow": "They Bow",
        "white-house-hoe": "White House Hoe",
        "mrs-president": "Mrs. President",
        "national-baddie": "National Baddie",
        "the-choir": "The Choir",
        "unknown": "??????",
        "wma": "WMA"
    };

    let votesHtml = '';
    if (userData.votes && Object.keys(userData.votes).length > 0) {
        let totalVotes = 0;
        const items = Object.entries(userData.votes).map(([sId, count]) => {
            totalVotes += count;
            const sName = stateNames[sId] || sId;
            return `<div class="flex justify-between items-center py-1.5 px-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80 mb-2 text-sm">
                <span class="text-zinc-300 font-medium">${escapeHTML(sName)}</span>
                <span class="font-bold text-red-500 font-mono">${count} ${count === 1 ? 'голос' : count < 5 ? 'голоса' : 'голосов'}</span>
            </div>`;
        }).join('');
        votesHtml = `
            <div class="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 text-center">Всего отдано голосов: ${totalVotes}</div>
            <div class="max-w-md mx-auto">${items}</div>
        `;
    } else {
        votesHtml = `<p class="text-zinc-500 italic text-center text-sm">Голоса за территории не были распределены</p>`;
    }

    // Deportation / Ransom Status
    let deportStatusHtml = '';
    if (userData.deported === true) {
        deportStatusHtml = `<p class="text-red-500 text-xs font-bold uppercase tracking-widest text-center mt-2">Статус: Депортирован за голосование чужим штатам</p>`;
    } else if (userData.ransom_paid === true) {
        deportStatusHtml = `<p class="text-emerald-500 text-xs font-bold uppercase tracking-widest text-center mt-2">Статус: Выкуплен за 50 HueCoins</p>`;
    } else {
        deportStatusHtml = `<p class="text-zinc-400 text-xs font-bold uppercase tracking-widest text-center mt-2">Статус: Полноправный гражданин</p>`;
    }

    // Format Phase 3 Review & Score
    let reviewHtml = '';
    let reviewScoreStr = '—';
    let reviewLikes = 0;
    if (userData.uss_review) {
        const rev = userData.uss_review;
        reviewLikes = rev.likes || 0;

        let tSum = 0, tCount = 0;
        if (rev.trackRatings) {
            Object.values(rev.trackRatings).forEach(v => {
                if (typeof v === 'number' && !isNaN(v)) { tSum += v; tCount++; }
            });
        }
        let cSum = 0, cCount = 0;
        if (rev.criteriaRatings) {
            Object.values(rev.criteriaRatings).forEach(v => {
                if (typeof v === 'number' && !isNaN(v)) { cSum += v; cCount++; }
            });
        }
        const tAvg = tCount ? tSum / tCount : 0;
        const cAvg = cCount ? cSum / cCount : 0;
        const finalScore = tAvg * 0.6 + cAvg * 0.4;
        reviewScoreStr = finalScore.toFixed(1);

        let tracksList = '';
        if (album && album.tracks) {
            const realTracks = album.tracks.filter(t => !t.isSection);
            tracksList = realTracks.map(t => {
                const val = rev.trackRatings && rev.trackRatings[t.title] !== undefined ? rev.trackRatings[t.title] : '-';
                return `<div class="flex justify-between py-1 border-b border-zinc-900/80 text-xs"><span class="text-zinc-400 truncate mr-2">${t.number}. ${t.title}</span><span class="font-bold text-zinc-200 font-mono">${val}</span></div>`;
            }).join('');
        }

        let critList = '';
        if (rev.criteriaRatings) {
            critList = Object.entries(rev.criteriaRatings).map(([cTitle, val]) => {
                return `<div class="flex justify-between py-1 border-b border-zinc-900/80 text-xs"><span class="text-zinc-400 truncate mr-2">${cTitle}</span><span class="font-bold text-zinc-200 font-mono">${val}</span></div>`;
            }).join('');
        }

        reviewHtml = `
            <div class="max-w-md mx-auto bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 mb-4 text-left">
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
                    <div>
                        <span class="text-xs uppercase font-bold text-zinc-500 tracking-wider">Финальный балл</span>
                        <div class="text-2xl font-black font-serif text-red-500">${reviewScoreStr} / 10.0</div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs uppercase font-bold text-zinc-500 tracking-wider">Лайков получено</span>
                        <div class="text-xl font-bold text-white flex items-center justify-end gap-1.5 mt-0.5">
                            <svg class="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            <span>${reviewLikes}</span>
                        </div>
                    </div>
                </div>

                ${rev.text ? `
                    <div class="mb-4">
                        <div class="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Рецензия:</div>
                        <p class="text-zinc-300 text-sm italic leading-relaxed">"${escapeHTML(rev.text)}"</p>
                    </div>
                ` : ''}

                <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-800/80">
                    <div>
                        <div class="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Треки (60%)</div>
                        <div class="max-h-36 overflow-y-auto pr-1 custom-scrollbar">${tracksList || '<span class="text-xs text-zinc-600">Оценок нет</span>'}</div>
                    </div>
                    <div>
                        <div class="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">Критерии (40%)</div>
                        <div class="max-h-36 overflow-y-auto pr-1 custom-scrollbar">${critList || '<span class="text-xs text-zinc-600">Оценок нет</span>'}</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        reviewHtml = `<p class="text-zinc-500 italic text-center text-sm">Рецензия на релиз не была оставлена</p>`;
    }

    content.innerHTML = `
        <!-- Scrolling Credits Container -->
        <div id="credits-scroll-wrapper" class="w-full h-full overflow-hidden relative">
            <div id="credits-track" class="absolute top-0 left-0 right-0 mx-auto w-full max-w-2xl px-6 text-center text-zinc-200 will-change-transform">
                
                <!-- Spacer to start below screen -->
                <div class="h-[100vh]"></div>

                <!-- Intro Title -->
                <div class="mb-24">
                    <p class="text-red-600 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm mb-3">UNITED STATES OF SICKA: CIVIL WAR</p>
                    <h1 class="font-serif font-black text-4xl sm:text-6xl uppercase tracking-tighter text-white mb-6">ФИНАЛ СОБЫТИЯ</h1>
                    <div class="w-24 h-1 bg-red-700 mx-auto mb-8"></div>
                    <p class="text-zinc-400 font-serif text-lg sm:text-xl max-w-xl mx-auto leading-relaxed italic">
                        «Благодарим каждого гражданина за участие, преданность и голос в этой исторической битве. Ваши действия навсегда вошли в летопись USS.»
                    </p>
                </div>

                <!-- Section: Личные данные -->
                <div class="mb-20 space-y-4">
                    <div class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs">ДОСЬЕ ГРАЖДАНИНА</div>
                    <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white uppercase tracking-wider">${escapeHTML(citizenName)}</h2>
                    <div class="text-zinc-400 text-sm font-mono">Telegram: <span class="text-white">${escapeHTML(tgUsername)}</span></div>
                    <div class="text-zinc-500 text-xs uppercase tracking-widest font-mono">Дата выдачи грин-карты: ${dateFormatted}</div>
                </div>

                <!-- Section: Идеология и присяга -->
                <div class="mb-20 space-y-4">
                    <div class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs">ИДЕОЛОГИЯ И ПРИСЯГА</div>
                    <div class="text-xl sm:text-2xl font-serif font-bold text-white">${escapeHTML(ideology)}</div>
                    <div class="max-w-lg mx-auto bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800/80">
                        <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Текст присяги на верность:</div>
                        <p class="text-zinc-300 italic text-base leading-relaxed">«${escapeHTML(oath)}»</p>
                    </div>
                </div>

                <!-- Section: Декларация -->
                <div class="mb-20 space-y-4">
                    <div class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs">ДЕКЛАРАЦИЯ О ДОХОДАХ</div>
                    <div class="text-sm text-zinc-400 font-medium">Любимая рецензия SiCka на HueFork:</div>
                    <div class="text-lg font-bold text-white uppercase font-serif tracking-wider">"${escapeHTML(favReview)}"</div>
                    <div class="text-sm text-zinc-400 font-medium mt-4">Прослушиваний лид-синглов:</div>
                    <div class="text-lg font-bold text-red-500 font-serif">${escapeHTML(listens)}</div>
                </div>

                <!-- Section: Фаза 2 Голоса -->
                <div class="mb-20 space-y-4">
                    <div class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs">ФАЗА 2: БИТВА ЗА ТЕРРИТОРИИ</div>
                    <h3 class="text-2xl font-serif font-bold text-white mb-2">Голоса за штаты</h3>
                    ${votesHtml}
                    ${deportStatusHtml}
                </div>

                <!-- Section: Фаза 3 Рецензия -->
                <div class="mb-20 space-y-4">
                    <div class="text-red-500 font-bold uppercase tracking-[0.25em] text-xs">ФАЗА 3: ОЦЕНКА АЛЬБОМА</div>
                    <h3 class="text-2xl font-serif font-bold text-white mb-2">"United States Of SiCKa"</h3>
                    ${reviewHtml}
                           <!-- Final Gratitude Message -->
                <div class="mb-16 space-y-6">
                    <div class="w-16 h-1 bg-red-700 mx-auto"></div>
                    <h2 class="text-3xl sm:text-5xl font-serif font-black uppercase text-white tracking-widest">СПАСИБО ЗА УЧАСТИЕ</h2>
                    <p class="text-zinc-500 text-sm uppercase tracking-[0.3em] font-bold">HueFork & USS Special Event • 2026</p>
                    <p class="text-zinc-600 text-xs font-mono">Гражданская война окончена. Начинается новая глава.</p>
                </div>

                <!-- Big Action Button -->
                <div class="mb-24 flex justify-center">
                    <button id="credits-final-btn" class="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs py-4 px-10 rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer">
                        <span>Запустить финал</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>

                <!-- Extra Spacer for full scroll-out -->
                <div class="h-[60vh]"></div>

            </div>
        </div>

        <!-- Controls: Speed up & Skip button -->
        <div class="absolute bottom-6 right-6 z-50 flex items-center gap-3">
            <button id="credits-speed-btn" class="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-all backdrop-blur-sm">
                Ускорить (×3)
            </button>
            <button id="credits-skip-btn" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-lg hover:scale-105">
                Пропустить к финалу &rarr;
            </button>
        </div>
    `;

    // Scrolling credits engine using requestAnimationFrame
    const track = content.querySelector("#credits-track");
    const speedBtn = content.querySelector("#credits-speed-btn");
    const skipBtn = content.querySelector("#credits-skip-btn");
    const finalBtn = content.querySelector("#credits-final-btn");

    let isFast = false;
    let isFinished = false;
    let currentY = 0;
    let baseSpeed = 1.35; // Pixels per frame
    let animId = null;

    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            isFast = !isFast;
            speedBtn.textContent = isFast ? "Обычная скорость" : "Ускорить (×3)";
            speedBtn.classList.toggle("bg-red-950", isFast);
            speedBtn.classList.toggle("text-red-400", isFast);
        });
    }

    const endCreditsAndStartDvd = () => {
        if (isFinished) return;
        isFinished = true;
        if (animId) cancelAnimationFrame(animId);

        // Fade out credits smoothly
        content.style.transition = "opacity 0.8s ease-out";
        content.style.opacity = "0";

        setTimeout(() => {
            startDvdLettersPhase(overlay);
        }, 850);
    };

    if (skipBtn) {
        skipBtn.addEventListener('click', endCreditsAndStartDvd);
    }
    if (finalBtn) {
        finalBtn.addEventListener('click', endCreditsAndStartDvd);
    }

    const scrollLoop = () => {
        if (isFinished) return;
        const speed = isFast ? baseSpeed * 3.8 : baseSpeed;
        currentY += speed;
        track.style.transform = `translate3d(0, -${currentY}px, 0)`;

        // Only end if track has rendered height and we have actually scrolled to the end
        const trackHeight = track.offsetHeight;
        if (trackHeight > window.innerHeight) {
            const maxScroll = trackHeight - window.innerHeight;
            if (currentY >= maxScroll) {
                // Pause scrolling at the bottom, wait for the user to click the final button
                currentY = maxScroll;
                track.style.transform = `translate3d(0, -${currentY}px, 0)`;
                return;
            }
        }

        animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);
}

function startDvdLettersPhase(overlay) {
    overlay.innerHTML = `
        <div class="relative w-full h-full bg-black overflow-hidden select-none">
            <!-- Canvas for DVD letters bounce -->
            <canvas id="dvd-canvas" class="absolute inset-0 w-full h-full block"></canvas>

            <!-- Exit Button (Fades in after all letters appear) -->
            <div id="dvd-exit-container" class="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 opacity-0 pointer-events-none transition-all duration-1000 flex flex-col items-center px-4 w-auto">
                <a href="#/uss-civil-war" id="dvd-exit-btn" class="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95 whitespace-nowrap">
                    <span>Покинуть страницу</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    `;

    const canvas = overlay.querySelector("#dvd-canvas");
    const exitContainer = overlay.querySelector("#dvd-exit-container");
    const exitBtn = overlay.querySelector("#dvd-exit-btn");

    if (exitBtn) {
        exitBtn.addEventListener("click", () => {
            overlay.remove();
        });
    }

    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // DVD bouncing colors palette
    const colorPalette = [
        { fill: "#ff2a5f", glow: "rgba(255, 42, 95, 0.6)" },
        { fill: "#00f0ff", glow: "rgba(0, 240, 255, 0.6)" },
        { fill: "#39ff14", glow: "rgba(57, 255, 20, 0.6)" },
        { fill: "#ffe600", glow: "rgba(255, 230, 0, 0.6)" },
        { fill: "#bd00ff", glow: "rgba(189, 0, 255, 0.6)" },
        { fill: "#ff8c00", glow: "rgba(255, 140, 0, 0.6)" },
        { fill: "#ff0055", glow: "rgba(255, 0, 85, 0.6)" },
        { fill: "#00ffcc", glow: "rgba(0, 255, 204, 0.6)" },
        { fill: "#ffffff", glow: "rgba(255, 255, 255, 0.6)" },
        { fill: "#e02424", glow: "rgba(224, 36, 36, 0.6)" },
        { fill: "#38bdf8", glow: "rgba(56, 189, 248, 0.6)" }
    ];

    // Original letters: 'b', 'a', 'd', 's', 'y', 'm', 'p', 't', 'o', 'm', 's'
    const originalLetters = ['b', 'a', 'd', 's', 'y', 'm', 'p', 't', 'o', 'm', 's'];

    // Randomize the order of letters
    const shuffledLetters = originalLetters
        .map(char => ({ char, rand: Math.random() }))
        .sort((a, b) => a.rand - b.rand)
        .map(item => item.char);

    const activeParticles = [];

    // Spawning letter function
    function spawnLetter(char, index) {
        playMagicChime(index);

        const fontSize = Math.min(Math.max(window.innerWidth * 0.05, 36), 72);
        const pWidth = fontSize * 0.9;
        const pHeight = fontSize * 0.9;

        // Random initial position inside bounds
        const x = Math.random() * Math.max(width - pWidth - 40, 20) + 20;
        const y = Math.random() * Math.max(height - pHeight - 40, 20) + 20;

        // Random velocities
        const speedX = (2.2 + Math.random() * 1.8) * (Math.random() > 0.5 ? 1 : -1);
        const speedY = (1.8 + Math.random() * 1.8) * (Math.random() > 0.5 ? 1 : -1);

        const colorIdx = index % colorPalette.length;

        activeParticles.push({
            char,
            x,
            y,
            vx: speedX,
            vy: speedY,
            width: pWidth,
            height: pHeight,
            fontSize,
            colorIdx,
            spawnTime: performance.now(),
            scale: 0.2
        });
    }

    // Clean up on hash change if user leaves
    const onHashChange = () => {
        clearInterval(spawnInterval);
        if (dvdAnimId) cancelAnimationFrame(dvdAnimId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("hashchange", onHashChange);
        if (overlay && overlay.parentNode) overlay.remove();
    };
    window.addEventListener("hashchange", onHashChange);

    // Spawn letters one by one every 0.4 seconds (400ms)
    let currentSpawnIndex = 0;
    const spawnInterval = setInterval(() => {
        if (currentSpawnIndex < shuffledLetters.length) {
            spawnLetter(shuffledLetters[currentSpawnIndex], currentSpawnIndex);
            currentSpawnIndex++;
        } else {
            clearInterval(spawnInterval);
            // All letters have spawned! Show the exit prompt smoothly
            setTimeout(() => {
                if (exitContainer) {
                    exitContainer.classList.remove("pointer-events-none", "opacity-0");
                    exitContainer.classList.add("pointer-events-auto", "opacity-100");
                }
            }, 600);
        }
    }, 400);

    // Animation Loop for DVD bouncing
    let dvdAnimId = null;

    function renderDvd() {
        // Clear canvas with faint trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, width, height);

        const now = performance.now();

        activeParticles.forEach(p => {
            // Entry scale animation
            const elapsed = now - p.spawnTime;
            if (elapsed < 300) {
                p.scale = 0.2 + (elapsed / 300) * 0.8;
            } else {
                p.scale = 1.0;
            }

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Collision with left/right
            if (p.x <= 0) {
                p.x = 0;
                p.vx = Math.abs(p.vx);
                p.colorIdx = (p.colorIdx + 1) % colorPalette.length;
            } else if (p.x + p.width >= width) {
                p.x = width - p.width;
                p.vx = -Math.abs(p.vx);
                p.colorIdx = (p.colorIdx + 1) % colorPalette.length;
            }

            // Collision with top/bottom
            if (p.y <= 0) {
                p.y = 0;
                p.vy = Math.abs(p.vy);
                p.colorIdx = (p.colorIdx + 1) % colorPalette.length;
            } else if (p.y + p.height >= height) {
                p.y = height - p.height;
                p.vy = -Math.abs(p.vy);
                p.colorIdx = (p.colorIdx + 1) % colorPalette.length;
            }

            const curColor = colorPalette[p.colorIdx];

            // Render glowing DVD letter
            ctx.save();
            ctx.font = `900 ${p.fontSize * p.scale}px "Playfair Display", Georgia, serif, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Glow shadow
            ctx.shadowColor = curColor.glow;
            ctx.shadowBlur = 24 * p.scale;
            ctx.fillStyle = curColor.fill;

            ctx.fillText(p.char, p.x + p.width / 2, p.y + p.height / 2);
            ctx.restore();
        });

        dvdAnimId = requestAnimationFrame(renderDvd);
    }

    dvdAnimId = requestAnimationFrame(renderDvd);
}
