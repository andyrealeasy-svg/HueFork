const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

// replace export function renderPersonalProfile(isLoading = true) {
code = code.replace('export function renderPersonalProfile(isLoading = true) {', 'export async function renderPersonalProfile(isLoading = true) {');

fs.writeFileSync('profile.js', code);
