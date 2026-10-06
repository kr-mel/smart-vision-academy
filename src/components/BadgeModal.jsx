import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export function BadgeModal({ isOpen, onClose, unlockedLevels, xp, t }) {
  if (!isOpen) return null;

  const badges = [
    {
      id: 1,
      title: 'رائد المصفوفات (Matrix Pioneer)',
      desc: 'أكمل المستوى 1 وفهم مصفوفة البكسلات 2D وعلاقة الأرقام بالضوء.',
      icon: '👾',
      levelReq: 1,
      xpValue: 100
    },
    {
      id: 2,
      title: 'خبير الألوان (Color Alchemist)',
      desc: 'أكمل المستوى 2 وأتقن تفكيك قنوات RGB ومعادلة Luminance.',
      icon: '🎨',
      levelReq: 2,
      xpValue: 100
    },
    {
      id: 3,
      title: 'حكيم الهيستوجرام (Histogram Guru)',
      desc: 'أكمل المستوى 3 وتعلّم قراءة بصمة الإضاءة والتحويلات النقطية.',
      icon: '📊',
      levelReq: 3,
      xpValue: 100
    },
    {
      id: 4,
      title: 'ساحر النواة (Kernel Sorcerer)',
      desc: 'أكمل المستوى 4 واستوعب سحر الالتفاف 3×3 وقوة Median Filter.',
      icon: '🌀',
      levelReq: 4,
      xpValue: 100
    },
    {
      id: 5,
      title: 'محقق الحواف (Edge Detective)',
      desc: 'أكمل المستوى 5 وسيطر على مشتقات Sobel وخوارزمية Canny.',
      icon: '⚡',
      levelReq: 5,
      xpValue: 100
    },
    {
      id: 6,
      title: 'مهندس الأشكال (Morphology Architect)',
      desc: 'أكمل المستوى 6 وأتقن عمليات التآكل والتمدد والفتح والإغلاق.',
      icon: '🔷',
      levelReq: 6,
      xpValue: 100
    },
    {
      id: 7,
      title: 'مهندس الرؤية المعتمد (Master Vision Engineer)',
      desc: 'أتم كامل مستويات كورس YZM 309 بنجاح وتخرج بمرتبة الشرف!',
      icon: '🎓',
      levelReq: 7, // when all 6 are completed
      xpValue: 200
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d18] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-neon-cyan max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute top-6 left-6 sm:left-8 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shadow-neon-amber">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{t.badges}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                {xp} XP
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              اجمع كل الأوسمة بإكمال التحديات العملية في كل مستوى دراسي!
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {badges.map((badge) => {
            const isUnlocked =
              badge.levelReq === 7
                ? unlockedLevels.length >= 6
                : unlockedLevels.includes(badge.levelReq);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-cyan-500/40 shadow-neon-cyan'
                    : 'bg-slate-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {badge.desc}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    +{badge.xpValue} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
