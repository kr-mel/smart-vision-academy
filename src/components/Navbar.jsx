import React, { useState } from 'react';
import { Eye, Award, Sun, Moon, Volume2, VolumeX, Globe, Menu, X, Zap } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export function Navbar({
  lang,
  setLang,
  t,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  xp,
  unlockedLevels,
  activeSection,
  setActiveSection,
  openBadgeModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundFX.enabled = next;
    setSoundEnabled(next);
    if (next) soundFX.playClick();
  };

  const toggleTheme = () => {
    soundFX.playClick();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeLanguage = (newLang) => {
    soundFX.playClick();
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const navItems = [
    { id: 'hero', label: t.hero.highlight },
    { id: 'level1', label: `${t.level} 1`, unlocked: true },
    { id: 'level2', label: `${t.level} 2`, unlocked: unlockedLevels.includes(2) },
    { id: 'level3', label: `${t.level} 3`, unlocked: unlockedLevels.includes(3) },
    { id: 'level4', label: `${t.level} 4`, unlocked: unlockedLevels.includes(4) },
    { id: 'level5', label: `${t.level} 5`, unlocked: unlockedLevels.includes(5) },
    { id: 'level6', label: `${t.level} 6`, unlocked: unlockedLevels.includes(6) },
    { id: 'lab', label: t.openLab, unlocked: true, isLab: true },
  ];

  const scrollTo = (id) => {
    soundFX.playClick();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div 
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-neon-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
              <Eye className="w-5 h-5 text-cyan-400 animate-pulse-slow" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base lg:text-lg tracking-wide bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                YZM 309
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              {t.courseBadge}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-800">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.unlocked && scrollTo(item.id)}
              disabled={!item.unlocked}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan scale-105'
                  : item.unlocked
                  ? item.isLab 
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/60'
                  : 'text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              {item.label}
              {!item.unlocked && <span className="text-[10px]">🔒</span>}
              {item.isLab && <span className="text-[10px]">✨</span>}
            </button>
          ))}
        </nav>

        {/* Right HUD Controls: XP, Badges, Sound, Theme, Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* XP Pill */}
          <div 
            onClick={openBadgeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-neon-amber cursor-pointer hover:scale-105 transition-transform"
            title={t.badges}
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="font-mono">{xp}</span>
            <span className="text-[10px] hidden sm:inline">XP</span>
          </div>

          {/* Badges Trophy Button */}
          <button
            onClick={openBadgeModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700/80 hover:border-amber-400/50 transition-all hover:scale-105"
            title={t.badges}
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all hover:scale-105 ${
              soundEnabled
                ? 'bg-slate-800/80 text-cyan-400 border-cyan-500/40 hover:bg-slate-700'
                : 'bg-slate-800/40 text-slate-500 border-slate-800 hover:bg-slate-800'
            }`}
            title={soundEnabled ? t.soundOn : t.soundOff}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-all hover:scale-105"
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-500" />}
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-slate-900/90 rounded-xl p-0.5 border border-slate-700/80">
            <Globe className="w-3.5 h-3.5 text-slate-400 mx-1.5 hidden sm:inline" />
            {(['ar', 'en', 'tr']).map((l) => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === l
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-2 animate-in fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.unlocked && scrollTo(item.id)}
              disabled={!item.unlocked}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                activeSection === item.id
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : item.unlocked
                  ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  : 'bg-slate-950 text-slate-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {item.label}
              {!item.unlocked && '🔒'}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
