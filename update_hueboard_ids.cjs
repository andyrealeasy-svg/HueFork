const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

code = code.replace(
    /let purchases = res\.purchases \|\| \[\];[\s\S]*?const now = new Date\(\);/,
    `let purchases = res.purchases || [];
      if (purchases.length === 0) {
          purchases = [
              { reviewId: 'sicka-fucking-fucking-freestyle', points: 500, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: 'sicka-100-flopie-single', points: 250, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'dollova-cum-mania-sex-bomb-deluxe', points: 300, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: 'ksivat-matcha-single', points: 150, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'sicka-okurr', points: 100, type: 'cd', date: new Date().toISOString() },
              { reviewId: 'niksa-business-single', points: 60, type: 'digital', date: new Date().toISOString() },
          ];
      }
      
      const now = new Date();`
);

fs.writeFileSync('hueboard.js', code);
