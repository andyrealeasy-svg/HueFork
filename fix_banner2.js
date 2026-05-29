import fs from 'fs';

let main = fs.readFileSync('main.js', 'utf8');

const bannerLogicRegex = /  let latestRelease = null;[\s\S]*?  let topReleasesHtml = "";/;

const newBannerLogic = `  let latestRelease = null;
  const getCompareDate = (r) => r.reviewDate ? new Date(r.reviewDate).getTime() : new Date(r.releaseDate).getTime();
  const compareReleases = (a, b) => {
    const dateA = getCompareDate(a);
    const dateB = getCompareDate(b);
    if (dateA !== dateB) return dateB - dateA;
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  };

  const upcomingReleases = artistReviews.filter(r => r.isUpcoming).sort((a,b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
  const recentAlbums = albumsList.filter(r => !r.isUpcoming && (Date.now() - getCompareDate(r)) / (1000 * 60 * 60 * 24) <= 14).sort(compareReleases);
  const recentSingles = singlesList.filter(r => !r.isUpcoming && (Date.now() - getCompareDate(r)) / (1000 * 60 * 60 * 24) <= 3).sort(compareReleases);

  if (upcomingReleases.length > 0) {
      latestRelease = upcomingReleases[0];
  } else if (recentAlbums.length > 0) {
      latestRelease = recentAlbums[0];
  } else if (recentSingles.length > 0) {
      latestRelease = recentSingles[0];
  }

  let latestReleaseHtml = "";
  if (latestRelease) {
      let bannerTextLabel = latestRelease.isUpcoming ? "Оценить после релиза" : (latestRelease.isSingle ? "Посмотреть новую рецензию" : "Посмотреть новую рецензию");
      latestReleaseHtml = \`
      <div class="mb-12">
        <a href="#/reviews/\${latestRelease.id}" class="group flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors rounded-xl p-2 sm:p-3 w-full">
          <div class="flex items-center gap-3 min-w-0">
            <img src="\${latestRelease.cover}" alt="\${latestRelease.title}" class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shadow-sm flex-shrink-0" />
            <div class="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
              \${bannerTextLabel}
            </div>
          </div>
          <div class="flex-shrink-0 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300 transition-colors ml-4 mr-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </a>
      </div>
      \`;
  }

  let topReleasesHtml = "";`;

main = main.replace(bannerLogicRegex, newBannerLogic);

fs.writeFileSync('main.js', main);
