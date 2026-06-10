import { reviews, getArtist, getScore } from './data.js';

let appContainer = null;
const STATE_KEY = 'huefork_madness_state_v4';

function getState() {
    try {
        const d = localStorage.getItem(STATE_KEY);
        if (d) return JSON.parse(d);
    } catch {}
    return null;
}

function saveState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function initializeState() {
    const singles = reviews.filter(r => {
        const a = getArtist(r.artistId);
        return r.isSingle && !r.isUpcoming && (!a || !a.isGlobal);
    });
    const albums = reviews.filter(r => {
        const a = getArtist(r.artistId);
        return !r.isSingle && !r.isUpcoming && (!a || !a.isGlobal);
    });
    
    singles.sort((a, b) => getScore(b) - getScore(a));
    albums.sort((a, b) => getScore(b) - getScore(a));
    
    const topSingles = singles.slice(0, 16);
    const topAlbums = albums.slice(0, 8);
    
    topSingles.sort(() => 0.5 - Math.random());
    topAlbums.sort(() => 0.5 - Math.random());

    const state = {
        singles: topSingles.map(r => r.id),
        albums: topAlbums.map(r => r.id),
        results: {
            singles: { "1/8": [], "1/4": [], "1/2": [], "final": [] },
            albums: { "1/4": [], "1/2": [], "final": [] }
        },
        mode: 'bracket',
        currentRound: '1/8',
        finished: false,
        started: false
    };
    saveState(state);
    return state;
}

function getMatchParticipants(state, type, round) {
    let sourceList = [];
    if (type === 'singles') {
        if (round === '1/8') sourceList = state.singles;
        if (round === '1/4') sourceList = state.results.singles['1/8'];
        if (round === '1/2') sourceList = state.results.singles['1/4'];
        if (round === 'final') sourceList = state.results.singles['1/2'];
    } else {
        if (round === '1/4') sourceList = state.albums;
        if (round === '1/2') sourceList = state.results.albums['1/4'];
        if (round === 'final') sourceList = state.results.albums['1/2'];
    }
    return sourceList;
}

function loadHtml2Canvas() {
    return new Promise((resolve) => {
        if (window.html2canvas) return resolve(window.html2canvas);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve(window.html2canvas);
        document.head.appendChild(script);
    });
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}

