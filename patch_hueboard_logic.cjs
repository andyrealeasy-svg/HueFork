const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

const target = `      const weeks = {}; // weekId -> points map
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

const replacement = `      const weeks = {}; // weekId -> points map
      purchases.forEach(p => {
          const itemReview = reviews.find(r => r.id === p.reviewId);
          if (!itemReview) return;
          
          let w_purchase = getChartWeek(p.date);
          let w_effective = w_purchase;
          
          if (itemReview.releaseDate) {
              let w0 = getChartWeek(itemReview.releaseDate);
              let d = new Date(w0);
              d.setUTCDate(d.getUTCDate() + 7);
              let debutWeek = d.toISOString();
              
              if (new Date(w_purchase) <= new Date(debutWeek)) {
                  w_effective = debutWeek;
              }
          }
          
          let targetReviewId = itemReview.originalAlbumId || itemReview.id;
          
          if (!weeks[w_effective]) weeks[w_effective] = {};
          if (!weeks[w_effective][targetReviewId]) weeks[w_effective][targetReviewId] = 0;
          weeks[w_effective][targetReviewId] += p.points;
      });`;

code = code.replace(target, replacement);

fs.writeFileSync('hueboard.js', code);
