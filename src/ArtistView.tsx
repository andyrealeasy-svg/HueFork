import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getArtist, getReviewsForArtist, getScore } from './data';
import clsx from 'clsx';
import { Disc } from 'lucide-react';
import { motion } from 'motion/react';

export default function ArtistView() {
  const { id } = useParams<{ id: string }>();
  const artist = getArtist(id || '');

  if (!artist) return <Navigate to="/" />;

  const reviews = getReviewsForArtist(artist.id);
  const sortedByScore = [...reviews].sort((a, b) => getScore(b) - getScore(a));
  const sortedByDate = [...reviews].sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());

  const topReleases = sortedByScore.slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 py-12 md:py-16"
    >
      
      {/* Artist Profile Header */}
      <header className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 border-b border-black dark:border-zinc-700 pb-12">
        <div className="w-48 h-48 md:w-64 md:h-64 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden flex-shrink-0 border-4 border-white dark:border-zinc-800 shadow-xl dark:shadow-none">
          <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="font-serif font-black text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            {artist.name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold text-sm flex items-center justify-center md:justify-start gap-2">
            <Disc size={16} /> {reviews.length} Оцененных релизов
          </p>
        </div>
      </header>

      {/* Top Releases */}
      {topReleases.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold border-b-2 border-red-600 pb-2 mb-8 uppercase tracking-wider text-sm inline-block dark:text-zinc-50">Лучшие оценки</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {topReleases.map((review, idx) => (
              <Link key={review.id} to={`/reviews/${review.id}`} className="group flex flex-col items-center text-center">
                 <div className="relative w-full aspect-square mb-4 bg-zinc-100 dark:bg-zinc-900 shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 overflow-hidden">
                    <img src={review.cover} alt={review.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 right-2 bg-white dark:bg-zinc-900 dark:text-white dark:ring-1 dark:ring-white/10 w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg shadow-md group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                      {getScore(review).toFixed(1)}
                    </div>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        #1 в рейтинге
                      </div>
                    )}
                 </div>
                 <h3 className="font-serif font-bold text-xl leading-tight dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                   {review.title}
                 </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Full Discography */}
      <section>
        <h2 className="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-8 uppercase tracking-wider text-sm dark:text-zinc-50">Вся дискография</h2>
        <div className="flex flex-col">
          {sortedByDate.map(review => {
            const score = getScore(review);
            return (
              <Link key={review.id} to={`/reviews/${review.id}`} className="group flex items-center border-b border-zinc-200 dark:border-zinc-800 py-6 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 mr-6 overflow-hidden shadow-sm dark:ring-1 dark:ring-white/10">
                  <img src={review.cover} alt={review.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl leading-tight dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors mb-1">
                    {review.title}
                  </h3>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-mono">
                    {new Date(review.releaseDate).getFullYear()} • {review.label}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 text-center">
                  <div className={clsx(
                    "text-2xl sm:text-3xl font-bold tracking-tighter w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border-2",
                    score >= 8.2 
                      ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500" 
                      : "border-zinc-200 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200",
                    "group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors"
                  )}>
                    {score.toFixed(1)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </motion.div>
  );
}
