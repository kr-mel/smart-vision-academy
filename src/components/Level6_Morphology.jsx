import React, { useState, useEffect, useRef } from 'react';
import { Shapes, Minimize2, Maximize2, RefreshCw, CheckCircle2, Sparkles, Binary } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import {
  drawPresetSample,
  applyErosion,
  applyDilation,
  applyThreshold,
  toGrayscale
} from '../utils/imageAlgorithms';

export function Level6_Morphology({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';
  const morphCanvasRef = useRef(null);

  const [operationCount, setOperationCount] = useState(0);
  const [lastOp, setLastOp] = useState('original');

  // Quiz state
  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Initial draw: draw binary shapes with test noise
  const drawBaseShapes = () => {
    const canvas = morphCanvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    // Draw high-contrast shapes
    drawPresetSample(canvas, 'shapes');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    toGrayscale(imgData);
    applyThreshold(imgData, 128); // Pure binary 0 or 255

    // Add tiny noise dots & a hole
    const data = imgData.data;
    const w = canvas.width;

    // Small isolated noise dots
    const noiseCoords = [
      [40, 50], [50, 40], [240, 50], [250, 60], [140, 20], [130, 250]
    ];
    noiseCoords.forEach(([nx, ny]) => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((ny + dy) * w + (nx + dx)) * 4;
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
        }
      }
    });

    // Small black hole inside square
    const hx = 190, hy = 90;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const idx = ((hy + dy) * w + (hx + dx)) * 4;
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setLastOp('original');
  };

  useEffect(() => {
    drawBaseShapes();
  }, []);

  const handleErosion = () => {
    soundFX.playClick();
    const canvas = morphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyErosion(imgData, 1);
    ctx.putImageData(imgData, 0, 0);
    setLastOp('erosion');
    setOperationCount((c) => c + 1);
  };

  const handleDilation = () => {
    soundFX.playClick();
    const canvas = morphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyDilation(imgData, 1);
    ctx.putImageData(imgData, 0, 0);
    setLastOp('dilation');
    setOperationCount((c) => c + 1);
  };

  const handleOpening = () => {
    soundFX.playClick();
    const canvas = morphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyErosion(imgData, 1);
    applyDilation(imgData, 1);
    ctx.putImageData(imgData, 0, 0);
    setLastOp('opening');
    setOperationCount((c) => c + 1);
  };

  const handleClosing = () => {
    soundFX.playClick();
    const canvas = morphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyDilation(imgData, 1);
    applyErosion(imgData, 1);
    ctx.putImageData(imgData, 0, 0);
    setLastOp('closing');
    setOperationCount((c) => c + 1);
  };

  const handleQuizSubmit = () => {
    if (q1Selected === 2) {
      soundFX.playSuccess();
      soundFX.playLevelUp();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      setQuizSubmitted(true);
      onCompleteLevel(6, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level6" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-400 text-xs font-bold shadow-neon-purple">
          <Shapes className="w-4 h-4" />
          <span>{t.level6.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level6.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level6.desc}
        </p>
      </div>

      {/* Morphological Concepts 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Minimize2 className="w-4 h-4" />
            <span>التآكل (Erosion - ⊖)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            يأكل حدود الأشكال البيضاء، مما يقلص حجمها ويمحو النقاط الصغيرة المعزولة تماماً.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Maximize2 className="w-4 h-4" />
            <span>التمدد (Dilation - ⊕)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            يضيف بكسلات على حدود الأشكال البيضاء، فيسد الثقوب الداخلية ويوصل الشقوق المفصولة.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-cyan-500/30 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Binary className="w-4 h-4" />
            <span>الفتح (Opening: ⊖ ➔ ⊕)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            تآكل يليه تمدد؛ يزيل الشوائب الخارجية والنتوءات الصغيرة دون تقليص حجم الجسم الأصلي.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Binary className="w-4 h-4" />
            <span>الإغلاق (Closing: ⊕ ➔ ⊖)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            تمدد يليه تآكل؛ يسد الفجوات والثقوب الداخلية الدقيقة دون تضخيم الجسم الأصلي.
          </p>
        </div>
      </div>

      {/* Interactive Morphology Studio */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shapes className="w-5 h-5 text-purple-400" />
              {t.level6.morphInteractiveTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level6.drawShapeHint}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleErosion}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 text-xs font-bold transition-all"
            >
              {t.level6.applyErosionBtn}
            </button>

            <button
              onClick={handleDilation}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-bold transition-all"
            >
              {t.level6.applyDilationBtn}
            </button>

            <button
              onClick={handleOpening}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold transition-all"
            >
              {t.level6.applyOpeningBtn}
            </button>

            <button
              onClick={handleClosing}
              className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 text-xs font-bold transition-all"
            >
              {t.level6.applyClosingBtn}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                drawBaseShapes();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title={t.level6.resetShapes}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Canvas Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-3 bg-slate-950 rounded-3xl border border-purple-500/40 shadow-neon-purple relative">
              <canvas
                ref={morphCanvasRef}
                className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
              />
              <span className="absolute bottom-5 left-5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-purple-300 border border-slate-800">
                آخر عملية: {lastOp.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Observations and Instructions */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-[#04060c] border border-cyan-500/30 space-y-2 font-mono">
              <span className="text-cyan-400 font-bold block text-xs">
                # Structuring Element 3×3 Cross:
              </span>
              <div className="text-emerald-400 text-xs">
                kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="font-bold text-white block text-sm">💡 تجارب بصرية ممتعة قم بها الآن:</span>
              <ul className="space-y-1.5 text-slate-400 text-xs list-disc list-inside">
                <li>
                  انقر على <b>الفتح (Opening)</b>: لاحظ كيف تختفي النقاط المعزولة الشاردة على الفور مع بقاء الأشكال الأصلية!
                </li>
                <li>
                  انقر على <b>الإغلاق (Closing)</b>: لاحظ كيف يُسد الثقب الأسود الموجود داخل المربع تلقائياً!
                </li>
                <li>
                  انقر على <b>التآكل (Erosion)</b> عدة مرات متتالية لمشاهدة انكماش الأشكال حتى تتلاشى.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Quiz Mission to Complete Course */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            🏆
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level6.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن السؤال الأخير لفتح وسام التخرج وكسب +100 XP!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level6.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level6.q1_opt1, exp: t.level6.q1_opt1_exp },
              { id: 2, text: t.level6.q1_opt2, exp: t.level6.q1_opt2_exp, correct: true },
              { id: 3, text: t.level6.q1_opt3, exp: t.level6.q1_opt3_exp }
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
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-neon-purple cursor-pointer hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>إتمام التحدي والتخرج بامتياز 🎓</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> مبارك! أكملت جميع مستويات المادة بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
