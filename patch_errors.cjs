const fs = require('fs');
let profileCode = fs.readFileSync('profile.js', 'utf8');
profileCode = profileCode.replace(
  'if (newUsername === profile.username) return;\\n             \\n             const currentUser = JSON.parse(localStorage.getItem(\\'hf_user\\') || "{}");',
  'const currentUser = JSON.parse(localStorage.getItem(\\'hf_user\\') || "{}");\\n             if (newUsername === currentUser.username) return;'
);
fs.writeFileSync('profile.js', profileCode.replace(/\\\\n/g, '\\n'));

let apiCode = fs.readFileSync('api.js', 'utf8');
apiCode = apiCode.replace(
  'const newToken = generateToken();',
  'const newToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);'
);
fs.writeFileSync('api.js', apiCode);
