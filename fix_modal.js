import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

const regexModal = /window\.renderCompareModal = function\(\) \{[\s\S]*?\n\};\n/m;
const modalCode = `window.renderCompareModal = function() {
  const container = document.getElementById("compare-container");
  if (!container) return;
  if (window.compareQueue.length < 2) return;
  
  const selectedReviews = window.compareQueue.map(id => reviews.find(r => r.id === id)).filter(Boolean);
  if (selectedReviews.length < 2) return;

  const getScoreMap = (review) => {
      const items = (review.criteria || review.singleCriteria || []);
      const map = {};
      items.forEach((c) => {
          map[c.title.toLowerCase()] = { val: c.score, origTitle: c.title };
      });
      return map;
  };
  
  const criteriaKeys = new Set();
  const mappedCriteriaList = selectedReviews.map(r => getScoreMap(r));
  mappedCriteriaList.forEach(m => Object.keys(m).forEach(k => criteriaKeys.add(k)));
  const allCriteriaKeys = Array.from(criteriaKeys);
  
  const criteriaScores = new Array(selectedReviews.length).fill(0);
  const trackScores = new Array(selectedReviews.length).fill(0);

  // Criteria processing
  const criteriaRows = allCriteriaKeys.map(key => {
      const origTitle = mappedCriteriaList.find(m => m[key])?.[key].origTitle || key;
      const vals = mappedCriteriaList.map(m => m[key] ? m[key].val : undefined);
      const nums = vals.map(v => typeof v === 'number' ? v : -1);
      
      const allHaveScore = vals.every(v => typeof v === 'number');
      let maxVal = -1;
      
      if (allHaveScore) {
          maxVal = Math.max(...nums);
          if (maxVal > -1) {
              nums.forEach((v, idx) => {
                 if (v === maxVal) {
                     criteriaScores[idx]++;
                 }
              });
          }
      }
      return { title: origTitle, vals, maxVal };
  });

  // Tracks processing
  const maxTracksLength = Math.max(...selectedReviews.map(r => (r.tracks || []).length));
  
  const trackRows = [];
  for (let i = 0; i < maxTracksLength; i++) {
      const vals = selectedReviews.map(r => {
          const t = (r.tracks || [])[i];
          return t ? { title: t.title, val: t.score } : { title: '-', val: undefined };
      });
      
      const nums = vals.map(v => typeof v.val === 'number' ? v.val : -1);
      const allHaveScore = vals.every(v => typeof v.val === 'number');
      let maxVal = -1;
      
      if (allHaveScore) {
          maxVal = Math.max(...nums);
          if (maxVal > -1) {
              nums.forEach((v, idx) => {
                 if (v === maxVal) {
                     trackScores[idx]++;
                 }
              });
          }
      }
      trackRows.push({ vals, maxVal });
  }

  const scores = criteriaScores.map((c, i) => c + trackScores[i]);
  const maxScore = Math.max(...scores);
  const winners = selectedReviews.filter((_, idx) => scores[idx] === maxScore && maxScore > 0);
  
  let winnerText = "Никто не победил (Нет баллов)";
  if (winners.length === 1) {
      winnerText = \`Победитель: \${winners[0].title}\`;
  } else if (winners.length > 1 && maxScore > 0) {
      winnerText = \`Ничья: \${winners.map(w => w.title).join(", ")}\`;
  }

  const renderCriteriaRow = (row) => {
      return \`
        <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <td class="py-3 px-2 font-semibold text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-xs text-left">\${row.title}</td>
          \${row.vals.map(v => {
              const strVal = v !== undefined ? v : '-';
              const isWinner = v === row.maxVal && v > -1;
              const colorClass = isWinner ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
              return \`<td class="py-3 px-1 text-center \${colorClass}">\${strVal}</td>\`;
          }).join('')}
        </tr>
      \`;
  };

  const renderTrackRow = (row) => {
      // Special rendering based on index
      // If 2 reviews, follow the exact request: left review -> track | score, right review -> score | track.
      // If more than 2, we just render it simply.
      
      if (selectedReviews.length === 2) {
          const v0 = row.vals[0], v1 = row.vals[1];
          const color0 = v0.val === row.maxVal && v0.val > -1 ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
          const color1 = v1.val === row.maxVal && v1.val > -1 ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal";
          
          return \`
            <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
               <td class="py-2 px-2 text-left truncate max-w-[120px] sm:max-w-[170px] lg:max-w-[200px] font-medium">\${v0.title}</td>
               <td class="py-2 px-1 text-center font-bold \${color0}">\${v0.val !== undefined ? v0.val : '-'}</td>
               <td class="py-2 px-1 text-center border-l border-zinc-200 dark:border-zinc-800 font-bold \${color1}">\${v1.val !== undefined ? v1.val : '-'}</td>
               <td class="py-2 px-2 text-right truncate max-w-[120px] sm:max-w-[170px] lg:max-w-[200px] font-medium">\${v1.title}</td>
            </tr>
          \`;
      }
      
      // Multi-review > 2 track rendering
      return \`
        <tr class="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          \${row.vals.map((v, i) => {
              const isWinner = v.val === row.maxVal && v.val > -1;
              const colorClass = isWinner ? "text-green-600 dark:text-green-500 bg-green-50/50 dark:bg-green-500/10 font-black" : "font-normal text-zinc-800 dark:text-zinc-200";
              const borderClass = i > 0 ? 'border-l border-zinc-200 dark:border-zinc-800' : '';
              return \`
                 <td class="py-2 px-2 max-w-[120px] truncate text-center \${borderClass}">
                    \${v.title !== '-' ? \`<div class="text-[9px] sm:text-[10px] text-zinc-500 truncate mb-1" title="\${v.title.replace(/"/g, "'")}">\${v.title}</div><div class="font-bold \${colorClass}">\${v.val !== undefined ? v.val : '-'}</div>\` : '-'}
                 </td>
              \`;
          }).join('')}
        </tr>
      \`;
  };

  const content = \`
    <div class="compare-modal-open fixed inset-0 bg-black/60 z-[100] flex justify-center items-end sm:items-center animate-slide-up backdrop-blur-sm p-0 sm:p-4" onclick="window.closeCompareModal(event)">
      <div class="bg-white dark:bg-zinc-950 w-full md:w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl relative" onclick="event.stopPropagation()">
        <div class="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur z-20 border-b border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 flex justify-between items-center">
            <h2 class="text-xl sm:text-2xl font-serif font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Сравнение</h2>
            <div class="flex items-center gap-4">
               <button onclick="window.clearCompare(); window.closeCompareModal(event)" class="text-[10px] hidden sm:block uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors font-bold">Очистить список</button>
               <button onclick="window.closeCompareModal(event)" class="text-zinc-500 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
            </div>
        </div>
        
        <div class="p-4 sm:p-6 text-center">
           <div class="flex flex-nowrap overflow-x-auto gap-4 mb-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 shadow-inner items-start justify-center">
            \${selectedReviews.map((r, i) => \`
              <div class="flex flex-col items-center flex-1 min-w-[100px] max-w-[160px]">
                 <img src="\${r.cover}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded shadow-md mb-3 ring-1 ring-black/5 dark:ring-white/10" />
                 <h3 class="font-bold text-[10px] sm:text-xs leading-tight line-clamp-2 uppercase tracking-widest">\${r.title}</h3>
                 <div class="mt-3 text-xs sm:text-sm text-green-700 bg-green-100 dark:bg-green-950 dark:text-green-400 px-3 py-1 rounded-full font-black">\${scores[i]} баллов</div>
              </div>
            \`).join('')}
          </div>

           <div class="mb-8 font-black uppercase tracking-widest text-sm text-zinc-500">
               \${winnerText}
           </div>
          
          <div class="overflow-x-auto pb-8 flex justify-center">
             
             <div class="flex flex-col gap-8 w-full max-w-4xl">
             
                \${criteriaRows.length > 0 ? \`
                  <table class="w-full text-left uppercase tracking-widest text-[10px] sm:text-xs">
                     <thead>
                       <tr class="border-b-2 border-black dark:border-white">
                         <th class="py-2 px-2 w-[120px] sm:w-[150px]">Критерий</th>
                         \${selectedReviews.map((_, i) => \`<th class="py-2 text-center flex-1 min-w-[50px]">#\${i+1}</th>\`).join('')}
                       </tr>
                     </thead>
                     <tbody>
                        \${criteriaRows.map(renderCriteriaRow).join('')}
                     </tbody>
                  </table>
                \` : ''}

                \${trackRows.length > 0 ? \`
                  <table class="w-full text-left uppercase tracking-widest text-[10px] sm:text-xs text-zinc-500">
                     <thead>
                       <tr class="border-b-2 border-black dark:border-white">
                         \${selectedReviews.length === 2 ? \`
                           <th class="py-2 px-2 text-left w-[40%]">#1 \${selectedReviews[0].title}</th>
                           <th class="py-2 px-1 text-center">Оценка</th>
                           <th class="py-2 px-1 text-center border-l border-zinc-200 dark:border-zinc-800">Оценка</th>
                           <th class="py-2 px-2 text-right w-[40%]">#2 \${selectedReviews[1].title}</th>
                         \` : \`
                           \${selectedReviews.map((r, i) => \`<th class="py-2 text-center text-[9px] sm:text-xs min-w-[60px] \${i > 0 ? 'border-l border-zinc-200 dark:border-zinc-800' : ''}">#\${i+1}</th>\`).join('')}
                         \`}
                       </tr>
                     </thead>
                     <tbody>
                        \${trackRows.map(renderTrackRow).join('')}
                     </tbody>
                  </table>
                \` : ''}
                
             </div>

          </div>
        </div>
      </div>
    </div>
  \`;
  container.innerHTML = content;
};
`;

main = main.replace(regexModal, modalCode);
fs.writeFileSync('main.js', main);
