const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const mapCode = `
const statesData = [
  { id: "divas-born", name: "Diva's Born", ideology: "Реформаторы", text: "Shit yeah, I'm diva and born\\nСвоим взглядом вызываю шторм\\nWhy has it become so warm?\\nAnd hoe, and warm, diva is born", color: "bg-[#7a6458] text-white" },
  { id: "7-1", name: "7/1", ideology: "Реформаторы", text: "Любуюсь собой, а их рожа как Лёша\\nСиськи заняли собой пляж, о Боже\\nЕсли он хочет секс, то я хочу позже\\nНе завидуй, но у меня черная кожа", color: "bg-[#7a6458] text-white" },
  { id: "sicka-gcd", name: "SiCka=gcd(x, ate)", ideology: "Реформаторы", text: "Не люблю mess, я буду Kendall\\nПукаю так, что нужна с запахом candle\\nДелаю альтернатив, они хотят dancehall\\nТы меня бесишь, um, закрой рот", color: "bg-[#7a6458] text-white" },
  { id: "freaking-news", name: "Freaking News", ideology: "Консерваторы", text: "Shit, that makes me cum\\nЯ agrowoman пержу на битах\\nХуйню не пиши bitch are you dumb\\nБыло лучше когда была masha from", color: "bg-[#1a1a1a] text-white" },
  { id: "white-house-hoe", name: "White House Hoe", ideology: "Консерваторы", text: "Дрочить свою письку не в U-S-S? Харам\\nTaking your shit тоже не в U-S-S? Харам\\nБлевать в толчок, и не в U-S-S? Харам\\nExclusive makeup, но не в U-S-S? Харам", color: "bg-[#1a1a1a] text-white" },
  { id: "national-baddie", name: "National Baddie", ideology: "Консерваторы", text: "Pussy, imma national baddie\\nFart in her face, i got her maddie\\nДаже если сру, остаюсь lady\\nСтрана долбоёбки, we need a party", color: "bg-[#1a1a1a] text-white" },
  { id: "they-bow", name: "They Bow", ideology: "Центристы", text: "They bow, так будто это церковь\\nИх секс за жизнь, как моя за день четверть\\nОстались такими же, они такие стервы\\nРади USS я пойду на жертвы (bitch)", color: "bg-[#d2c8bc] text-black" },
  { id: "mrs-president", name: "Mrs. President", ideology: "Центристы", text: "Y'all need to place your asses into bunkers, because there's something big is coming, like my ass is like a tsunami, you know, what if i will accidentally kill you? I don't want it!", color: "bg-[#d2c8bc] text-black" },
  { id: "wma", name: "WMA", ideology: "Центристы", text: "I wipe my ass back and forth\\nI wipe my ass back and forth\\nI wipe my ass back and forth\\nI wipe my ass back and forth", color: "bg-[#d2c8bc] text-black" },
  { id: "the-choir", name: "The Choir", ideology: "Политические беженцы", text: "Какие муки я буду вызывать? Ну, эти\\nЯ готова к свету жоп, ha, I'm ready\\nЯ порядочная — первый, второй, третий\\nТупорылые граждане, я сажу их на петли", color: "bg-[#6b6b6b] text-white" },
  { id: "unknown", name: "??????", ideology: "Политические беженцы", text: "N*gga's, они хотят меня трахнуть\\nN*gga's, они хотят меня лапать\\nN*gga's, они хотят меня лайкнуть\\nN*gga's, они хотят меня, как их cock", color: "bg-[#6b6b6b] text-white" }
];

function showUssMapModal(data, user) {
    if (data.deported) {
       appAlert("Вы депортированы и не можете принимать участие в голосовании. Оплатите выкуп, чтобы вернуться.");
       return;
    }

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in";
    
    let votesLeft = data.phase2_completed ? 0 : 10;
    let votesGiven = data.votes || {};
    
    const renderContent = () => {
        let gridHtml = statesData.map(s => {
            const count = votesGiven[s.id] || 0;
            return \`<button data-state="\${s.id}" class="state-btn \${s.color} p-4 rounded-2xl shadow-sm transform transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center min-h-[100px] relative overflow-hidden group border-2 border-transparent">
                <span class="font-bold text-center z-10">\${s.name}</span>
                <span class="text-[10px] uppercase tracking-widest opacity-80 z-10">\${s.ideology}</span>
                \${count > 0 ? \`<div class="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md z-10">\${count}</div>\` : ''}
            </button>\`;
        }).join('');
        
        return \`
          <div class="bg-white dark:bg-zinc-950 w-full max-w-4xl rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
             <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                <div>
                  <h2 class="font-serif font-black text-xl uppercase tracking-widest text-zinc-900 dark:text-white">Карта штатов</h2>
                  \${!data.phase2_completed ? \`<p class="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Осталось голосов: <span id="votes-left-text">\${votesLeft}</span></p>\` : \`<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Голосование завершено</p>\`}
                </div>
                <button id="close-map" class="text-zinc-400 hover:text-black dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-900 rounded-full p-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <div class="p-6 overflow-y-auto flex-grow bg-zinc-50 dark:bg-zinc-950/50">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   \${gridHtml}
                </div>
             </div>
             
             \${!data.phase2_completed ? \`
             <div class="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 flex justify-end">
                <button id="submit-votes" class="bg-red-600 text-white font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-full shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   Завершить голосование
                </button>
             </div>
             \` : ''}
          </div>
        \`;
    };
    
    modal.innerHTML = renderContent();
    document.body.appendChild(modal);
    
    function attachEvents() {
        modal.querySelector('#close-map').addEventListener('click', () => {
           modal.classList.add("opacity-0");
           setTimeout(() => modal.remove(), 300);
        });
        
        if (data.phase2_completed) return;
        
        modal.querySelectorAll('.state-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const stateId = btn.dataset.state;
                const stateInfo = statesData.find(s => s.id === stateId);
                
                const smodal = document.createElement("div");
                smodal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in";
                smodal.innerHTML = \`
                   <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transform transition-all p-8 text-center">
                       <h3 class="font-serif font-black text-2xl uppercase tracking-tighter mb-2">\${stateInfo.name}</h3>
                       <div class="inline-block px-3 py-1 rounded-full \${stateInfo.color} font-bold uppercase tracking-widest text-[10px] mb-6 shadow-sm">
                          \${stateInfo.ideology}
                       </div>
                       
                       <p class="text-zinc-700 dark:text-zinc-300 font-medium italic whitespace-pre-wrap mb-8 text-sm leading-relaxed border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 text-left">"\${stateInfo.text}"</p>
                       
                       <div class="flex gap-4">
                           <button id="cancel-state" class="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">Назад</button>
                           \${votesLeft > 0 ? \`<button id="vote-state" class="flex-1 bg-red-600 text-white font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl transition-colors hover:bg-red-700 shadow-md">Отдать голос</button>\` : \`<button disabled class="flex-1 bg-zinc-300 dark:bg-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs px-4 py-3 rounded-xl cursor-not-allowed">Нет голосов</button>\`}
                       </div>
                   </div>
                \`;
                document.body.appendChild(smodal);
                
                smodal.querySelector('#cancel-state').addEventListener('click', () => {
                    smodal.classList.add("opacity-0");
                    setTimeout(() => smodal.remove(), 300);
                });
                
                const voteBtn = smodal.querySelector('#vote-state');
                if (voteBtn) {
                    voteBtn.addEventListener('click', () => {
                        votesGiven[stateId] = (votesGiven[stateId] || 0) + 1;
                        votesLeft--;
                        smodal.remove();
                        modal.innerHTML = renderContent();
                        attachEvents();
                    });
                }
            });
        });
        
        const submitBtn = modal.querySelector('#submit-votes');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (votesLeft === 10) {
                    appAlert("Вы не отдали ни одного голоса!");
                    return;
                }
                
                appConfirm(\`У вас осталось \${votesLeft} голосов. Вы уверены, что хотите завершить голосование? Отданные голоса изменить нельзя.\`, () => {
                    const currentUser = JSON.parse(localStorage.getItem('hf_user') || "{}");
                    const statesIdeologies = {};
                    statesData.forEach(s => { statesIdeologies[s.id] = s.ideology; });
                    
                    submitBtn.textContent = "Сохранение...";
                    submitBtn.disabled = true;
                    
                    callApi({
                        action: 'saveUssVotes',
                        username: currentUser.username,
                        token: currentUser.token,
                        votes: votesGiven,
                        statesIdeologies: statesIdeologies
                    }).then(res => {
                        if (res.success) {
                            modal.remove();
                            if (res.deported) {
                                appAlert("Вы были ДЕПОРТИРОВАНЫ из USS за поддержку чужой идеологии.");
                            } else {
                                appAlert("Голоса успешно сохранены!");
                            }
                            window.location.reload();
                        } else {
                            appAlert(res.error || "Ошибка сохранения");
                            submitBtn.textContent = "Завершить голосование";
                            submitBtn.disabled = false;
                        }
                    });
                });
            });
        }
    }
    
    attachEvents();
}
`;
code += '\n' + mapCode;

fs.writeFileSync('uss-civil-war.js', code);
