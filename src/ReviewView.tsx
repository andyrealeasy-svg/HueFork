import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getReview, getArtist, getScore, getGlobalRank, getArtistRank, formatDate, formatYear } from './data';
import clsx from 'clsx';
import { Disc3 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion } from 'motion/react';

export default function ReviewView() {
  const { id } = useParams<{ id: string }>();
  const review = getReview(id || '');

  if (!review) return <Navigate to="/" />;

  const artist = getArtist(review.artistId);
  const score = getScore(review);
  const isBNM = score >= 8.2;
  const globalRank = getGlobalRank(review.id);
  const artistRank = getArtistRank(review.id, review.artistId);

  return (
    <div className={clsx(
      "min-h-screen transition-colors duration-500 pb-20", 
      isBNM ? "bg-[#fff0f0] dark:bg-[#1f0f0f]" : "bg-white dark:bg-zinc-950"
    )}>
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 py-12 md:py-20"
      >
        
        {/* Header Block */}
        <header className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
          {/* Main Info */}
          <div className="flex-1 order-2 md:order-1 flex flex-col justify-center">
            {isBNM && (
              <div className="mb-4">
                <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 uppercase tracking-widest rounded-full inline-flex items-center gap-1">
                  <Disc3 size={14} /> Лучшая новая музыка
                </span>
              </div>
            )}
            <h2 className="font-serif font-black text-4xl md:text-6xl mb-2 text-zinc-900 dark:text-zinc-50 leading-tight">
              {review.title}
            </h2>
            <Link to={`/artists/${artist?.id}`} className="inline-block mt-2 group">
              <h3 className="font-bold text-xl md:text-2xl uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                {artist?.name}
              </h3>
            </Link>
            
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              <div>
                <span className="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Лейбл</span>
                {review.label}
              </div>
              <div>
                <span className="block text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] mb-1">Год</span>
                {formatYear(review.releaseDate)}
              </div>
            </div>
            
            <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 grid grid-cols-2 gap-4">
               <div>
                  <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе платформы</span>
                  <div className="font-serif italic text-xl dark:text-zinc-200">#{globalRank}</div>
               </div>
               {artistRank > 0 && (
                 <div>
                    <span className="block text-zinc-500 text-xs uppercase tracking-wider mb-2">В топе артиста</span>
                    <div className="font-serif italic text-xl dark:text-zinc-200">#{artistRank} <span className="text-sm font-sans not-italic text-zinc-400 dark:text-zinc-600">/ {artist?.name}</span></div>
                 </div>
               )}
            </div>
          </div>
          
          {/* Cover & Score Panel */}
          <div className="w-full md:w-80 flex-shrink-0 order-1 md:order-2">
            <div className="relative group">
              <img src={review.cover} alt={review.title} className="w-full bg-zinc-100 dark:bg-zinc-900 aspect-square object-cover shadow-2xl dark:shadow-none dark:ring-1 dark:ring-white/10" />
              <div className={clsx(
                "absolute -bottom-6 -right-6 md:-right-8 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-xl border-4 z-10 font-bold",
                isBNM 
                  ? "bg-[#fff0f0] border-[#fff0f0] dark:bg-[#1f0f0f] dark:border-[#1f0f0f]"
                  : "bg-white border-white dark:bg-zinc-950 dark:border-zinc-950"
              )}>
                 <div className="text-center">
                   <div className={clsx(
                     "text-4xl md:text-5xl tracking-tighter leading-none", 
                     score >= 8.0 ? 'text-red-600 dark:text-red-500' : 'text-zinc-900 dark:text-zinc-100'
                   )}>
                     {score.toFixed(1)}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Short Review */}
        <div className="prose prose-lg dark:prose-invert mx-auto md:mx-0 max-w-2xl font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed mb-16 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">
          <p>{review.text}</p>
        </div>
        
        {/* Tracklist */}
        <section className="border-t border-black dark:border-zinc-700 pt-8">
           <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex justify-between items-end dark:text-zinc-200">
             <span>Треклист</span>
             <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal normal-case">Средняя оценка: {score.toFixed(1)}</span>
           </h3>
           <div className="flex flex-col">
             {review.tracks.map((track, idx) => (
               <div key={idx} className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-800 group hover:bg-black/5 dark:hover:bg-white/5 px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 dark:text-zinc-500 font-mono text-sm w-4 text-right">{idx + 1}.</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{track.title}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 font-mono">{track.duration}</span>
                    <span className={clsx(
                      "font-bold w-8 text-center rounded flex items-center justify-center h-7 text-sm",
                      track.score >= 9 ? "text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/10"
                    )}>
                      {track.score}
                    </span>
                  </div>
               </div>
             ))}
           </div>
        </section>

        {/* Footer Meta */}
        <footer className="mt-16 text-sm flex flex-col md:flex-row justify-between text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-8 gap-4 font-mono">
           <div>Оценено: {formatDate(review.reviewDate)}</div>
           <div>Релиз: {formatDate(review.releaseDate)}</div>
        </footer>

      </motion.article>
    </div>
  );
}
