import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Search from './Search';
import { useTheme } from './ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col transition-colors duration-300">
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
          
          <div className="flex-1 flex items-center">
            <button 
              onClick={toggleTheme}
              className="p-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <Link to="/" className="flex items-center justify-center group flex-shrink-0">
            <img 
              src="https://i.postimg.cc/CKFt1H8R/file-00000000ef1471f6bf959e3f3217711b.png" 
              alt="HueFork" 
              className="h-10 w-10 object-cover rounded-full border border-black/10 dark:border-white/10 dark:invert transition-all"
            />
            <span className="ml-3 font-serif font-black text-2xl tracking-tighter hidden sm:block">HueFork</span>
          </Link>
          
          <div className="flex-1 flex justify-end">
            <Search />
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-zinc-900 dark:bg-black text-white py-12 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.postimg.cc/CKFt1H8R/file-00000000ef1471f6bf959e3f3217711b.png" 
              alt="HueFork" 
              className="h-12 w-12 object-cover rounded-full dark:invert transition-all"
            />
          </div>
          <p className="text-zinc-400 text-sm">&copy; {new Date().getFullYear()} HueFork. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
