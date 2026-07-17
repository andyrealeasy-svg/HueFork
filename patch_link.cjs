const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const target = `        let originalAlbumLink = null;
        if (item.title === "Original Album") {
          const artistAlbums = [...reviews].filter(
            (r) =>
              r.artistId === review.artistId &&
              !r.isSingle &&
              r.id !== review.id,
          );
          artistAlbums.sort(
            (a, b) =>
              new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime(),
          );
          const orig = artistAlbums.find(
            (r) =>
              new Date(r.releaseDate).getTime() <=
              new Date(review.releaseDate).getTime(),
          );
          if (orig) {
            originalAlbumLink = \`#/reviews/\${orig.id}\`;
          }
        }`;

const replacement = `        let originalAlbumLink = null;
        if (item.link) {
           originalAlbumLink = \`#/reviews/\${item.link}\`;
        } else if (item.title === "Original Album") {
          const artistAlbums = [...reviews].filter(
            (r) =>
              r.artistId === review.artistId &&
              !r.isSingle &&
              r.id !== review.id,
          );
          artistAlbums.sort(
            (a, b) =>
              new Date(b.releaseDate).getTime() -
              new Date(a.releaseDate).getTime(),
          );
          const orig = artistAlbums.find(
            (r) =>
              new Date(r.releaseDate).getTime() <=
              new Date(review.releaseDate).getTime(),
          );
          if (orig) {
            originalAlbumLink = \`#/reviews/\${orig.id}\`;
          }
        }`;

code = code.replace(target, replacement);
fs.writeFileSync('main.js', code);
