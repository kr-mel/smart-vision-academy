import React from 'react';
import { Eye, Heart, BookOpen, Terminal, Sparkles } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export function Footer({ t, onResetProgress }) {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#05070e] text-slate-400 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">{t.appTitle}</h4>
            <p className="text-xs text-slate-500">{t.footer.courseName}</p>
          </div>
        </div>

        {/* Middle: Credits and pedagogy */}
        <p className="text-xs text-center md:text-start max-w-md text-slate-400 leading-relaxed">
          {t.footer.madeWith}
        </p>

        {/* Right: Reset Progress Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('هل تريد فعلاً إعادة ضبط التقدم والمستويات من البداية؟')) {
                soundFX.playClick();
                onResetProgress();
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all"
          >
            {t.resetProgress}
          </button>
        </div>
      </div>
    </footer>
  );
}
