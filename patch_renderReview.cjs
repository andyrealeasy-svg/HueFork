const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

// Find the line:
// const publicData = await fetchPublicData();
// and replace it with:
// const publicData = await fetchPublicData();
// const chartDataRes = await callApi({ action: 'getChartData' });
// let totalPts = 0;
// if (chartDataRes.success && chartDataRes.purchases) {
//    chartDataRes.purchases.forEach(p => { if (p.reviewId === review.id) totalPts += p.points; });
// }
// let certHtml = '';
// if (totalPts >= 500) certHtml = '<span class="inline-flex text-cyan-400" title="Diamond">💎</span>';
// else if (totalPts >= 250) certHtml = '<span class="inline-flex text-zinc-300" title="Platinum">💿</span>';
// else if (totalPts >= 100) certHtml = '<span class="inline-flex text-yellow-400" title="Gold">📀</span>';
// else if (totalPts >= 50) certHtml = '<span class="inline-flex text-zinc-400" title="Silver">⚪</span>';

const newLines = `
  const publicData = await fetchPublicData();
  const chartDataRes = await callApi({ action: 'getChartData' });
  let totalPts = 0;
  if (chartDataRes.success && chartDataRes.purchases) {
     chartDataRes.purchases.forEach(p => { if (p.reviewId === review.id) totalPts += p.points; });
  }
  let certHtml = '';
  if (totalPts >= 500) certHtml = '<span class="inline-flex text-cyan-400 text-3xl ml-4 drop-shadow-md" title="Diamond (500 pts)">💎</span>';
  else if (totalPts >= 250) certHtml = '<span class="inline-flex text-zinc-300 text-3xl ml-4 drop-shadow-md" title="Platinum (250 pts)">💿</span>';
  else if (totalPts >= 100) certHtml = '<span class="inline-flex text-yellow-400 text-3xl ml-4 drop-shadow-md" title="Gold (100 pts)">📀</span>';
  else if (totalPts >= 50) certHtml = '<span class="inline-flex text-zinc-400 text-3xl ml-4 drop-shadow-md" title="Silver (50 pts)">⚪</span>';
`;

code = code.replace(
    '  const publicData = await fetchPublicData();',
    newLines
);

// Then insert certHtml next to the title.
// ${review.title}
code = code.replace(
    '              ${review.title}',
    '              ${review.title}${certHtml}'
);

fs.writeFileSync('main.js', code);
