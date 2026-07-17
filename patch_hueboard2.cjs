const fs = require('fs');
let code = fs.readFileSync('hueboard.js', 'utf8');

const target1 = `function getChartWeek(dateString) {
    // Return a comparable week identifier (e.g., timestamp of the Friday 21:00 UTC+3 that closes this week)
    const date = dateString ? new Date(dateString) : new Date();
    // UTC time
    let d = new Date(date);
    d.setUTCHours(d.getUTCHours() + 3); // Adjust to Aremaine time (UTC+3)
    
    // Find the NEXT Friday 21:00
    // If it's already past Friday 21:00, it belongs to the next Friday
    let day = d.getUTCDay(); // 0=Sun, 5=Fri
    let hours = d.getUTCHours();
    
    let daysToFriday = 5 - day;
    if (daysToFriday < 0 || (daysToFriday === 0 && hours >= 21)) {
        daysToFriday += 7;
    }
    
    d.setUTCDate(d.getUTCDate() + daysToFriday);
    d.setUTCHours(21, 0, 0, 0);
    return d.toISOString();
}`;

const replacement1 = `function getChartWeek(dateString) {
    // Return a comparable week identifier (e.g., timestamp of the Thursday 21:00 UTC+3 that closes this week)
    const date = dateString ? new Date(dateString) : new Date();
    // UTC time
    let d = new Date(date);
    d.setUTCHours(d.getUTCHours() + 3); // Adjust to Aremaine time (UTC+3)
    
    // Find the NEXT Thursday 21:00
    // If it's already past Thursday 21:00, it belongs to the next Thursday
    let day = d.getUTCDay(); // 0=Sun, 4=Thu
    let hours = d.getUTCHours();
    
    let daysToThursday = 4 - day;
    if (daysToThursday < 0 || (daysToThursday === 0 && hours >= 21)) {
        daysToThursday += 7;
    }
    
    d.setUTCDate(d.getUTCDate() + daysToThursday);
    d.setUTCHours(21, 0, 0, 0);
    return d.toISOString();
}`;

code = code.replace(target1, replacement1);

const target2 = `      // We might have an active week (currently running), we could show it as "Live" or just stick to the rules and show the last closed. 
      // If there are no closed weeks, maybe just show the running one so it's not empty?
      // Actually, since this is a new feature and purchases are just made, all purchases will belong to a FUTURE closing Friday.
      // So let's show the CURRENT running week as the chart if no closed week exists, or maybe just show the latest week in the data (so purchases show up immediately for demo).
      const weekToShowId = lastClosedWeekId || sortedWeekIds[sortedWeekIds.length - 1] || null;`;

const replacement2 = `      // Strictly show only the last closed week. If no week is closed, it's null.
      const weekToShowId = lastClosedWeekId;`;

code = code.replace(target2, replacement2);

fs.writeFileSync('hueboard.js', code);
