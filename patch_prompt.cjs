const fs = require('fs');
let code = fs.readFileSync('profile.js', 'utf8');

const promptCode = `
window.appPrompt = function(title, placeholder, isPassword, onSubmit) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in";
  modal.innerHTML = \`
    <div class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center animate-slide-up">
      <h3 class="font-serif font-black text-xl mb-4 tracking-tighter uppercase text-zinc-900 dark:text-white">\${title}</h3>
      <input type="\${isPassword ? 'password' : 'text'}" id="prompt-input" placeholder="\${placeholder}" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors text-sm font-medium">
      <div class="flex gap-4">
        <button id="modal-cancel" class="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Отмена</button>
        <button id="modal-submit" class="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md">ОК</button>
      </div>
    </div>
  \`;
  document.body.appendChild(modal);
  const input = modal.querySelector('#prompt-input');
  input.focus();
  
  const submit = () => {
    const val = input.value.trim();
    if (!val) return;
    modal.remove();
    onSubmit(val);
  };
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit();
  });
  
  modal.querySelector("#modal-cancel").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-submit").addEventListener("click", submit);
};
`;

code = code.replace(
  'window.appConfirm = function(message, onConfirm) {',
  promptCode + '\\nwindow.appConfirm = function(message, onConfirm) {'
);
fs.writeFileSync('profile.js', code);
