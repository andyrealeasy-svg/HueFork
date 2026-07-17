const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const svgIcon = (color) => `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${color}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg>`;

const replacer = `
  let certHtml = '';
  if (totalPts >= 500) certHtml = '<span class="inline-flex ml-4 align-middle" title="Diamond (500 pts)">' + \`${svgIcon('#22d3ee')}\` + '</span>';
  else if (totalPts >= 250) certHtml = '<span class="inline-flex ml-4 align-middle" title="Platinum (250 pts)">' + \`${svgIcon('#d4d4d8')}\` + '</span>';
  else if (totalPts >= 100) certHtml = '<span class="inline-flex ml-4 align-middle" title="Gold (100 pts)">' + \`${svgIcon('#fbbf24')}\` + '</span>';
  else if (totalPts >= 50) certHtml = '<span class="inline-flex ml-4 align-middle" title="Silver (50 pts)">' + \`${svgIcon('#9ca3af')}\` + '</span>';
`;

code = code.replace(
    /let certHtml = '';\n  if \(totalPts >= 500\).*?title="Silver \(50 pts\)">⚪<\/span>';/s,
    replacer
);

fs.writeFileSync('main.js', code);
