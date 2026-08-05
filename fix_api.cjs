const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');

code = code.replace(
  'return { success: true, user: { username: auth.user.username, role: auth.user.role, token: auth.user.token, linkedArtistId: linked ? linked.artist_id : undefined } };',
  'return { success: true, user: { username: auth.user.username, role: auth.user.role, token: auth.user.token, linkedArtistId: linked ? linked.artist_id : undefined }, userData: auth.user.data };'
);

code = code.replace(
  'setCurrentUser(res.user);',
  'setCurrentUser(res.user);\n       if (res.userData) {\n         const data = typeof res.userData === "string" ? JSON.parse(res.userData) : res.userData;\n         if (data.userRatings) localStorage.setItem("userRatings", data.userRatings);\n         if (data.subscribedArtists) localStorage.setItem("subscribedArtists", data.subscribedArtists);\n         if (data.huev_2026_watched) localStorage.setItem("huev_2026_watched", data.huev_2026_watched);\n         if (data.reviewNotes) localStorage.setItem("reviewNotes", data.reviewNotes);\n         if (data.myGlobalReview) localStorage.setItem("myGlobalReview", data.myGlobalReview);\n         if (data.personalProfile) localStorage.setItem("personalProfile", data.personalProfile);\n       }'
);

fs.writeFileSync('api.js', code);
