const fs = require('fs');
let code = fs.readFileSync('uss-phase3.js', 'utf8');

// Fix the read full review button link
code = code.replace(/href="#\/review\/\$\{album\.id\}"/, 'href="#/reviews/${album.id}"');

// Change points for Deluxe CD purchase from 0 to 24
code = code.replace(/reviewId: 'uss-deluxe-cd',\s*points: 0,/, "reviewId: 'uss-deluxe-cd',\n                    points: 24,");

// Update preview score HTML
code = code.replace(/<div class="text-4xl font-black font-serif text-red-600" id="preview-score">0 \/ 100<\/div>/, '<div class="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black font-serif text-2xl shadow-lg border-4 border-red-200 dark:border-red-900" id="preview-score">0.0</div>');

// Update alert -> customAlert for error in saveUssReview
code = code.replace(/alert\(\(res\.error \|\| "Ошибка"\)\);/, 'customAlert(res.error || "Ошибка");');

// Update the render forms logic to use +/- UI
const trackRegex = /let tracksHtml = '';[\s\S]*?trackRatingsEl\.innerHTML = tracksHtml;/m;
const newTracksHtml = `let tracksHtml = '';
        const realTracks = album.tracks.filter(t => !t.isSection);
        realTracks.forEach(t => {
            tracksHtml += \`
                <div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate mr-2" title="\${t.title}">\${t.number}. \${t.title}</span>
                    <div class="rating-edit-view flex items-center gap-2">
                        <button data-action="minus" data-name="\${t.title}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">-</button>
                        <span class="rate-val-display w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none track-input" data-name="\${t.title}">10</span>
                        <button data-action="plus" data-name="\${t.title}" class="rate-btn opacity-30 pointer-events-none w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">+</button>
                    </div>
                </div>
            \`;
        });
        trackRatingsEl.innerHTML = tracksHtml;`;
code = code.replace(trackRegex, newTracksHtml);

const critRegex = /let critHtml = '';[\s\S]*?criteriaRatingsEl\.innerHTML = critHtml;/m;
const newCritHtml = `let critHtml = '';
        album.criteria.forEach(c => {
            critHtml += \`
                <div class="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate mr-2">\${c.title}</span>
                    <div class="rating-edit-view flex items-center gap-2">
                        <button data-action="minus" data-name="\${c.title}" class="rate-btn w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">-</button>
                        <span class="rate-val-display w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100 select-none crit-input" data-name="\${c.title}">10</span>
                        <button data-action="plus" data-name="\${c.title}" class="rate-btn opacity-30 pointer-events-none w-6 h-6 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded transition-colors font-black text-lg leading-none select-none">+</button>
                    </div>
                </div>
            \`;
        });
        criteriaRatingsEl.innerHTML = critHtml;`;
code = code.replace(critRegex, newCritHtml);

const scoreRegex = /const updateScore = \(\) => \{[\s\S]*?updateScore\(\);/m;
const newScoreLogic = `const updateScore = () => {
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
            previewScoreEl.textContent = \`\${score.toFixed(1)}\`;
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
        updateScore();`;
code = code.replace(scoreRegex, newScoreLogic);

const submitRegex = /const trackRatings = \{\};\s*document\.querySelectorAll\('\.track-input'\)\.forEach\(inp => trackRatings\[inp\.dataset\.name\] = Number\(inp\.value\)\);\s*const criteriaRatings = \{\};\s*document\.querySelectorAll\('\.crit-input'\)\.forEach\(inp => criteriaRatings\[inp\.dataset\.name\] = Number\(inp\.value\)\);/m;
const newSubmitExtract = `const trackRatings = {};
            document.querySelectorAll('.track-input').forEach(inp => {
                let v = parseInt(inp.textContent);
                if (!isNaN(v)) trackRatings[inp.dataset.name] = v;
            });
            const criteriaRatings = {};
            document.querySelectorAll('.crit-input').forEach(inp => {
                let v = parseInt(inp.textContent);
                if (!isNaN(v)) criteriaRatings[inp.dataset.name] = v;
            });`;
code = code.replace(submitRegex, newSubmitExtract);

// Update citizen reviews score formatting
code = code.replace(/<div class="bg-red-100 text-red-800 dark:bg-red-900\/30 dark:text-red-400 font-black font-serif px-3 py-1 rounded-lg text-lg">\s*\$\{score\}\s*<\/div>/, '<div class="w-12 h-12 bg-red-600 text-white dark:bg-red-700 rounded-full flex items-center justify-center font-black font-serif text-lg shadow-inner border-2 border-red-200 dark:border-red-900 flex-shrink-0">\n                                ${(score / 10).toFixed(1)}\n                            </div>');

fs.writeFileSync('uss-phase3.js', code);
