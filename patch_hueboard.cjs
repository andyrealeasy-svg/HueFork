const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

const target = `      const weeks = {}; // weekId -> points map
      purchases.forEach(p => {
          const w = getChartWeek(p.date);
          if (!weeks[w]) weeks[w] = {};
          if (!weeks[w][p.reviewId]) weeks[w][p.reviewId] = 0;
          weeks[w][p.reviewId] += p.points;
      });`;

const replacement = `      const weeks = {}; // weekId -> points map
      purchases.forEach(p => {
          let reviewId = p.reviewId;
          const review = reviews.find(r => r.id === reviewId);
          if (review && review.originalAlbumId) {
              reviewId = review.originalAlbumId;
          }
          const w = getChartWeek(p.date);
          if (!weeks[w]) weeks[w] = {};
          if (!weeks[w][reviewId]) weeks[w][reviewId] = 0;
          weeks[w][reviewId] += p.points;
      });`;

code = code.replace(target, replacement);
fs.writeFileSync('hueboard.js', code);
