const fs = require('fs');
let code = fs.readFileSync('api.js', 'utf8');
code = code.replace(/      return \{ success: false, error: "Неизвестное действие" \};\s*catch \(e\) \{/, '      return { success: false, error: "Неизвестное действие" };\n    } catch (e) {');
fs.writeFileSync('api.js', code);