async function shareTarget(type, event) {
    const state = getState();
    let btnBtn = null;
    if (event && event.currentTarget) {
        btnBtn = event.currentTarget;
    } else {
        const btnId = type === 'winners' ? 'share-winners-btn' : 'share-bracket-btn';
        btnBtn = document.getElementById(btnId);
    }
    const btn = btnBtn;
    if (!btn) return;
    const ogText = btn.innerHTML;
    btn.innerHTML = '<span class="animate-pulse">Генерация...</span>';
    btn.disabled = true;

    try {
        const html2canvas = await loadHtml2Canvas();
        let canvases = [];
        let shareText = '';

        if (type === 'winners') {
            const singleWinnerId = state.results.singles['final'][0];
            const albumWinnerId = state.results.albums['final'][0];
            const sRev = reviews.find(r => r.id === singleWinnerId);
            const aRev = reviews.find(r => r.id === albumWinnerId);
            const sArt = getArtist(sRev.artistId);
            const aArt = getArtist(aRev.artistId);

            shareText = `Мой победитель в синглах в HueFork Madness: ${sArt ? sArt.name : 'Unknown'} — ${sRev.title}; а в альбомах: ${aArt ? aArt.name : 'Unknown'} — ${aRev.title}.\nПоучаствуй тоже в ивенте HueFork Madness: @HueForkBot`;

            const container = document.createElement('div');
            container.className = 'w-[600px] p-8 bg-zinc-950 text-white font-sans flex flex-col gap-6';
            container.innerHTML = `
                <div class="text-center mb-4">
                    <h1 class="text-3xl font-black font-serif text-white uppercase tracking-tighter">HueFork Madness</h1>
                    <p class="text-red-500 font-bold uppercase tracking-widest text-sm mt-1">Мои Победители</p>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="bg-zinc-900 rounded-xl p-4 flex items-center gap-4 border border-zinc-800">
                        <img src="${sRev.cover}" class="w-24 h-24 rounded-lg object-cover shadow-lg" crossorigin="anonymous" />
                        <div>
                            <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Синглы</span>
                            <h2 class="text-xl text-white font-bold font-serif leading-tight">${sRev.title}</h2>
                            <p class="text-zinc-400 font-bold">${sArt ? sArt.name : ''}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="bg-zinc-900 rounded-xl p-4 flex items-center gap-4 border border-zinc-800">
                        <img src="${aRev.cover}" class="w-24 h-24 rounded-lg object-cover shadow-lg" crossorigin="anonymous" />
                        <div>
                            <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Альбомы</span>
                            <h2 class="text-xl text-white font-bold font-serif leading-tight">${aRev.title}</h2>
                            <p class="text-zinc-400 font-bold">${aArt ? aArt.name : ''}</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '-9999px';

            const imgs = container.querySelectorAll('img');
            await Promise.all(Array.from(imgs).map(img => new Promise(res => { img.onload = res; img.onerror = res; })));
            await new Promise(r => setTimeout(r, 100)); // wait for redraw

            const canvas = await html2canvas(container, { useCORS: true, backgroundColor: '#09090b', scale: 2 });
            canvases.push(canvas);
            document.body.removeChild(container);
        } else {
            shareText = 'Посмотри на мою сетку, которую я сделал в HueFork Madness!\nПоучаствуй тоже в ивенте HueFork Madness: @HueForkBot';
            
            const sb = document.getElementById('singles-bracket');
            const ab = document.getElementById('albums-bracket');
            sb.classList.remove('overflow-x-auto');
            ab.classList.remove('overflow-x-auto');

            const bgCol = document.documentElement.classList.contains('dark') ? '#09090b' : '#ffffff';
            
            const textCol = document.documentElement.classList.contains('dark') ? 'text-white' : 'text-black';
            
            const createWrapper = (elS, elA) => {
                const w = document.createElement('div');
                const width = Math.max(elS.scrollWidth, elA.scrollWidth, 800) + 64;
                w.className = `p-8 flex flex-col items-center`;
                w.style.width = width + 'px';
                w.style.backgroundColor = bgCol;
                
                w.innerHTML = `
                    <div class="text-center mb-12">
                        <h1 class="text-4xl font-black font-serif ${textCol} uppercase tracking-tighter">HueFork Madness</h1>
                        <p class="text-[#0088cc] font-bold uppercase tracking-widest text-sm mt-1">Моя турнирная сетка</p>
                    </div>
                `;
                
                const cont = document.createElement('div');
                cont.className = 'flex flex-col gap-12 w-full';
                cont.appendChild(elS.cloneNode(true));
                cont.appendChild(elA.cloneNode(true));
                w.appendChild(cont);

                const footer = document.createElement('div');
                footer.className = "mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center w-full";
                footer.innerHTML = `<span class="text-zinc-500 font-bold uppercase tracking-widest text-sm">Поучаствуй тоже: @HueForkBot</span>`;
                w.appendChild(footer);

                document.body.appendChild(w);
                w.style.position = 'fixed';
                w.style.top = '0';
                w.style.left = '-9999px';
                return w;
            };

            const wBoth = createWrapper(sb, ab);
            
            const cBoth = await html2canvas(wBoth, { useCORS: true, backgroundColor: bgCol, scale: 2 });
            canvases.push(cBoth);

            document.body.removeChild(wBoth);

            sb.classList.add('overflow-x-auto');
            ab.classList.add('overflow-x-auto');
        }

        const files = canvases.map((c, i) => new File([dataURItoBlob(c.toDataURL('image/png'))], `huefork_share_${i}.png`, { type: 'image/png' }));
        
        if (navigator.canShare && navigator.canShare({ files })) {
            await navigator.share({
                files,
                text: shareText
            });
        } else {
            const tUrl = 'https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(shareText);
            const m = document.createElement('div');
            m.className = 'fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm';
            m.innerHTML = `
                <div class="bg-white dark:bg-zinc-950 p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-scale-up border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
                    <button id="close-share" class="absolute top-4 right-4 text-zinc-500 hover:text-black dark:hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <h2 class="text-xl font-black font-serif uppercase text-center mt-2 text-black dark:text-white">Поделиться</h2>
                    <p class="text-xs text-center text-zinc-500 font-bold uppercase tracking-widest">Зажмите изображение(я), чтобы сохранить их.</p>
                    <div class="flex flex-col gap-2 relative bg-zinc-100 dark:bg-zinc-900 rounded-xl p-2 max-h-64 overflow-y-auto">
                        ${canvases.map(c => `<img src="${c.toDataURL()}" class="w-full rounded-lg shadow-sm border border-black/10 dark:border-white/10" />`).join('')}
                    </div>
                    <textarea readonly class="w-full h-24 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm font-sans resize-none focus:outline-none text-zinc-900 dark:text-zinc-100">${shareText}</textarea>
                    <a href="${tUrl}" target="_blank" class="w-full bg-[#0088cc] hover:bg-[#0077b3] text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex justify-center mt-2 active:scale-95 transition-transform text-center shadow-lg">Перейти в Telegram</a>
                </div>
            `;
            document.body.appendChild(m);
            document.getElementById('close-share').onclick = () => document.body.removeChild(m);
        }
    } catch(e) {
        console.error("Shared logic failed", e);
        alert("Произошла ошибка при генерации изображения. Попробуйте еще раз.");
    } finally {
        btn.innerHTML = ogText;
        btn.disabled = false;
    }
}

export function renderMadness() {
    appContainer = document.getElementById("app");
    let state = getState();
    if (!state) {
        state = initializeState();
    }
    
    if (state.mode === 'bracket') {
        renderBracket(state);
    } else if (state.mode === 'duel_singles') {
        renderDuel(state, 'singles', state.currentRound);
    } else if (state.mode === 'notify_albums') {
        renderNotifyAlbums(state);
    } else if (state.mode === 'duel_albums') {
        renderDuel(state, 'albums', state.currentRound);
    }
}

function resetTournament() {
    if(confirm("Вы уверены, что хотите начать заново? Ваш прогресс будет утерян.")) {
        initializeState();
        renderMadness();
    }
}

const TIMINGS = {
    '1/4': { date: new Date('2026-06-11T09:00:00Z'), label: '11 ИЮНЯ В 12:00 МСК' },
    '1/2': { date: new Date('2026-06-12T09:00:00Z'), label: '12 ИЮНЯ В 12:00 МСК' },
    'final': { date: new Date('2026-06-13T09:00:00Z'), label: '13 ИЮНЯ В 12:00 МСК' }
};

function renderBracket(state) {
    const cr = state.currentRound;
    let canPlay = !state.finished;
    let buttonText = "ИГРАТЬ " + cr + " ФИНАЛА";
    let isLocked = false;
    
    if (canPlay) {
        const t = TIMINGS[cr];
        if (t && new Date() < t.date) {
            isLocked = true;
            buttonText = "ОТКРОЕТСЯ " + t.label;
        }
    }

    const startRound = () => {
        if (state.currentRound !== '1/8') {
            const singlesParticipants = getMatchParticipants(state, 'singles', state.currentRound);
            const singlesDone = state.results.singles[state.currentRound].length >= singlesParticipants.length / 2;
            if (singlesDone) {
                state.mode = 'duel_albums';
            } else {
                state.mode = 'duel_singles';
            }
        } else {
            state.mode = 'duel_singles';
        }
        state.started = true;
        saveState(state);
        renderMadness();
    };

    const isHidden = !state.started;

    const renderCell = (id, winnerId, loserId) => {
        if (!id) return '<div class="h-10 sm:h-12 w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg opacity-50"></div>';
        
        const rev = reviews.find(r => r.id === id);
        const name = isHidden ? '???' : (rev ? rev.title : '---');
        const cover = isHidden ? 'https://i.postimg.cc/CKFt1H8R/file-00000000ef1471f6bf959e3f3217711b.png' : (rev ? rev.cover : '');
        
        const isWinner = winnerId === id;
        const isLoser = loserId === id;
        
        let classes = "h-10 sm:h-12 w-full flex items-center px-2 sm:px-3 text-[10px] sm:text-sm font-serif font-bold truncate transition-colors border rounded-lg shadow-sm";
        if (isWinner) {
            classes += " bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border-zinc-400 dark:border-zinc-500 font-black";
        } else if (isLoser) {
            classes += " bg-zinc-50 dark:bg-zinc-950/50 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 line-through opacity-50";
        } else {
            classes += " bg-white dark:bg-black text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 shadow-sm";
        }
        
        return '<div class="' + classes + '" title="' + name.replace(/"/g, '&quot;') + '">' +
               '<img src="' + cover + '" class="w-6 h-6 sm:w-8 sm:h-8 mr-2 object-cover rounded border border-zinc-200 dark:border-zinc-800 group-hover:border-black ' + (isLoser?'opacity-50':'opacity-100') + (isHidden ? ' dark:invert p-0.5' : '') + '"/>' +
               '<span class="truncate">' + name + '</span>' +
               '</div>';
    };

    const s16 = state.singles;
    const s8 = state.results.singles['1/8'];
    const s4 = state.results.singles['1/4'];
    const s2 = state.results.singles['1/2'];
    const s1 = state.results.singles['final'];

    const a8 = state.albums;
    const a4 = state.results.albums['1/4'];
    const a2 = state.results.albums['1/2'];
    const a1 = state.results.albums['final'];

    const renderMatch = (idx, items, childItems) => {
        const id1 = items[idx*2];
        const id2 = items[idx*2+1];
        const winner = childItems ? childItems[idx] : null;
        const loser = winner ? (winner === id1 ? id2 : id1) : null;
        return '<div class="flex flex-col gap-1 my-2">' +
               renderCell(id1, winner === id1 ? id1 : null, loser === id1 ? id1 : null) +
               renderCell(id2, winner === id2 ? id2 : null, loser === id2 ? id2 : null) +
               '</div>';
    };

    let html = '<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up">' +
               '<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b-2 border-zinc-100 dark:border-zinc-900 pb-4">' +
               '<div><h1 class="text-4xl sm:text-5xl font-black font-serif tracking-tighter text-black dark:text-white">HUEFORK MADNESS</h1>' +
               '<p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mt-1">Турнир-сетка релизов</p></div><div class="flex flex-wrap items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">';
    
    if (canPlay) {
        if (isLocked) {
            html += '<button disabled class="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-sm text-xs sm:text-sm whitespace-nowrap cursor-not-allowed">' + buttonText + '</button>';
        } else {
            html += '<button id="start-round-btn" class="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-1 active:scale-95 text-xs sm:text-sm whitespace-nowrap">' + buttonText + '</button>';
        }
        html += '<button id="share-bracket-header-btn" class="bg-[#0088cc] hover:bg-[#0077b3] text-white p-3 rounded-full font-bold flex items-center justify-center transform active:scale-95 transition-all w-11 h-11 flex-shrink-0 shadow-lg" title="Поделиться сеткой" aria-label="Поделиться сеткой"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg></button>';
    } else {
        html += '<button onclick="window.resetMadnessTournament()" class="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 text-xs uppercase px-4 py-2 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors rounded">Начать заново</button>';
    }
    
    html += '</div></div>';

    if (state.finished) {
        html += '<div class="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center mb-8">' +
                '<h2 class="text-2xl font-black font-serif text-black dark:text-white uppercase mb-2">Турнир завершен!</h2>' +
                '<p class="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-6">Результаты отправлены и зафиксированы.</p>' +
                '<div class="flex flex-col sm:flex-row items-center justify-center gap-4">' +
                '<button id="share-winners-btn" class="bg-[#0088cc] hover:bg-[#0077b3] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transform active:scale-95 transition-all text-sm uppercase tracking-widest">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg> ' +
                'Поделиться победителями</button>' +
                '<button id="share-bracket-btn" class="bg-[#0088cc] hover:bg-[#0077b3] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 transform active:scale-95 transition-all text-sm uppercase tracking-widest">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"></path><path d="m22 2-7 20-4-9-9-4Z"></path></svg> ' +
                'Поделиться сеткой</button>' +
                '</div></div>';
    }

    html += '<div class="space-y-12"><div id="singles-bracket" class="overflow-x-auto pb-4 bg-white dark:bg-zinc-950">' +
            '<h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-800 dark:text-zinc-200 mb-4 inline-block px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">Синглы</h2>' +
            '<div class="flex gap-4 min-w-[800px]">' +
            '<div class="flex-1 flex flex-col justify-around">' + Array(8).fill(0).map((_,i) => renderMatch(i, s16, s8)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' + Array(4).fill(0).map((_,i) => renderMatch(i, s8, s4)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' + Array(2).fill(0).map((_,i) => renderMatch(i, s4, s2)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' + Array(1).fill(0).map((_,i) => renderMatch(i, s2, s1)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' +
            (s1[0] ? '<div class="text-center"><div class="text-xs uppercase font-black text-black dark:text-white mb-2">ПОБЕДИТЕЛЬ</div>' + renderCell(s1[0], s1[0], null) + '</div>' : '<div class="opacity-20 text-center font-bold text-xs uppercase pt-8">Ждет финала</div>') +
            '</div></div></div>';

    html += '<div id="albums-bracket" class="overflow-x-auto pb-4 bg-white dark:bg-zinc-950">' +
            '<h2 class="text-xl font-black font-serif uppercase tracking-widest text-zinc-800 dark:text-zinc-200 mb-4 inline-block px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">Альбомы</h2>' +
            '<div class="flex gap-4 min-w-[600px]">' +
            '<div class="flex-1 flex flex-col justify-around">' + Array(4).fill(0).map((_,i) => renderMatch(i, a8, a4)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' + Array(2).fill(0).map((_,i) => renderMatch(i, a4, a2)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' + Array(1).fill(0).map((_,i) => renderMatch(i, a2, a1)).join('') + '</div>' +
            '<div class="flex-1 flex flex-col justify-around border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">' +
            (a1[0] ? '<div class="text-center"><div class="text-xs uppercase font-black text-black dark:text-white mb-2">ПОБЕДИТЕЛЬ</div>' + renderCell(a1[0], a1[0], null) + '</div>' : '<div class="opacity-20 text-center font-bold text-xs uppercase pt-8">Ждет финала</div>') +
            '</div></div></div></div></div>';

    appContainer.innerHTML = html;

    const btn = document.getElementById("start-round-btn");
    if (btn) btn.onclick = startRound;
    
    const shareHeaderBtn = document.getElementById("share-bracket-header-btn");
    if (shareHeaderBtn) shareHeaderBtn.onclick = (e) => shareTarget('bracket', e);
    
    if (state.finished) {
        document.getElementById("share-winners-btn").onclick = (e) => shareTarget('winners', e);
        document.getElementById("share-bracket-btn").onclick = (e) => shareTarget('bracket', e);
    }

    window.resetMadnessTournament = resetTournament;
}

function renderNotifyAlbums(state) {
    appContainer.innerHTML = '<div class="min-h-[50vh] flex flex-col items-center justify-center p-4 animate-slide-up">' +
        '<h2 class="font-serif font-black text-4xl mb-4 uppercase text-center">Отлично!</h2>' +
        '<p class="text-zinc-500 mb-8 max-w-md text-center">Вы выбрали синглы текущего этапа. Следующим этапом - выбор альбомов (' + state.currentRound + ' Финала).</p>' +
        '<button id="albums-next-btn" class="bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-black uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-transform hover:-translate-y-1 active:scale-95">ПЕРЕЙТИ К АЛЬБОМАМ</button>' +
        '</div>';

    document.getElementById("albums-next-btn").onclick = () => {
        state.mode = 'duel_albums';
        saveState(state);
        renderMadness();
    };
}

async function sendResults(state) {
    try {
        await fetch('https://formspree.io/f/xykapgrr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: "HueFork Madness Tournament",
                singles_1_8: state.results.singles['1/8'],
                singles_1_4: state.results.singles['1/4'],
                singles_1_2: state.results.singles['1/2'],
                singles_final: state.results.singles['final'],
                albums_1_4: state.results.albums['1/4'],
                albums_1_2: state.results.albums['1/2'],
                albums_final: state.results.albums['final']
            })
        });
    } catch(e) {
        console.warn("Could not submit tournament results. This may be due to network restrictions or adblockers.");
    }
}

function handleRoundComplete(state) {
    if (state.currentRound === '1/8') {
        state.mode = 'bracket';
        sendResults(state);
        state.currentRound = '1/4';
    } else {
        if (state.mode === 'duel_singles') {
            state.mode = 'notify_albums';
        } else if (state.mode === 'duel_albums') {
            state.mode = 'bracket';
            sendResults(state);
            if (state.currentRound === '1/4') state.currentRound = '1/2';
            else if (state.currentRound === '1/2') state.currentRound = 'final';
            else if (state.currentRound === 'final') {
                state.finished = true;
            }
        }
    }
    saveState(state);
    renderMadness();
}

function renderDuel(state, type, round) {
    const participants = getMatchParticipants(state, type, round);
    const resultsArr = state.results[type][round];
    
    const matchIndex = resultsArr.length;
    
    if (matchIndex * 2 >= participants.length) {
        handleRoundComplete(state);
        return;
    }

    const item1Id = participants[matchIndex * 2];
    const item2Id = participants[matchIndex * 2 + 1];

    const r1 = reviews.find(r => r.id === item1Id);
    const r2 = reviews.find(r => r.id === item2Id);

    const a1 = getArtist(r1.artistId);
    const a2 = getArtist(r2.artistId);

    const s1 = getScore(r1);
    const s2 = getScore(r2);

    const renderCard = (rev, a, s, isRight) => {
        let classes = 'flex-1 flex flex-col rounded-2xl sm:rounded-3xl p-3 sm:p-10 shadow-2xl relative transition-transform hover:-translate-y-2 group cursor-pointer ';
        classes += isRight ? 'bg-zinc-950 dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-zinc-950 text-black dark:text-white border border-zinc-200 dark:border-zinc-800';
        
        let circleClasses = 'text-sm sm:text-2xl font-bold tracking-tighter w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ';
        if (s >= 8.0) {
            circleClasses += isRight ? 'border-red-500 text-red-500 dark:border-red-600 dark:text-red-600 bg-red-500/10' : 'border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 bg-red-600/10';
        } else {
            circleClasses += isRight ? 'border-zinc-700 text-zinc-300 dark:border-zinc-300 dark:text-zinc-700 bg-white/5 dark:bg-black/5' : 'border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 bg-black/5 dark:bg-white/5';
        }

        return '<div class="' + classes + '" id="vote-btn-' + rev.id + '">' +
               '<div class="aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-6 shadow-xl border border-black/10 dark:border-white/10">' +
               '<img src="' + rev.cover + '" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/></div>' +
               '<div class="flex flex-col items-center text-center flex-grow">' +
               '<h3 class="font-serif font-black text-lg sm:text-4xl mb-1 sm:mb-2 line-clamp-2 tracking-tight">' + rev.title + '</h3>' +
               '<p class="font-bold text-[10px] sm:text-base opacity-70 mb-3 sm:mb-4 tracking-widest leading-none">' + (a ? a.name : '-') + '</p>' +
               '<div class="mt-auto"><div class="' + circleClasses + '">' + s.toFixed(1) + '</div></div></div>' +
               '<div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/10 transition-colors rounded-2xl sm:rounded-3xl z-10 pointer-events-none"></div></div>';
    };

    let html = '<div class="max-w-7xl mx-auto px-4 py-8 animate-slide-up relative min-h-[80vh] flex flex-col">' +
               '<div class="flex justify-between items-start mb-8">' +
               '<div>' +
               '<h2 class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Дуэль ' + (matchIndex + 1) + ' из ' + (participants.length / 2) + '</h2>' +
               '<h1 class="text-3xl sm:text-5xl font-black font-serif uppercase tracking-tighter text-black dark:text-white">' + (type === 'singles' ? 'СИНГЛЫ' : 'АЛЬБОМЫ') + ' • ' + round + '</h1>' +
               '</div>' +
               '<button id="pause-btn" class="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest px-4 py-2 rounded-full text-[10px] sm:text-xs transition-colors border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">' +
               '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' +
               '<span class="hidden sm:inline">Отложить</span></button>' +
               '</div>' +
               '<div class="flex flex-row gap-3 sm:gap-12 flex-grow items-stretch justify-center relative">' +
               '<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black dark:bg-white text-white dark:text-black font-black italic rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-[10px] sm:text-sm shadow-xl border-4 border-white dark:border-zinc-950">VS</div>' +
               renderCard(r1, a1, s1, false) + renderCard(r2, a2, s2, true) + 
               '</div><div class="mt-8 text-center"><p class="text-xs text-zinc-400 font-bold uppercase tracking-widest">Нажмите на карточку, чтобы проголосовать за релиз</p></div></div>';

    appContainer.innerHTML = html;

    document.getElementById('pause-btn').onclick = () => {
        state.mode = 'bracket';
        saveState(state);
        renderMadness();
    };

    document.getElementById('vote-btn-' + r1.id).onclick = () => {
        state.results[type][round].push(r1.id);
        saveState(state);
        renderDuel(state, type, round);
    };
    
    document.getElementById('vote-btn-' + r2.id).onclick = () => {
        state.results[type][round].push(r2.id);
        saveState(state);
        renderDuel(state, type, round);
    };
}
