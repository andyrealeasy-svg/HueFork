const fs = require('fs');
let code = fs.readFileSync('uss-civil-war.js', 'utf8');

code = code.replace(
  /    \}\n  \}\n\}\n\nfunction renderEventPage\(data, user\) \{/,
  `    }
  });
}

function renderEventPage(data, user) {`
);

fs.writeFileSync('uss-civil-war.js', code);
