const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

code = code.replace(
    /let purchases = res\.purchases \|\| \[\];[\s\S]*?const now = new Date\(\);/,
    `let purchases = res.purchases || [];
      if (purchases.length === 0) {
          purchases = [
              { reviewId: '1', points: 500, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: '1', points: 250, type: 'cd', date: new Date().toISOString() },
              { reviewId: '2', points: 300, type: 'vinyl', date: new Date().toISOString() },
              { reviewId: '3', points: 150, type: 'cd', date: new Date().toISOString() },
              { reviewId: '4', points: 100, type: 'cd', date: new Date().toISOString() },
              { reviewId: '5', points: 60, type: 'digital', date: new Date().toISOString() },
          ];
      }
      
      const now = new Date();`
);

fs.writeFileSync('hueboard.js', code);
