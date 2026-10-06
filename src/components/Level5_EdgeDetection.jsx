import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import { drawPresetSample, applySobel, applyCanny, toGrayscale } from '../utils/imageAlgorithms';

export function Level5_EdgeDetection({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';
  const edgeCanvasRef = useRef(null);

  const [edgeMode, setEdgeMode] = useState('canny');
  const [lowThresh, setLowThresh] = useState(25);
  const [highThresh, setHighThresh] = useState(65);

  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const canvas = edgeCanvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    drawPresetSample(canvas, 'robot');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (edgeMode === 'sobel') {
      applySobel(imgData);
    } else if (edgeMode === 'canny') {
      applyCanny(imgData, lowThresh, highThresh);
    } else {
      toGrayscale(imgData);
    }

    ctx.putImageData(imgData, 0, 0);
  }, [edgeMode, lowThresh, highThresh]);

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
      onCompleteLevel(5, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level5" className="py-16 px-4 max-w-7xl mx-auto space-y-10">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold shadow-neon-cyan">
          <Zap className="w-4 h-4" />
          <span>{t.level5.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level5.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level5.desc}
        </p>
      </div>

      {/* Everyday Life Analogy Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border-2 border-cyan-500/40 shadow-neon-cyan space-y-4">
        <div className="flex items-center gap-3 text-cyan-300 font-bold text-base sm:text-lg">
          <Lightbulb className="w-6 h-6 text-amber-400 animate-bounce" />
          <span>{t.level5.analogyTitle}</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {t.level5.analogyDesc}
        </p>
      </div>

      {/* Interactive Tool: Edge Detection Studio */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              مختبر صيد الحواف (جرب بنفسك!)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              بدّل بين الكواشف وشوف كيف خطوط الوجه والمجسم بتطلع نظيفة ودقيقة!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'canny', label: t.level5.applyCannyBtn },
              { id: 'sobel', label: t.level5.applySobelBtn },
              { id: 'original', label: 'الصورة الأصلية' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  soundFX.playClick();
                  setEdgeMode(btn.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  edgeMode === btn.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-neon-cyan border-cyan-400 scale-105'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-3 bg-slate-950 rounded-3xl border border-cyan-500/40 shadow-neon-cyan">
              <canvas
                ref={edgeCanvasRef}
                className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {edgeMode === 'canny' && (
              <div className="p-5 rounded-2xl bg-[#04060c] border border-cyan-500/30 space-y-4 shadow-inner">
                <span className="text-xs font-bold text-cyan-400 block">
                  {t.level5.interactiveCanny}
                </span>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{t.level5.lowThresh}</span>
                    <span className="font-mono text-cyan-400">{lowThresh}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={lowThresh}
                    onChange={(e) => setLowThresh(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">{t.level5.highThresh}</span>
                    <span className="font-mono text-emerald-400">{highThresh}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={highThresh}
                    onChange={(e) => setHighThresh(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gamified Mission Quiz */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level5.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن التحدي البسيط لفتح المرحلة 6 فوراً!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level5.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level5.q1_opt1, exp: t.level5.q1_opt1_exp, correct: true },
              { id: 2, text: t.level5.q1_opt2, exp: t.level5.q1_opt2_exp },
              { id: 3, text: t.level5.q1_opt3, exp: t.level5.q1_opt3_exp }
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
                      : 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-neon-cyan'
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
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-neon-cyan cursor-pointer hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تأكيد الإجابة وفتح المرحلة 6 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المرحلة 6 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
