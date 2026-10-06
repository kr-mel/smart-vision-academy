import React, { useState, useEffect, useRef } from 'react';
import { Eye, ZoomIn, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RefreshCw, Sparkles, Hash, MousePointer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';

export function Level1_Pixels({ t, lang, onCompleteLevel, isCompleted, isUnlocked }) {
  const isRtl = lang === 'ar';

  // 8x8 Grid state (initial smiley / eye shape)
  const [grid, setGrid] = useState([
    [0,   0,   0,   0,   0,   0,   0,   0],
    [0,  60, 180, 255, 255, 180,  60,   0],
    [0, 180, 255,  50,  50, 255, 180,   0],
    [0, 255,  50, 255, 255,  50, 255,   0],
    [0, 255,  50, 255, 255,  50, 255,   0],
    [0, 180, 255,  50,  50, 255, 180,   0],
    [0,  60, 180, 255, 255, 180,  60,   0],
    [0,   0,   0,   0,   0,   0,   0,   0],
  ]);

  const [hoveredCell, setHoveredCell] = useState({ r: 3, c: 3 });
  const [paintValue, setPaintValue] = useState(255);

  // Zoom tool state
  const [zoomFactor, setZoomFactor] = useState(4);
  const zoomCanvasRef = useRef(null);

  // Quiz state
  const [q1Selected, setQ1Selected] = useState(null);
  const [q2Selected, setQ2Selected] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Update cell intensity on click
  const handleCellClick = (r, c) => {
    soundFX.playClick();
    const newGrid = grid.map((row, ri) =>
      row.map((val, ci) => {
        if (ri === r && ci === c) {
          // Cycle through or paint
          return paintValue;
        }
        return val;
      })
    );
    setGrid(newGrid);
    setHoveredCell({ r, c });
  };

  const resetGrid = () => {
    soundFX.playClick();
    setGrid([
      [0,   0,   0,   0,   0,   0,   0,   0],
      [0,  60, 180, 255, 255, 180,  60,   0],
      [0, 180, 255,  50,  50, 255, 180,   0],
      [0, 255,  50, 255, 255,  50, 255,   0],
      [0, 255,  50, 255, 255,  50, 255,   0],
      [0, 180, 255,  50,  50, 255, 180,   0],
      [0,  60, 180, 255, 255, 180,  60,   0],
      [0,   0,   0,   0,   0,   0,   0,   0],
    ]);
  };

  // Draw magnified image onto canvas
  useEffect(() => {
    const canvas = zoomCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    // Draw high-res base drawing on offscreen
    const offscreen = document.createElement('canvas');
    offscreen.width = 16;
    offscreen.height = 16;
    const octx = offscreen.getContext('2d');
    
    // Draw simple eye on 16x16
    octx.fillStyle = '#05070d';
    octx.fillRect(0, 0, 16, 16);
    octx.fillStyle = '#ffffff';
    octx.beginPath();
    octx.arc(8, 8, 6, 0, Math.PI * 2);
    octx.fill();
    octx.fillStyle = '#0284c7';
    octx.beginPath();
    octx.arc(8, 8, 3.5, 0, Math.PI * 2);
    octx.fill();
    octx.fillStyle = '#000000';
    octx.beginPath();
    octx.arc(8, 8, 1.8, 0, Math.PI * 2);
    octx.fill();

    // Now render on main canvas according to zoomFactor
    ctx.imageSmoothingEnabled = false; // keep crisp pixelation!
    const imgData = octx.getImageData(0, 0, 16, 16).data;

    const cellSize = size / 16;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const idx = (y * 16 + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Draw pixel grid line if zoomFactor >= 4
        if (zoomFactor >= 4) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

          // If high zoom (8 or 16), render actual number inside pixel!
          if (zoomFactor >= 8) {
            ctx.fillStyle = gray > 128 ? '#000000' : '#00f2fe';
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(gray, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
          }
        }
      }
    }
  }, [zoomFactor]);

  const handleQuizSubmit = () => {
    if (q1Selected === 2 && q2Selected === 1) {
      soundFX.playSuccess();
      soundFX.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setQuizSubmitted(true);
      onCompleteLevel(1, 100);
    } else {
      soundFX.playError();
      setQuizSubmitted(true);
    }
  };

  return (
    <section id="level1" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      {/* Level Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold shadow-neon-cyan">
          <Eye className="w-4 h-4" />
          <span>{t.level1.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.level1.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.level1.desc}
        </p>
      </div>

      {/* Concept Card: The Pixel Definition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border-cyan-500/20 space-y-2">
          <span className="text-3xl">⬛ ➔ ⬜</span>
          <h3 className="font-bold text-white text-base">قيمة الضوء (Intensity)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            القيم تتراوح من 0 (أسود مطلق) إلى 255 (أبيض ناصع) في النظام 8-bit (uint8).
          </p>
        </div>
        <div className="p-6 rounded-2xl glass-panel border-cyan-500/20 space-y-2">
          <span className="text-3xl">📐</span>
          <h3 className="font-bold text-white text-base">الإحداثيات I(x, y)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            نحدد موضع أي بكسل عبر صفّه وعموده: المحور الأفقي X والمحور الرأسي Y.
          </p>
        </div>
        <div className="p-6 rounded-2xl glass-panel border-cyan-500/20 space-y-2">
          <span className="text-3xl">💾</span>
          <h3 className="font-bold text-white text-base">المصفوفة في الذاكرة</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            صورة Full HD (1920×1080) تحتوي على أكثر من مليوني بكسل مرتبة رقمياً!
          </p>
        </div>
      </div>

      {/* Interactive Tool 1: 8x8 Pixel Board & Real-time Matrix Inspector */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              {t.level1.gridTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level1.gridHint}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Color/Intensity Brush Picker */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">فرشاة الرسم:</span>
              {[0, 100, 180, 255].map((val) => (
                <button
                  key={val}
                  onClick={() => setPaintValue(val)}
                  className={`w-5 h-5 rounded-md border text-[10px] flex items-center justify-center font-mono ${
                    paintValue === val ? 'border-cyan-400 scale-110 shadow-neon-cyan' : 'border-slate-700'
                  }`}
                  style={{
                    backgroundColor: `rgb(${val},${val},${val})`,
                    color: val > 128 ? '#000' : '#fff'
                  }}
                  title={`قيمة ${val}`}
                />
              ))}
            </div>

            <button
              onClick={resetGrid}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all text-xs flex items-center gap-1"
              title="إعادة ضبط الرسمة"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Board & Matrix Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual 8x8 Pixel Grid */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative p-3 bg-slate-950 rounded-2xl border border-cyan-500/40 shadow-inner">
              {/* Coordinates Indicator */}
              <div className="grid grid-cols-8 gap-1.5 w-64 sm:w-80 aspect-square">
                {grid.map((row, r) =>
                  row.map((val, c) => {
                    const isHovered = hoveredCell.r === r && hoveredCell.c === c;
                    return (
                      <button
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHoveredCell({ r, c })}
                        onClick={() => handleCellClick(r, c)}
                        className={`rounded-lg transition-all flex items-center justify-center text-[10px] font-mono font-bold select-none cursor-pointer ${
                          isHovered
                            ? 'ring-2 ring-cyan-400 scale-110 z-10 shadow-neon-cyan'
                            : 'hover:scale-105 border border-white/5'
                        }`}
                        style={{
                          backgroundColor: `rgb(${val}, ${val}, ${val})`,
                          color: val > 128 ? '#0a0d14' : '#00f2fe'
                        }}
                      >
                        {val}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Hovered cell info badge */}
            <div className="mt-4 flex items-center gap-4 text-xs font-mono bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-slate-400">
                {t.level1.coords}: <b className="text-cyan-300">({hoveredCell.c}, {hoveredCell.r})</b>
              </span>
              <span className="w-px h-4 bg-slate-800" />
              <span className="text-slate-400">
                {t.level1.pixelValue}: <b className="text-emerald-400">{grid[hoveredCell.r][hoveredCell.c]} / 255</b>
              </span>
            </div>
          </div>

          {/* Raw Numeric Matrix as Code */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-mono text-cyan-400 block font-semibold">
              {t.level1.matrixView}
            </span>
            <div className="bg-[#04060c] p-4 rounded-2xl border border-cyan-500/30 overflow-x-auto text-[11px] font-mono text-slate-300 shadow-inner">
              <div className="text-slate-500 mb-1"># Python NumPy 2D Array Representation</div>
              <span className="text-cyan-400">image_matrix</span> = np.array([
              {grid.map((row, r) => (
                <div
                  key={r}
                  className={`pl-4 py-0.5 transition-colors ${
                    hoveredCell.r === r ? 'bg-cyan-950/60 text-cyan-200 font-bold' : ''
                  }`}
                >
                  [{row.map((val, c) => (
                    <span
                      key={c}
                      className={`inline-block w-8 text-right ${
                        hoveredCell.r === r && hoveredCell.c === c
                          ? 'text-emerald-400 font-black underline'
                          : ''
                      }`}
                    >
                      {val}{c < 7 ? ',' : ''}
                    </span>
                  ))}],
                </div>
              ))}
              ], dtype=np.uint8)
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              💡 لاحظ كيف يترجم المعالج كل رقم مباشرة إلى نقطة ضوئية. تعديل رقم في المصفوفة يغير الصورة فوراً!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool 2: The Super Magnifier */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-purple-400" />
              {t.level1.magnifierTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{t.level1.magnifierDesc}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 font-bold">{t.level1.zoomLabel}</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[1, 2, 4, 8, 16].map((zf) => (
                <button
                  key={zf}
                  onClick={() => {
                    soundFX.playClick();
                    setZoomFactor(zf);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    zoomFactor === zf
                      ? 'bg-purple-600 text-white shadow-neon-purple scale-105'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {zf}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
          <div className="p-2 bg-slate-950 rounded-2xl border border-purple-500/40 shadow-neon-purple relative">
            <canvas
              ref={zoomCanvasRef}
              className="rounded-xl w-64 h-64 shadow-inner"
            />
            {zoomFactor >= 8 && (
              <span className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-500/50">
                Discrete Matrix Exposed
              </span>
            )}
          </div>

          <div className="max-w-md space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-purple-400 block text-sm">ماذا نتعلم من التكبير؟</span>
              <p className="text-slate-400 leading-relaxed">
                عند تكبير الصورة إلى 8x أو 16x، تختفي المنحنيات "الناعمة" وتتحول لشبكة مربعة واضحة. داخل كل مربع يظهر الرقم الفعلي لشدة الإضاءة!
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-400 block text-sm">الدقة المكانية (Spatial Resolution)</span>
              <p className="text-slate-400 leading-relaxed">
                كلما زاد عدد البكسلات في نفس المساحة (مثلاً 4K مقابل 720p)، صغرت المربعات وأصبحت غير مرئية للعين البشرية، فتبدو الصورة كأنها حقيقية!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Quiz Mission to Unlock Level 2 */}
      <div className="glass-panel-glow rounded-3xl p-6 lg:p-8 border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
            🎯
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.level1.quizTitle}</h3>
            <p className="text-xs text-slate-400">أجب عن السؤالين لربح +100 XP وفتح المستوى 2!</p>
          </div>
        </div>

        {/* Question 1 */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-200">1. {t.level1.q1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 1, text: t.level1.q1_opt1, exp: t.level1.q1_opt1_exp },
              { id: 2, text: t.level1.q1_opt2, exp: t.level1.q1_opt2_exp, correct: true },
              { id: 3, text: t.level1.q1_opt3, exp: t.level1.q1_opt3_exp }
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

        {/* Question 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <p className="text-sm font-bold text-slate-200">2. {t.level1.q2}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 1, text: t.level1.q2_opt1, exp: t.level1.q2_opt1_exp, correct: true },
              { id: 2, text: t.level1.q2_opt2, exp: t.level1.q2_opt2_exp }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundFX.playClick();
                  setQ2Selected(opt.id);
                }}
                className={`p-3.5 rounded-xl border text-start text-xs font-semibold transition-all ${
                  q2Selected === opt.id
                    ? opt.correct && quizSubmitted
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                      : !opt.correct && quizSubmitted
                      ? 'bg-rose-950 border-rose-400 text-rose-300'
                      : 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt.text}</span>
                {quizSubmitted && q2Selected === opt.id && (
                  <p className="mt-2 text-[11px] font-normal opacity-90">{opt.exp}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={handleQuizSubmit}
            disabled={!q1Selected || !q2Selected}
            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              q1Selected && q2Selected
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-neon-emerald cursor-pointer hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تحقق من الإجابات وفتح المستوى التالي 🚀</span>
          </button>

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <CheckCircle2 className="w-4 h-4" /> تم فتح المستوى 2 بنجاح! (+100 XP)
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
