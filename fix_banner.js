import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

const regex = /\$\{topReleasesHtml\}/;

const bannerLogic = `
  let latestRelease = null;
  const upcomingReleases = artistReviews.filter(r => r.isUpcoming).sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
  const recentAlbums = albumsList.filter(r => !r.isUpcoming && (Date.now() - new Date(r.releaseDate).getTime()) / (1000 * 60 * 60 * 24) <= 14).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  const recentSingles = singlesList.filter(r => !r.isUpcoming && (Date.now() - new Date(r.releaseDate).getTime()) / (1000 * 60 * 60 * 24) <= 3).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  if (upcomingReleases.length > 0) {
      latestRelease = upcomingReleases[0];
  } else if (recentAlbums.length > 0) {
      latestRelease = recentAlbums[0];
  } else if (recentSingles.length > 0) {
      latestRelease = recentSingles[0];
  }

  let latestReleaseHtml = "";
  if (latestRelease) {
      let bannerTextLabel = latestRelease.isUpcoming ? "Оценить после релиза" : "Посмотреть рецензию";
      let bannerSubLabel = latestRelease.isUpcoming ? "Скорый релиз" : (latestRelease.isSingle ? "Новый сингл" : "Новый альбом");
      latestReleaseHtml = \`
      <div class="mb-12">
        <a href="#/reviews/\${latestRelease.id}" class="group relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 dark:ring-1 dark:ring-white/10 p-4 flex items-center justify-between border border-transparent dark:border-zinc-800">
           <div class="flex items-center min-w-0">
             <div class="flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 mr-4">
               <img src="\${latestRelease.cover}" alt="\${latestRelease.title}" class="w-full h-full object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500" />
               <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
             </div>
             <div class="min-w-0">
                <div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">\${ICONS.STAR} \${bannerSubLabel}</div>
                <h3 class="font-serif font-black text-lg sm:text-xl md:text-2xl leading-tight text-zinc-900 dark:text-zinc-50 truncate">\${latestRelease.title}</h3>
             </div>
           </div>
           
           <div class="font-bold uppercase text-[9px] sm:text-[10px] tracking-widest bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full hidden sm:flex items-center gap-2 whitespace-nowrap ml-4 flex-shrink-0 shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
              \${bannerTextLabel} <!-- chevron not arrow pointing backwards -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transform rotate-180"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
           </div>
        </a>
      </div>
      \`;
  }
`;

const updatedHtmlCode = `
      \${latestReleaseHtml}
      \${topReleasesHtml}
`;

main = main.replace("  let topReleasesHtml = \"\";", bannerLogic + "\n  let topReleasesHtml = \"\";");
main = main.replace(regex, updatedHtmlCode);

fs.writeFileSync('main.js', main);
