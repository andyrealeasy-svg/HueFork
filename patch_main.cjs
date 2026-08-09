const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

code = code.replace(/import \{ renderUssCivilWar, renderUssCivilWarInterview \} from "\.\/uss-civil-war\.js";/, 'import { renderUssCivilWar, renderUssCivilWarInterview } from "./uss-civil-war.js";\nimport { renderUssPhase3 } from "./uss-phase3.js";');

const newRoute = `  } else if (hash === "#/uss-civil-war/interview") {
    renderUssCivilWarInterview();
  } else if (hash === "#/uss-civil-war/phase3") {
    renderUssPhase3();`;

code = code.replace(/  \} else if \(hash === "#\/uss-civil-war\/interview"\) \{\n    renderUssCivilWarInterview\(\);/, newRoute);
fs.writeFileSync('main.js', code);
