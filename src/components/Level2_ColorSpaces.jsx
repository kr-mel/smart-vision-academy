import React, { useState, useEffect, useRef } from 'react';
import { Palette, Layers, CheckCircle2, Sparkles, Sliders, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import { drawPresetSample, isolateChannel, toGrayscale } from '../utils/imageAlgorithms';

export function Level2_ColorSpaces({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';

  const [activeChannel, setActiveChannel] = useState('all');
  const canvasRef = useRef(null);

  const [mixR, setMixR] = useState(255);
  const [mixG, setMixG] = useState(180);
  const [mixB, setMixB] = useState(0);

  const calculatedGray = Math.round(0.299 * mixR + 0.587 * mixG + 0.114 * mixB);

  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    drawPresetSample(canvas, 'robot');

    if (activeChannel !== 'all') {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (activeChannel === 'gray') {
        toGrayscale(imgData);
      } else {
        isolateChannel(imgData, activeChannel);
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [activeChannel]);

  const handleQuizSubmit = () => {
    if (q1Selected === 1) {
      soundFX.playSuccess();
      soundFX.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setQuizSubmitted(true);
      onCompleteLevel(2, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level2" className="py-16 px-4 max-w-7xl mx-auto space-y-10">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-400 text-xs font-bold shadow-neon-purple">
          <Palette className="w-4 h-4" />
          <span>{t.level2.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level2.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level2.desc}
        </p>
      </div>

      {/* Everyday Life Analogy Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/50 via-slate-900 to-slate-900 border-2 border-purple-500/40 shadow-neon-purple space-y-4">
        <div className="flex items-center gap-3 text-purple-300 font-bold text-base sm:text-lg">
          <Lightbulb className="w-6 h-6 text-amber-400 animate-bounce" />
          <span>{t.level2.analogyTitle}</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {t.level2.analogyDesc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 text-xs">
            <span className="font-bold text-rose-400 block mb-1">🔴 كشاف الأحمر (Red)</span>
            يتحكم بكمية الضوء الأحمر المنبعث من البكسل (من 0 إلى 255).
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
            <span className="font-bold text-emerald-400 block mb-1">🟢 كشاف الأخضر (Green)</span>
            عينك حساسة جداً للون الأخضر، فله أكبر أثر على وضوح الصورة!
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 text-xs">
            <span className="font-bold text-blue-400 block mb-1">🔵 كشاف الأزرق (Blue)</span>
            الكشاف الثالث المكمل.. مزج التلاتة يصنع 16 مليون لون!
          </div>
        </div>
      </div>

      {/* Interactive Tool 1: Channel Isolator */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              {t.level2.splitterTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level2.splitterDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t.level2.allChannels },
              { id: 'r', label: t.level2.redOnly },
              { id: 'g', label: t.level2.greenOnly },
              { id: 'b', label: t.level2.blueOnly },
              { id: 'gray', label: t.level2.grayscaleOnly },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveChannel(btn.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeChannel === btn.id
                    ? 'bg-purple-600 border-purple-400 text-white shadow-neon-purple font-black scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-3 bg-slate-950 rounded-3xl border border-purple-500/40 shadow-neon-purple relative">
              <canvas
                ref={canvasRef}
                className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#04060c] border border-cyan-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 block">
                {t.level2.grayFormulaTitle}
              </span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs sm:text-sm font-bold text-emerald-400">
                {t.level2.grayFormulaMath}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.level2.grayFormulaExplain}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool 2: Color Mixer */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border-cyan-500/20 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-teal-400" />
          لعبة مزج الكشافات (شغل الكشافات وشوف اللون الناتج فوراً!)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-rose-400">
                <span>🔴 كشاف الأحمر:</span>
                <span className="font-mono">{mixR}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixR}
                onChange={(e) => setMixR(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-emerald-400">
                <span>🟢 كشاف الأخضر:</span>
                <span className="font-mono">{mixG}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixG}
                onChange={(e) => setMixG(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-blue-400">
                <span>🔵 كشاف الأزرق:</span>
                <span className="font-mono">{mixB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixB}
                onChange={(e) => setMixB(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl"
                style={{ backgroundColor: `rgb(${mixR}, ${mixG}, ${mixB})` }}
              />
              <span className="text-xs font-bold text-slate-300">اللون على الشاشة</span>
            </div>

            <span className="text-2xl text-slate-600 font-bold">➔</span>

            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl flex items-center justify-center font-mono font-bold text-xs"
                style={{
                  backgroundColor: `rgb(${calculatedGray}, ${calculatedGray}, ${calculatedGray})`,
                  color: calculatedGray > 128 ? '#000' : '#fff'
                }}
              >
                {calculatedGray}
              </div>
              <span className="text-xs font-bold text-cyan-400">النسخة الرمادية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Mission Quiz */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            🎨
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level2.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن التحدي البسيط لفتح المرحلة 3 فوراً!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level2.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level2.q1_opt1, exp: t.level2.q1_opt1_exp, correct: true },
              { id: 2, text: t.level2.q1_opt2, exp: t.level2.q1_opt2_exp },
              { id: 3, text: t.level2.q1_opt3, exp: t.level2.q1_opt3_exp }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundFX.playClick();
                  setQ1Selected(opt.id);
                }}
                className={`p-3.5 rounded-xl border text-start text-xs font-semibold transition-all ${
                  q1Selected === opt.id
                    ? opt.correct && quizSubmitted
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                      : !opt.correct && quizSubmitted
                      ? 'bg-rose-950 border-rose-400 text-rose-300'
                      : 'bg-purple-950 border-purple-400 text-purple-300 shadow-neon-purple'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt.text}</span>
                {quizSubmitted && q1Selected === opt.id && (
                  <p className="mt-2 text-[11px] font-normal opacity-90">{opt.exp}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={handleQuizSubmit}
            disabled={!q1Selected}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              q1Selected
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-neon-purple cursor-pointer hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تأكيد الإجابة وفتح المرحلة 3 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المرحلة 3 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
