import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviews, artists } from './data';
import { motion, AnimatePresence } from 'motion/react';

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  const filteredReviews = query.trim() ? reviews.filter(r => {
    const artist = artists.find(a => a.id === r.artistId);
    const searchString = `${r.title} ${artist?.name}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  }).slice(0, 5) : [];

  const filteredArtists = query.trim() ? artists.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3) : [];

  return (
    <div className="static sm:relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
        aria-label="Поиск"
      >
        <SearchIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 right-4 top-16 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 rounded-md overflow-hidden"
          >
            <div className="flex items-center p-2 border-b border-zinc-200 dark:border-zinc-800">
              <SearchIcon size={18} className="text-zinc-400 ml-2 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Поиск альбомов, артистов..."
                className="flex-grow p-2 bg-transparent text-sm font-sans focus:outline-none dark:text-white"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-2 text-zinc-400 hover:text-black dark:hover:text-white flex-shrink-0">
                  <X size={16} />
                </button>
              )}
            </div>

            {query.trim() && (
              <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                {filteredArtists.length > 0 && (
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">Артисты</div>
                    {filteredArtists.map(artist => (
                      <Link 
                        key={artist.id} 
                        to={`/artists/${artist.id}`}
                        onClick={clearSearch}
                        className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-sm"
                      >
                        <img src={artist.photo} alt={artist.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-bold text-sm dark:text-white">{artist.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
                
                {filteredReviews.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-2">Рецензии</div>
                    {filteredReviews.map(review => {
                      const artist = artists.find(a => a.id === review.artistId);
                      return (
                        <Link 
                          key={review.id} 
                          to={`/reviews/${review.id}`}
                          onClick={clearSearch}
                          className="flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-sm"
                        >
                          <img src={review.cover} alt={review.title} className="w-10 h-10 object-cover rounded-sm" />
                          <div>
                            <div className="font-bold text-sm dark:text-white leading-tight">{review.title}</div>
                            <div className="text-xs text-zinc-500">{artist?.name}</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}

                {filteredArtists.length === 0 && filteredReviews.length === 0 && (
                  <div className="p-6 text-center text-zinc-500 text-sm">
                    Ничего не найдено по запросу "{query}"
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
