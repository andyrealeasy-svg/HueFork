const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

const oldRenderSearchPage = `        </div>
      \`;
    }
    
    const renderReviewCard =`;

const newRenderSearchPage = `        </div>
      \`;
    }
    
    // We will inject users async, add a placeholder
    html += \`<div id="page-search-users-container"></div>\`;
    
    const renderReviewCard =`;

code = code.replace(oldRenderSearchPage, newRenderSearchPage);

const oldAppendSearchPage = `    html += \`</div>\`;
  }
  
  app.innerHTML = html;`;

const newAppendSearchPage = `    html += \`</div>\`;
  }
  
  app.innerHTML = html;
  
  // Async fetch users
  callApi({ action: 'searchUsers', query: q }).then(res => {
     if (res.success && res.users.length > 0) {
        const container = document.getElementById('page-search-users-container');
        if (!container) return; // if user navigated away
        
        let usersHtml = \`
        <div class="mt-12">
          <h2 class="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">Пользователи</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        \`;
        res.users.forEach(u => {
           let avatar = u.avatar && u.avatar.startsWith('http') ? \`<img src="\${u.avatar}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">\` : \`<div class="w-full h-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 flex items-center justify-center font-bold text-3xl group-hover:scale-105 transition-transform duration-500">\${u.username.charAt(0).toUpperCase()}</div>\`;
           usersHtml += \`
           <a href="#/users/\${encodeURIComponent(u.username)}" class="group block">
              <div class="aspect-square mb-3 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                 \${avatar}
              </div>
              <div class="text-center">
                 <div class="font-bold text-zinc-900 dark:text-white truncate">\${u.username}</div>
              </div>
           </a>
           \`;
        });
        usersHtml += \`</div></div>\`;
        container.innerHTML = usersHtml;
        
        // if the page was previously empty
        const emptyState = app.querySelector('.py-16.text-center.border-dashed');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
     }
  });`;

code = code.replace(oldAppendSearchPage, newAppendSearchPage);
fs.writeFileSync('main.js', code);
