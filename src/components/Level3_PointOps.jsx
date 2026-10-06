import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Sliders, Wand2, RefreshCw, CheckCircle2, Sparkles, Sun, Contrast, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import {
  drawPresetSample,
  adjustBrightness,
  adjustContrast,
  applyThreshold,
  invertImage,
  computeHistogram,
  equalizeHistogram
} from '../utils/imageAlgorithms';

export function Level3_PointOps({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';

  const imgCanvasRef = useRef(null);
  const histCanvasRef = useRef(null);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1.0);
  const [thresholdEnabled, setThresholdEnabled] = useState(false);
  const [thresholdVal, setThresholdVal] = useState(128);
  const [isInverted, setIsInverted] = useState(false);
  const [isEqualized, setIsEqualized] = useState(false);

  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const imgCanvas = imgCanvasRef.current;
    const histCanvas = histCanvasRef.current;
    if (!imgCanvas || !histCanvas) return;

    imgCanvas.width = 280;
    imgCanvas.height = 280;
    const ctx = imgCanvas.getContext('2d');

    drawPresetSample(imgCanvas, 'coins');
    let imgData = ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);

    if (brightness !== 0) adjustBrightness(imgData, brightness);
    if (contrast !== 1.0) adjustContrast(imgData, contrast);
    if (isInverted) invertImage(imgData);
    if (isEqualized) equalizeHistogram(imgData);
    if (thresholdEnabled) applyThreshold(imgData, thresholdVal);

    ctx.putImageData(imgData, 0, 0);

    const { gray } = computeHistogram(imgData);
    const hctx = histCanvas.getContext('2d');
    histCanvas.width = 280;
    histCanvas.height = 100;

    hctx.fillStyle = '#060912';
    hctx.fillRect(0, 0, histCanvas.width, histCanvas.height);

    const maxFreq = Math.max(...gray, 1);
    const barWidth = histCanvas.width / 256;

    const gradient = hctx.createLinearGradient(0, histCanvas.height, 0, 0);
    gradient.addColorStop(0, '#00f2fe');
    gradient.addColorStop(1, '#10b981');
    hctx.fillStyle = gradient;

    for (let i = 0; i < 256; i++) {
      const barHeight = (gray[i] / maxFreq) * (histCanvas.height - 8);
      const x = i * barWidth;
      const y = histCanvas.height - barHeight;
      hctx.fillRect(x, y, barWidth, barHeight);
    }
  }, [brightness, contrast, thresholdEnabled, thresholdVal, isInverted, isEqualized]);

  const resetAll = () => {
    soundFX.playClick();
    setBrightness(0);
    setContrast(1.0);
    setThresholdEnabled(false);
    setThresholdVal(128);
    setIsInverted(false);
    setIsEqualized(false);
  };

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
      onCompleteLevel(3, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level3" className="py-16 px-4 max-w-7xl mx-auto space-y-10">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-neon-emerald">
          <BarChart3 className="w-4 h-4" />
          <span>{t.level3.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level3.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level3.desc}
        </p>
      </div>

      {/* Everyday Life Analogy Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border-2 border-emerald-500/40 shadow-neon-emerald space-y-4">
        <div className="flex items-center gap-3 text-emerald-300 font-bold text-base sm:text-lg">
          <Lightbulb className="w-6 h-6 text-amber-400 animate-bounce" />
          <span>{t.level3.analogyTitle}</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {t.level3.analogyDesc}
        </p>
      </div>

      {/* Interactive Tool: Live Image & Dynamic Histogram */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              {t.level3.interactiveTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level3.interactiveDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsInverted(!isInverted);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isInverted
                  ? 'bg-purple-600 border-purple-400 text-white shadow-neon-purple'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-purple-400'
              }`}
            >
              {t.level3.invertBtn}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setIsEqualized(!isEqualized);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                isEqualized
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-neon-emerald'
                  : 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-emerald-400'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{t.level3.equalizeBtn}</span>
            </button>

            <button
              onClick={resetAll}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="إعادة ضبط"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col items-center gap-4">
            <div className="p-3 bg-slate-950 rounded-3xl border border-emerald-500/40 shadow-neon-emerald">
              <canvas
                ref={imgCanvasRef}
                className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
              />
            </div>

            <div className="w-64 sm:w-72 bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>0 (عتمة)</span>
                <span className="text-cyan-400 font-bold">ميزان الإضاءة (Histogram)</span>
                <span>255 (بياض)</span>
              </div>
              <canvas
                ref={histCanvasRef}
                className="rounded-xl w-full h-20 shadow-inner"
              />
              <span className="text-[10px] text-slate-400 block text-center">
                {t.level3.histExplanation}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4" />
                  {t.level3.brightnessLabel}
                </span>
                <span className="font-mono text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {brightness > 0 ? `+${brightness}` : brightness}
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Contrast className="w-4 h-4" />
                  {t.level3.contrastLabel}
                </span>
                <span className="font-mono text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {contrast.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="threshCheck"
                    checked={thresholdEnabled}
                    onChange={(e) => {
                      soundFX.playClick();
                      setThresholdEnabled(e.target.checked);
                    }}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="threshCheck" className="text-amber-400 cursor-pointer">
                    تحويل الصورة لأبيض وأسود صريح فقط
                  </label>
                </div>
                <span className="font-mono text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {thresholdVal}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                disabled={!thresholdEnabled}
                value={thresholdVal}
                onChange={(e) => setThresholdVal(Number(e.target.value))}
                className={`w-full h-2 bg-slate-800 rounded-lg accent-amber-500 ${
                  !thresholdEnabled && 'opacity-40 cursor-not-allowed'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Mission Quiz */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level3.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن التحدي البسيط لفتح المرحلة 4 فوراً!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level3.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level3.q1_opt1, exp: t.level3.q1_opt1_exp, correct: true },
              { id: 2, text: t.level3.q1_opt2, exp: t.level3.q1_opt2_exp },
              { id: 3, text: t.level3.q1_opt3, exp: t.level3.q1_opt3_exp }
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
                      : 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-neon-emerald'
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
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-neon-emerald cursor-pointer hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تأكيد الإجابة وفتح المرحلة 4 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المرحلة 4 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
