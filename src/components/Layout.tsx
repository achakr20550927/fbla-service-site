import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Map as MapIcon, Info, BookOpen, Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpg';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const location = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { name: 'Home', path: '/', icon: Shield },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Risk Map', path: '/map', icon: MapIcon },
    { name: 'Resources', path: '/resources', icon: BookOpen },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-900'}`}>
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white bg-[size:50px_50px] opacity-10"></div>
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse-slow ${isDark ? 'bg-orange-600/10' : 'bg-orange-400/10'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse-slow ${isDark ? 'bg-amber-600/10' : 'bg-amber-400/10'}`} style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card rounded-2xl px-6 py-3 flex justify-between items-center"
          >
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className={`absolute inset-0 blur-md opacity-30 group-hover:opacity-60 transition-opacity ${isDark ? 'bg-orange-500' : 'bg-orange-600'}`}></div>
                <div className="relative p-1 rounded-xl overflow-hidden">
                  <img
                    src={logo}
                    alt="Silence the Violence EC"
                    className="w-12 h-12 object-contain logo-blend"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-orange-600');
                    }}
                  />
                </div>
              </div>
              <span className={`text-xl font-black tracking-tighter uppercase italic transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Silencing <span className="text-orange-500 glow-text">Violence</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all group ${location.pathname === item.path
                    ? (isDark ? 'text-white' : 'text-slate-900')
                    : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                    }`}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="nav-active"
                      className={`absolute inset-0 border rounded-xl ${isDark ? 'bg-orange-600/20 border-orange-500/50' : 'bg-orange-600/10 border-orange-600/20'}`}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.name}
                  </span>
                </Link>
              ))}

              <div className={`ml-4 h-6 w-[1px] ${isDark ? 'bg-white/10' : 'bg-slate-900/10'}`}></div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`ml-4 p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${isDark ? 'bg-white/5 text-orange-400 hover:bg-white/10' : 'bg-slate-900/5 text-orange-600 hover:bg-slate-900/10'}`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button className="ml-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all glow-border">
                Emergency 988
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-xl ${isDark ? 'text-orange-400' : 'text-orange-600'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className={`p-2 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${location.pathname === item.path
                      ? 'bg-orange-600 text-white'
                      : (isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-900/5')
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="relative z-10 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className={`relative z-10 border-t pt-24 pb-12 transition-colors duration-500 section-alt ${isDark ? 'border-white/5' : 'border-slate-300'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="relative p-1 rounded-xl overflow-hidden">
                  <img
                    src={logo}
                    alt="Silence the Violence EC"
                    className="w-12 h-12 object-contain logo-blend"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-orange-600');
                    }}
                  />
                </div>
                <span className={`text-xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Silencing <span className="text-orange-500">Violence</span>
                </span>
              </Link>
              <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Maryland's premier interactive gun violence prevention tool. Powered by youth-led research and live data integration.
              </p>
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isDark ? 'bg-white/5 border-white/10 hover:bg-orange-600/20' : 'bg-slate-900/5 border-slate-900/10 hover:bg-orange-600/10'}`}>
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Navigation</h4>
              <ul className="space-y-4 text-sm font-bold">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link to={item.path} className={`transition-colors ${isDark ? 'text-slate-400 hover:text-orange-400' : 'text-slate-600 hover:text-orange-600'}`}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Crisis Support</h4>
              <ul className={`space-y-4 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <li className="flex items-center gap-2 text-rose-500"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> 988 Lifeline</li>
                <li>MD Crisis: 1-800-273-8255</li>
                <li>Text "MD" to 741741</li>
              </ul>
            </div>

            <div>
              <h4 className={`font-black text-xs uppercase tracking-[0.2em] mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact</h4>
              <ul className={`space-y-4 text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><a href="mailto:silencetheviolenceec@gmail.com" className="hover:text-orange-500 transition-colors">silencetheviolenceec@gmail.com</a></li>
                <li>@silencetheviolenceec</li>
                <li>Centennial High School FBLA</li>
              </ul>
            </div>
          </div>

          <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
            <p>© 2026 Centennial FBLA. All Rights Reserved.</p>
            <div className="flex gap-8">
              <Link to="/privacy" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Privacy</Link>
              <Link to="/terms" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
