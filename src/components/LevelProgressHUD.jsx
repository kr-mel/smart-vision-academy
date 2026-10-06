import React from 'react';
import { Trophy, Flame, CheckCircle2, Lock, Sparkles, BookOpen } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export function LevelProgressHUD({
  t,
  unlockedLevels,
  xp,
  activeSection,
  setActiveSection,
  streak = 3
}) {
  const levels = [
    { num: 1, id: 'level1', title: t.level1.badge, icon: '👾' },
    { num: 2, id: 'level2', title: t.level2.badge, icon: '🎨' },
    { num: 3, id: 'level3', title: t.level3.badge, icon: '📊' },
    { num: 4, id: 'level4', title: t.level4.badge, icon: '🌀' },
    { num: 5, id: 'level5', title: t.level5.badge, icon: '⚡' },
    { num: 6, id: 'level6', title: t.level6.badge, icon: '🔷' },
  ];

  const maxLevel = 6;
  const progressPercent = Math.min(100, Math.round(((unlockedLevels.length) / maxLevel) * 100));

  const handleLevelClick = (lvl) => {
    if (unlockedLevels.includes(lvl.num)) {
      soundFX.playClick();
      setActiveSection(lvl.id);
      const el = document.getElementById(lvl.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      soundFX.playError();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="glass-panel-glow rounded-2xl p-4 md:p-6 border border-cyan-500/30 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Left stats info */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-neon-cyan">
                🚀
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-200">
                    {t.appTitle}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono">
                    {progressPercent}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {unlockedLevels.length} / {maxLevel} {t.level} مفتوح
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Streak & XP Counters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span className="text-slate-400">{t.streak}:</span>
                <span className="font-bold text-orange-400 font-mono">{streak} 🔥</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <Trophy className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-slate-400">{t.xp}:</span>
                <span className="font-bold text-yellow-400 font-mono">{xp} XP</span>
              </div>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="flex-1 max-w-md w-full">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span>{t.unlockNext}</span>
              <span className="text-cyan-400 font-mono">{unlockedLevels.length}/{maxLevel}</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 shadow-neon-cyan transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level Map Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-800/80">
          {levels.map((lvl) => {
            const isUnlocked = unlockedLevels.includes(lvl.num);
            const isActive = activeSection === lvl.id;
            return (
              <button
                key={lvl.num}
                onClick={() => handleLevelClick(lvl)}
                className={`p-2.5 rounded-xl border text-right sm:text-start transition-all flex items-center justify-between gap-2 group ${
                  isActive
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-neon-cyan scale-[1.02]'
                    : isUnlocked
                    ? 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:bg-slate-850'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-lg group-hover:scale-110 transition-transform">{lvl.icon}</span>
                  <div className="truncate">
                    <span className="block text-[11px] font-bold truncate">
                      {t.level} {lvl.num}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {isUnlocked ? (isActive ? '● جاري الآن' : 'مفتوح') : 'مغلق'}
                    </span>
                  </div>
                </div>
                {isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
