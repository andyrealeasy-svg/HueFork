const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const oldRouter = `  } else if (hash.startsWith("#/search")) {
    const params = new URLSearchParams(hash.split("?")[1] || "");
    const q = params.get("q") || "";
    renderSearchPage(q);
  } else if (hash === "#/profile") {`;

const newRouter = `  } else if (hash.startsWith("#/search")) {
    const params = new URLSearchParams(hash.split("?")[1] || "");
    const q = params.get("q") || "";
    renderSearchPage(q);
  } else if (hash.startsWith("#/users/")) {
    const username = decodeURIComponent(hash.split("#/users/")[1]);
    import('./profile.js').then(m => m.renderPublicProfile(username));
  } else if (hash === "#/profile") {`;

code = code.replace(oldRouter, newRouter);
fs.writeFileSync('main.js', code);
