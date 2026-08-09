const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const anchor = `      privateToggle.addEventListener('change', (e) => {`;
const insertion = `      const showStatsToggle = modal.querySelector('#settings-show-stats');
      updateToggleStyle(showStatsToggle);
      showStatsToggle.addEventListener('change', (e) => {
         updateToggleStyle(e.target);
         const updatedData = JSON.parse(localStorage.getItem('personalProfile') || "{}");
         updatedData.showStats = e.target.checked;
         localStorage.setItem('personalProfile', JSON.stringify(updatedData));
         syncUserLocalData();
      });

      privateToggle.addEventListener('change', (e) => {`;

code = code.replace(anchor, insertion);
fs.writeFileSync('profile.js', code);
