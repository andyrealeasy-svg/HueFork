const fs = require('fs');

let drop = fs.readFileSync('drop.js', 'utf8');
drop = drop.replace(/class="max-w-7xl mx-auto px-4 py-8 animate-fade-in pb-24"/, 'class="max-w-7xl mx-auto px-4 py-8 animate-slide-up pb-24"');
drop = drop.replace(/sm:aspect-\[21\/9\]/, ''); // Make it exactly 16:9 
fs.writeFileSync('drop.js', drop);

let hb = fs.readFileSync('hueboard.js', 'utf8');
hb = hb.replace(/class="max-w-5xl mx-auto px-4 py-12 animate-fade-in pb-24"/, 'class="max-w-5xl mx-auto px-4 py-12 animate-slide-up pb-24"');
fs.writeFileSync('hueboard.js', hb);
