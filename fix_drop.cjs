const fs = require('fs');
const code = fs.readFileSync('drop.js', 'utf8');

// I will just replace from "initDropPage(); });" up to "// Provide global function for buying" with "initDropPage();"

const fixedCode = code.replace(/initDropPage\(\);\s*\}\);\s*document\.getElementById\('tab-singles'\)[\s\S]*?\/\/ Provide global function for buying/, 
'initDropPage();\n\n  // Provide global function for buying');

fs.writeFileSync('drop.js', fixedCode);
