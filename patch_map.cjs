const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

const svgPathsCode = `
const svgPaths = [
  { id: "divas-born", d: "M 80,40 L 220,60 L 200,280 L 230,420 L 160,400 L 110,320 L 60,200 L 50,100 Z", cx: 140, cy: 230, fill: "#7a6458", textColor: "#fff" },
  { id: "7-1", d: "M 220,60 L 400,70 L 390,290 L 200,280 Z", cx: 305, cy: 175, fill: "#7a6458", textColor: "#fff" },
  { id: "sicka-gcd", d: "M 200,280 L 390,290 L 410,480 L 310,500 L 230,420 Z", cx: 310, cy: 380, fill: "#7a6458", textColor: "#fff" },
  { id: "freaking-news", d: "M 400,70 L 590,90 L 580,310 L 390,290 Z", cx: 490, cy: 190, fill: "#1a1a1a", textColor: "#fff" },
  { id: "they-bow", d: "M 390,290 L 580,310 L 580,420 L 600,470 L 550,570 L 470,610 L 420,530 L 410,480 Z", cx: 490, cy: 390, fill: "#d2c8bc", textColor: "#000" },
  { id: "white-house-hoe", d: "M 590,90 L 650,90 L 670,140 L 730,130 L 750,160 L 760,230 L 760,280 L 580,310 Z", cx: 670, cy: 200, fill: "#1a1a1a", textColor: "#fff" },
  { id: "mrs-president", d: "M 580,310 L 760,280 L 770,440 L 580,420 Z", cx: 675, cy: 360, fill: "#d2c8bc", textColor: "#000" },
  { id: "national-baddie", d: "M 750,160 L 800,140 L 860,110 L 900,100 L 940,60 L 960,120 L 900,180 L 840,210 L 760,230 Z", cx: 860, cy: 145, fill: "#1a1a1a", textColor: "#fff" },
  { id: "the-choir", d: "M 760,230 L 840,210 L 900,180 L 910,260 L 820,290 L 760,280 Z", cx: 830, cy: 240, fill: "#6b6b6b", textColor: "#fff" },
  { id: "unknown", d: "M 760,280 L 820,290 L 910,260 L 890,390 L 820,420 L 770,440 Z", cx: 830, cy: 345, fill: "#6b6b6b", textColor: "#fff" },
  { id: "wma", d: "M 580,420 L 770,440 L 820,420 L 890,390 L 860,490 L 870,580 L 820,590 L 800,500 L 600,470 Z", cx: 740, cy: 500, fill: "#d2c8bc", textColor: "#000" }
];
`;

const replaceGrid = `
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
             </div>`;

const newRenderContent = `
    const renderContent = () => {
        let svgContent = svgPaths.map(s => {
            const count = votesGiven[s.id] || 0;
            const sData = statesData.find(st => st.id === s.id);
            return \`
                <g class="state-btn cursor-pointer" data-state="\${s.id}" style="transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
                    <path d="\${s.d}" fill="\${s.fill}" stroke="#fff" stroke-width="3" stroke-linejoin="round" />
                    <text x="\${s.cx}" y="\${s.cy}" fill="\${s.textColor}" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle" pointer-events="none">\${sData.name}</text>
                    \${count > 0 ? \`
                        <circle cx="\${s.cx}" cy="\${s.cy - 30}" r="14" fill="#dc2626" stroke="#fff" stroke-width="2" pointer-events="none" />
                        <text x="\${s.cx}" y="\${s.cy - 25}" fill="#fff" font-size="14" font-weight="900" text-anchor="middle" pointer-events="none">\${count}</text>
                    \` : ''}
                </g>
            \`;
        }).join('');
        
        return \`
          <div class="bg-white dark:bg-zinc-950 w-full max-w-5xl rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[95vh]">
             <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                <div>
                  <h2 class="font-serif font-black text-xl uppercase tracking-widest text-zinc-900 dark:text-white">Карта штатов</h2>
                  \${!data.phase2_completed ? \`<p class="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">Осталось голосов: <span id="votes-left-text">\${votesLeft}</span></p>\` : \`<p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Голосование завершено</p>\`}
                </div>
                <button id="close-map" class="text-zinc-400 hover:text-black dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-900 rounded-full p-2">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <div class="p-2 sm:p-6 overflow-y-auto flex-grow bg-[#f5f5f5] dark:bg-zinc-900 flex items-center justify-center">
                <svg viewBox="0 0 1000 650" class="w-full h-auto drop-shadow-xl" style="max-height: 65vh; min-width: 800px;">
                   \${svgContent}
                </svg>
             </div>`;

let finalCode = code.replace(replaceGrid, newRenderContent);
finalCode = finalCode.replace('const statesData = [', svgPathsCode + '\\nconst statesData = [');
fs.writeFileSync('uss-civil-war.js', finalCode);
