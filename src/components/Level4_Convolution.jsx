import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, Pause, SkipForward, SkipBack, ShieldAlert, Sparkles, CheckCircle2, RefreshCw, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import {
  drawPresetSample,
  applyConvolution,
  addSaltAndPepper,
  applyMedianFilter
} from '../utils/imageAlgorithms';

export function Level4_Convolution({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';
  const filterCanvasRef = useRef(null);

  const [selectedKernelType, setSelectedKernelType] = useState('box');
  const [kernelPos, setKernelPos] = useState({ r: 1, c: 1 });
  const [isPlayingSim, setIsPlayingSim] = useState(false);

  const [activeFilterName, setActiveFilterName] = useState('original');
  const [noiseDensity, setNoiseDensity] = useState(0.08);

  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const sampleMatrix = [
    [100, 100, 100, 100, 100],
    [100, 200, 200, 200, 100],
    [100, 200,  50, 200, 100],
    [100, 200, 200, 200, 100],
    [100, 100, 100, 100, 100],
  ];

  const kernels = {
    box: {
      name: 'فلتر التنعيم البسيط (Box Blur)',
      weights: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      divisor: 9,
      offset: 0
    },
    gaussian: {
      name: 'فلتر التنعيم الطبيعي (Gaussian)',
      weights: [1, 2, 1, 2, 4, 2, 1, 2, 1],
      divisor: 16,
      offset: 0
    },
    sharpen: {
      name: 'فلتر زيادة الحدة (Sharpen)',
      weights: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      divisor: 1,
      offset: 0
    },
    ridge: {
      name: 'فلتر كشف الخطوط (Ridge)',
      weights: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      divisor: 1,
      offset: 0
    }
  };

  const activeKernel = kernels[selectedKernelType];

  const calculateStep = () => {
    let sum = 0;
    const kr = kernelPos.r;
    const kc = kernelPos.c;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const imgVal = sampleMatrix[kr + dr][kc + dc];
        const kWeight = activeKernel.weights[(dr + 1) * 3 + (dc + 1)];
        sum += imgVal * kWeight;
      }
    }
    const finalVal = Math.min(255, Math.max(0, Math.round(sum / activeKernel.divisor) + activeKernel.offset));
    return { sum, finalVal };
  };

  const stepResult = calculateStep();

  useEffect(() => {
    let timer;
    if (isPlayingSim) {
      timer = setInterval(() => {
        setKernelPos((prev) => {
          let nextC = prev.c + 1;
          let nextR = prev.r;
          if (nextC > 3) {
            nextC = 1;
            nextR = prev.r + 1;
            if (nextR > 3) nextR = 1;
          }
          return { r: nextR, c: nextC };
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlayingSim]);

  const redrawFilterCanvas = (action = 'original') => {
    const canvas = filterCanvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    drawPresetSample(canvas, 'robot');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (action === 'noise') {
      addSaltAndPepper(imgData, noiseDensity);
      setActiveFilterName('noise');
    } else if (action === 'boxBlur') {
      addSaltAndPepper(imgData, noiseDensity);
      applyConvolution(imgData, kernels.box.weights, kernels.box.divisor);
      setActiveFilterName('boxBlur');
    } else if (action === 'median') {
      addSaltAndPepper(imgData, noiseDensity);
      applyMedianFilter(imgData, 3);
      setActiveFilterName('median');
    } else {
      setActiveFilterName('original');
    }

    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    redrawFilterCanvas('original');
  }, []);

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
      onCompleteLevel(4, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level4" className="py-16 px-4 max-w-7xl mx-auto space-y-10">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold shadow-neon-cyan">
          <Cpu className="w-4 h-4" />
          <span>{t.level4.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level4.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level4.desc}
        </p>
      </div>

      {/* Everyday Life Analogy Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border-2 border-cyan-500/40 shadow-neon-cyan space-y-4">
        <div className="flex items-center gap-3 text-cyan-300 font-bold text-base sm:text-lg">
          <Lightbulb className="w-6 h-6 text-amber-400 animate-bounce" />
          <span>{t.level4.analogyTitle}</span>
        </div>
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
          {t.level4.analogyDesc}
        </p>
      </div>

      {/* Interactive Tool 1: Step-by-Step Kernel */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              {t.level4.kernelVisualizerTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              المربع الملون بيمشي ع البكسلات ويسأل الجيران ليحسب اللون الجديد!
            </p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {Object.keys(kernels).map((kKey) => (
              <button
                key={kKey}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedKernelType(kKey);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedKernelType === kKey
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {kKey.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-center gap-4">
            <div className="relative p-4 bg-slate-950 rounded-3xl border border-cyan-500/40 shadow-neon-cyan">
              <div className="grid grid-cols-5 gap-2 w-64 sm:w-72 aspect-square">
                {sampleMatrix.map((row, r) =>
                  row.map((val, c) => {
                    const insideKernel =
                      Math.abs(r - kernelPos.r) <= 1 && Math.abs(c - kernelPos.c) <= 1;
                    const isCenter = r === kernelPos.r && c === kernelPos.c;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all select-none ${
                          isCenter
                            ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/50 shadow-neon-cyan scale-110 z-20 font-black'
                            : insideKernel
                            ? 'bg-cyan-950/90 text-cyan-200 border-2 border-cyan-400/80 z-10'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setKernelPos((p) => ({
                    r: p.c === 1 ? (p.r === 1 ? 3 : p.r - 1) : p.r,
                    c: p.c === 1 ? 3 : p.c - 1
                  }));
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsPlayingSim(!isPlayingSim);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-neon-cyan"
              >
                {isPlayingSim ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingSim ? 'إيقاف' : 'تشغيل الحركة'}</span>
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setKernelPos((p) => ({
                    r: p.c === 3 ? (p.r === 3 ? 1 : p.r + 1) : p.r,
                    c: p.c === 3 ? 1 : p.c + 1
                  }));
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-[#04060c] border border-cyan-500/30 space-y-3 shadow-inner">
              <span className="font-bold text-cyan-400 text-xs block">
                {activeKernel.name}
              </span>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                القيمة الجديدة للبكسل بعد استشارة الجيران: <b className="text-emerald-400 text-sm">{stepResult.finalVal}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool 2: Salt & Pepper vs Median */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              {t.level4.medianFilterTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level4.medianDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                redrawFilterCanvas('noise');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
            >
              {t.level4.addNoiseBtn}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                redrawFilterCanvas('boxBlur');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold"
            >
              تنعيم عادي (بفشل وبغَبّش) 🌫️
            </button>

            <button
              onClick={() => {
                soundFX.playSuccess();
                redrawFilterCanvas('median');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-neon-emerald hover:bg-emerald-400"
            >
              {t.level4.applyMedianBtn}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                redrawFilterCanvas('original');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-3 bg-slate-950 rounded-3xl border border-amber-500/40 shadow-neon-amber">
            <canvas
              ref={filterCanvasRef}
              className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Gamified Mission Quiz */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
            🌀
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level4.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن التحدي البسيط لفتح المرحلة 5 فوراً!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level4.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level4.q1_opt1, exp: t.level4.q1_opt1_exp, correct: true },
              { id: 2, text: t.level4.q1_opt2, exp: t.level4.q1_opt2_exp },
              { id: 3, text: t.level4.q1_opt3, exp: t.level4.q1_opt3_exp }
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
            <span>تأكيد الإجابة وفتح المرحلة 5 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المرحلة 5 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
