const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

code = code.replace(
    '  } else if (hash === "#/archive") {',
    '  } else if (hash === "#/drop") {\n    renderDrop();\n  } else if (hash === "#/hueboard") {\n    renderHueboard();\n  } else if (hash === "#/archive") {'
);

fs.writeFileSync('main.js', code);
