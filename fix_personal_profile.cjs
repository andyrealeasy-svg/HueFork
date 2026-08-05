const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const oldFuncStart = `export function renderPersonalProfile() {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();
  if (!user) {
    window.location.hash = "#/profile";
    return;
  }

  const personalData = JSON.parse(localStorage.getItem("personalProfile") || "{}");`;

const newFuncStart = `export function renderPersonalProfile(isLoading = true) {
  const app = document.getElementById("app");
  document.body.classList.remove("bg-red-50", "dark:bg-red-950/50", "bg-emerald-50", "dark:bg-emerald-950/50");

  const user = getCurrentUser();
  if (!user) {
    window.location.hash = "#/profile";
    return;
  }

  if (isLoading) {
    app.innerHTML = \`<div class="max-w-4xl mx-auto py-12 px-4 relative z-0 flex flex-col items-center justify-center min-h-[50vh] animate-fade-in"><div class="w-12 h-12 border-4 border-zinc-200 border-t-red-500 rounded-full animate-spin"></div><div class="mt-4 font-bold text-zinc-500 uppercase tracking-widest text-sm">Синхронизация данных...</div></div>\`;
    refreshSession().then(() => renderPersonalProfile(false));
    return;
  }

  const personalData = JSON.parse(localStorage.getItem("personalProfile") || "{}");`;

code = code.replace(oldFuncStart, newFuncStart);

// Also need to make sure the app.innerHTML has animate-fade-in so it looks nice after load.
// It already has animate-slide-up from earlier right? Let's check.
fs.writeFileSync('profile.js', code);
