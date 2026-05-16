
function getLimitDayString() {
  const now = new Date();
  const mskOffset = 3 * 60 * 60 * 1000;
  const mskDate = new Date(now.getTime() + mskOffset);
  mskDate.setTime(mskDate.getTime() - 6 * 60 * 60 * 1000);
  const dateStr = mskDate.toISOString().split('T')[0];
  const half = mskDate.getUTCHours() < 12 ? '1' : '2';
  return `${dateStr}-${half}`;
}

export function renderRequestReview() {
  document.body.classList.remove("bg-[#fff0f0]", "dark:bg-[#1f0f0f]");
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-12 md:py-16 animate-slide-up">
      <header class="text-center mb-12">
        <h1 class="font-serif font-black text-4xl md:text-5xl tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4 uppercase">
          Заказать рецензию
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-lg font-serif italic mb-2">
          Заполните форму, чтобы отправить ваш релиз на рассмотрение редакции.
        </p>
        <p class="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-8">
          Лимит: 1 раз в 12 часов. Сброс в 6:00 и 18:00 (МСК).
        </p>

        <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-left max-w-2xl mx-auto">
          <h2 class="text-red-800 dark:text-red-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Черный лист артистов
          </h2>
          <ol class="list-decimal list-outside ml-4 text-sm text-red-700/80 dark:text-red-400/80 space-y-2 font-medium">
            <li>MILLEXA, NISHE и подобные даже не знаю каким словом обозвать певички из комьюнити</li>
            <li>Все глобальные мужские артисты</li>
          </ol>
        </div>
      </header>

      <form id="review-request-form" class="space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-6 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div class="space-y-4">
          <label class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Тип релиза</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <input type="radio" name="releaseType" value="single" class="accent-red-600" checked />
              <span class="font-medium text-sm">Сингл</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <input type="radio" name="releaseType" value="album" class="accent-red-600" />
              <span class="font-medium text-sm">Альбом</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <input type="radio" name="releaseType" value="ep" class="accent-red-600" />
              <span class="font-medium text-sm">EP</span>
            </label>
            <label class="flex items-center gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <input type="radio" name="releaseType" value="mixtape" class="accent-red-600" />
              <span class="font-medium text-sm">Микстейп</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label for="artist" class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Артист</label>
            <input type="text" id="artist" required class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all font-medium text-zinc-900 dark:text-zinc-50 placeholder-zinc-400" placeholder="Имя артиста" />
          </div>
          <div class="space-y-2">
            <label for="title" class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Название релиза</label>
            <input type="text" id="title" required class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all font-medium text-zinc-900 dark:text-zinc-50 placeholder-zinc-400" placeholder="Название альбома/сингла" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label for="label" class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Лейбл (если есть)</label>
            <input type="text" id="label" class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all font-medium text-zinc-900 dark:text-zinc-50 placeholder-zinc-400" placeholder="Название лейбла" />
          </div>
          <div class="space-y-2">
            <label for="releaseDate" class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Дата релиза</label>
            <input type="date" id="releaseDate" required class="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all font-medium text-zinc-900 dark:text-zinc-50" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">Треклист</label>
            <button type="button" id="add-track-btn" class="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors flex items-center gap-1">
              + Добавить трек
            </button>
          </div>
          <div id="tracklist-container" class="space-y-3">
            <!-- Tracks will be appended here -->
          </div>
        </div>

        <div id="form-message" class="hidden rounded-lg p-4 text-sm font-bold"></div>

        <div class="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button type="submit" class="w-full bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            Отправить заявку
          </button>
        </div>
      </form>
    </div>
  `;

  let tracks = [{ id: Date.now(), name: '' }];

  const renderTracks = () => {
    const container = document.getElementById('tracklist-container');
    if (!container) return;
    container.innerHTML = '';
    tracks.forEach((track, index) => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-2 sm:gap-4 animate-slide-up group';
      
      row.innerHTML = `
        <div class="flex-shrink-0 w-6 sm:w-8 text-center font-serif italic text-zinc-400 dark:text-zinc-500 text-lg">${index + 1}</div>
        <input type="text" class="track-input flex-grow min-w-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500 transition-all text-sm font-medium text-zinc-900 dark:text-zinc-50 placeholder-zinc-400" placeholder="Название трека" value="${track.name}" data-id="${track.id}" required />
        <div class="flex items-center gap-0 sm:gap-2 flex-shrink-0">
          <button type="button" class="move-up-btn p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors" data-index="${index}" ${index === 0 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <button type="button" class="move-down-btn p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors" data-index="${index}" ${index === tracks.length - 1 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button type="button" class="remove-track-btn p-1.5 sm:p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      `;

      row.querySelector('.track-input').addEventListener('input', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const t = tracks.find(x => x.id === id);
        if (t) t.name = e.target.value;
      });

      row.querySelector('.move-up-btn').addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        if (idx > 0) {
          [tracks[idx - 1], tracks[idx]] = [tracks[idx], tracks[idx - 1]];
          renderTracks();
        }
      });

      row.querySelector('.move-down-btn').addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        if (idx < tracks.length - 1) {
          [tracks[idx + 1], tracks[idx]] = [tracks[idx], tracks[idx + 1]];
          renderTracks();
        }
      });

      row.querySelector('.remove-track-btn').addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        tracks.splice(idx, 1);
        if (tracks.length === 0) {
            tracks.push({ id: Date.now(), name: '' });
        }
        renderTracks();
      });

      container.appendChild(row);
    });
  };

  renderTracks();

  document.getElementById('add-track-btn').addEventListener('click', () => {
    tracks.push({ id: Date.now(), name: '' });
    renderTracks();
  });

  document.getElementById('review-request-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const limitDayStr = getLimitDayString();
    const lastRequest = localStorage.getItem('last_review_request');
    const msgEl = document.getElementById('form-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (lastRequest === limitDayStr) {
      msgEl.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-400');
      msgEl.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-400');
      msgEl.textContent = 'Лимит исчерпан. Следующую заявку можно отправить после ближайшего сброса лимита (6:00 или 18:00 МСК).';
      return;
    }

    const releaseType = document.querySelector('input[name="releaseType"]:checked').value;
    const artist = document.getElementById('artist').value;
    const title = document.getElementById('title').value;
    const label = document.getElementById('label').value;
    const releaseDate = document.getElementById('releaseDate').value;
    const tracklistText = tracks.map((t, i) => `${i + 1}. ${t.name}`).join('\\n');

    const formData = {
      'Тип релиза': releaseType,
      'Артист': artist,
      'Название': title,
      'Лейбл': label || 'Не указан',
      'Дата релиза': releaseDate,
      'Треклист': tracklistText
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

    try {
      const response = await fetch('https://formspree.io/f/xzdonooa', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        localStorage.setItem('last_review_request', limitDayStr);

        msgEl.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-400');
        msgEl.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-400');
        msgEl.textContent = 'Ваша заявка успешно отправлена редакции!';
        
        e.target.reset();
        tracks = [{ id: Date.now(), name: '' }];
        renderTracks();
      } else {
        throw new Error('Formspree error');
      }
    } catch (error) {
      msgEl.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'dark:bg-green-900/30', 'dark:text-green-400');
      msgEl.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/30', 'dark:text-red-400');
      msgEl.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });
}
