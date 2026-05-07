import React from 'react';
import { Link } from 'react-router-dom';
import { reviews, artists, getScore } from './data';
import clsx from 'clsx';
import { motion } from 'motion/react';

export default function Home() {
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime());
  const featuredReview = sortedReviews[0];
  const otherReviews = sortedReviews.slice(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {featuredReview && (
        <section className="mb-16">
          <Link to={`/reviews/${featuredReview.id}`} className="group block relative aspect-[4/3] w-full max-h-[80vh] overflow-hidden mb-6 flex flex-col justify-end">
             <div className="absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-900">
               <img 
                 src={featuredReview.cover} 
                 alt={featuredReview.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
             </div>
             <div className="relative z-10 p-6 md:p-12 text-white">
               <div className="mb-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest">
                    Новая рецензия
                  </span>
               </div>
               <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight mb-2 group-hover:text-red-400 transition-colors">
                 {artists.find(a => a.id === featuredReview.artistId)?.name}: {featuredReview.title}
               </h2>
               <p className="text-lg md:text-xl text-zinc-300 max-w-2xl hidden md:block">
                 {featuredReview.text}
               </p>
             </div>
          </Link>
        </section>
      )}

      {otherReviews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Недавние рецензии</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {otherReviews.map(review => {
              const artist = artists.find(a => a.id === review.artistId);
              return (
                <Link key={review.id} to={`/reviews/${review.id}`} className="group flex flex-col">
                  <div className="aspect-square w-full relative overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={review.cover} 
                      alt={review.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-red-600 transition-colors flex-grow">
                    {artist?.name}: <i>{review.title}</i>
                  </h3>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold border-b border-black dark:border-zinc-700 pb-2 mb-6 uppercase tracking-wider text-sm">Артисты</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {artists.map(artist => (
            <Link key={artist.id} to={`/artists/${artist.id}`} className="group text-center">
              <div className="aspect-square rounded-full overflow-hidden mb-3 mx-auto max-w-[8rem] w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                <img 
                  src={artist.photo} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wide group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">{artist.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
