import React, { useState, useEffect, useRef } from 'react';
import { Palette, Layers, CheckCircle2, Sparkles, Sliders, Info, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';
import { drawPresetSample, isolateChannel, toGrayscale } from '../utils/imageAlgorithms';

export function Level2_ColorSpaces({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';

  // Channel splitter mode: 'all' | 'r' | 'g' | 'b' | 'gray'
  const [activeChannel, setActiveChannel] = useState('all');
  const canvasRef = useRef(null);

  // RGB color mixer sliders
  const [mixR, setMixR] = useState(230);
  const [mixG, setMixG] = useState(80);
  const [mixB, setMixB] = useState(180);

  // Calculated Grayscale luminance
  const calculatedGray = Math.round(0.299 * mixR + 0.587 * mixG + 0.114 * mixB);

  // Quiz state
  const [q1Selected, setQ1Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Render sample on canvas whenever channel changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    // 1. Draw base vibrant test scene
    drawPresetSample(canvas, 'robot');

    // 2. Manipulate channels if needed
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
    if (q1Selected === 2) {
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
    <section id="level2" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
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

      {/* Concept Breakdown: 3 Channels Tensor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border-rose-500/30 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
            <span>قناة الأحمر (Red Channel)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            مصفوفة ثنائية الأبعاد تحدد كمية اللون الأحمر المنبعث من شاشتك لكل بكسل (0 - 255).
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <span>قناة الأخضر (Green Channel)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            العين البشرية بالغة الحساسية للضوء الأخضر، لذا يمتلك أعلى وزن في حسابات الرؤية!
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border-blue-500/30 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
            <span>قناة الأزرق (Blue Channel)</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            المصفوفة الثالثة المسؤولة عن الضوء الأزرق؛ دمج القنوات الثلاث يصنع 16.7 مليون لون.
          </p>
        </div>
      </div>

      {/* Interactive Tool 1: Channel Isolator & Splitter */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              {t.level2.splitterTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level2.splitterDesc}</p>
          </div>

          {/* Mode Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t.level2.allChannels, color: 'text-white border-slate-700' },
              { id: 'r', label: t.level2.redOnly, color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
              { id: 'g', label: t.level2.greenOnly, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
              { id: 'b', label: t.level2.blueOnly, color: 'text-blue-400 border-blue-500/40 bg-blue-950/30' },
              { id: 'gray', label: t.level2.grayscaleOnly, color: 'text-slate-300 border-slate-600 bg-slate-900' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  soundFX.playClick();
                  setActiveChannel(btn.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${btn.color} ${
                  activeChannel === btn.id
                    ? 'ring-2 ring-cyan-400 scale-105 shadow-neon-cyan font-black'
                    : 'hover:opacity-90'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Canvas Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="p-3 bg-slate-950 rounded-3xl border border-purple-500/40 shadow-neon-purple relative">
              <canvas
                ref={canvasRef}
                className="rounded-2xl w-64 h-64 sm:w-72 sm:h-72 shadow-inner"
              />
              <span className="absolute bottom-5 left-5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 border border-slate-800">
                Mode: {activeChannel.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Explanation & Grayscale Formula Deep Dive */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#04060c] border border-cyan-500/30 space-y-2.5">
              <span className="text-xs font-bold text-cyan-400 block">
                {t.level2.grayFormulaTitle}
              </span>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center font-mono text-sm sm:text-base font-bold text-emerald-400">
                {t.level2.grayFormulaMath}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.level2.grayFormulaExplain}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
              <span className="font-bold text-slate-200 block text-sm">💡 ما هو فضاء HSV / HSI؟</span>
              <p className="leading-relaxed">
                في خوارزميات الرؤية الحديثة، نفضل أحياناً تحويل RGB إلى <b>HSV (Hue, Saturation, Value)</b>:
                حيث يمثل <b>Hue</b> نوع اللون النقي (مثل درجة الأحمر أو الأصفر)، ويمثل <b>Saturation</b> نقاء وتشبع اللون، بينما يمثل <b>Value</b> الإضاءة. هذا يسمح بالتعرف على الألوان حتى لو تغيرت إضاءة الغرفة!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool 2: The RGB Color Mixer & Luminance Calculator */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border-cyan-500/20 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-teal-400" />
          مختبر مزج الألوان وحساب الشدة اللحظي (Luminance Lab)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5">
            {/* Red slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-rose-400">أحمر (R):</span>
                <span className="font-mono text-white">{mixR}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixR}
                onChange={(e) => setMixR(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Green slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400">أخضر (G) [الأعلى وزناً]:</span>
                <span className="font-mono text-white">{mixG}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixG}
                onChange={(e) => setMixG(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Blue slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400">أزرق (B):</span>
                <span className="font-mono text-white">{mixB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={mixB}
                onChange={(e) => setMixB(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Color preview swatches */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Color Swatch */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl transition-all"
                style={{ backgroundColor: `rgb(${mixR}, ${mixG}, ${mixB})` }}
              />
              <span className="text-xs font-bold text-slate-300">اللون الناتج</span>
              <span className="text-[11px] font-mono text-slate-500">
                ({mixR}, {mixG}, {mixB})
              </span>
            </div>

            <span className="text-2xl text-slate-600 font-bold">➔</span>

            {/* Grayscale Equivalence Swatch */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-xl transition-all flex items-center justify-center font-mono font-bold text-xs"
                style={{
                  backgroundColor: `rgb(${calculatedGray}, ${calculatedGray}, ${calculatedGray})`,
                  color: calculatedGray > 128 ? '#000' : '#fff'
                }}
              >
                {calculatedGray}
              </div>
              <span className="text-xs font-bold text-cyan-400">المكافئ الرمادي</span>
              <span className="text-[11px] font-mono text-slate-400">
                Gray = {calculatedGray}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Quiz Mission to Unlock Level 3 */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-purple-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            🎨
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level2.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن التحدي لفتح المستوى 3 وكسب +100 XP!</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level2.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level2.q1_opt1, exp: t.level2.q1_opt1_exp },
              { id: 2, text: t.level2.q1_opt2, exp: t.level2.q1_opt2_exp, correct: true },
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
            <span>تأكيد الإجابة وفتح المستوى 3 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المستوى 3 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
