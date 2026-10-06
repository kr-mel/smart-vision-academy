import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Upload,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  MousePointer,
  Layers,
  Wand2,
  FileCode2
} from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import {
  drawPresetSample,
  toGrayscale,
  invertImage,
  adjustBrightness,
  adjustContrast,
  applyThreshold,
  applyConvolution,
  applyMedianFilter,
  applySobel,
  applyCanny,
  applyDilation,
  applyErosion,
  equalizeHistogram,
  computeHistogram
} from '../utils/imageAlgorithms';

export function VisionSandboxLab({ t, lang }) {
  const isRtl = lang === 'ar';

  const origCanvasRef = useRef(null);
  const procCanvasRef = useRef(null);
  const histCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Preset or custom image
  const [activePreset, setActivePreset] = useState('robot'); // 'robot' | 'shapes' | 'coins' | 'custom'
  const [customImageEl, setCustomImageEl] = useState(null);

  // Operations and parameters
  const [opGrayscale, setOpGrayscale] = useState(false);
  const [opInvert, setOpInvert] = useState(false);
  const [opBrightness, setOpBrightness] = useState(0);
  const [opContrast, setOpContrast] = useState(1.0);
  const [opThreshold, setOpThreshold] = useState(false);
  const [thresholdVal, setThresholdVal] = useState(128);
  const [activeFilter, setActiveFilter] = useState('none'); // 'none'|'boxBlur'|'gaussian'|'sharpen'|'median'|'sobel'|'canny'|'dilation'|'erosion'|'he'
  const [cannyLow, setCannyLow] = useState(30);
  const [cannyHigh, setCannyHigh] = useState(70);

  // Inspector cursor state
  const [inspectData, setInspectData] = useState({ x: 0, y: 0, r: 0, g: 0, b: 0, gray: 0 });
  const [isCopied, setIsCopied] = useState(false);

  // Draw original base canvas
  const drawOriginal = () => {
    const origCanvas = origCanvasRef.current;
    if (!origCanvas) return;
    origCanvas.width = 300;
    origCanvas.height = 300;
    const ctx = origCanvas.getContext('2d');

    if (activePreset === 'custom' && customImageEl) {
      ctx.drawImage(customImageEl, 0, 0, origCanvas.width, origCanvas.height);
    } else {
      drawPresetSample(origCanvas, activePreset);
    }
  };

  // Re-run pipeline and draw processed canvas & histogram
  const runPipeline = () => {
    const origCanvas = origCanvasRef.current;
    const procCanvas = procCanvasRef.current;
    const histCanvas = histCanvasRef.current;
    if (!origCanvas || !procCanvas || !histCanvas) return;

    procCanvas.width = origCanvas.width;
    procCanvas.height = origCanvas.height;

    const octx = origCanvas.getContext('2d');
    const pctx = procCanvas.getContext('2d');

    // Copy original image
    pctx.drawImage(origCanvas, 0, 0);
    const imgData = pctx.getImageData(0, 0, procCanvas.width, procCanvas.height);

    // Apply pipeline in order
    if (opGrayscale) {
      toGrayscale(imgData);
    }

    if (opBrightness !== 0) {
      adjustBrightness(imgData, opBrightness);
    }

    if (opContrast !== 1.0) {
      adjustContrast(imgData, opContrast);
    }

    if (opInvert) {
      invertImage(imgData);
    }

    // Filters
    if (activeFilter === 'boxBlur') {
      applyConvolution(imgData, [1,1,1, 1,1,1, 1,1,1], 9);
    } else if (activeFilter === 'gaussian') {
      applyConvolution(imgData, [1,2,1, 2,4,2, 1,2,1], 16);
    } else if (activeFilter === 'sharpen') {
      applyConvolution(imgData, [0,-1,0, -1,5,-1, 0,-1,0], 1);
    } else if (activeFilter === 'median') {
      applyMedianFilter(imgData, 3);
    } else if (activeFilter === 'sobel') {
      applySobel(imgData);
    } else if (activeFilter === 'canny') {
      applyCanny(imgData, cannyLow, cannyHigh);
    } else if (activeFilter === 'dilation') {
      applyDilation(imgData, 1);
    } else if (activeFilter === 'erosion') {
      applyErosion(imgData, 1);
    } else if (activeFilter === 'he') {
      equalizeHistogram(imgData);
    }

    if (opThreshold) {
      applyThreshold(imgData, thresholdVal);
    }

    pctx.putImageData(imgData, 0, 0);

    // Draw Histogram
    const { gray } = computeHistogram(imgData);
    const hctx = histCanvas.getContext('2d');
    histCanvas.width = 300;
    histCanvas.height = 70;
    hctx.fillStyle = '#05070f';
    hctx.fillRect(0, 0, histCanvas.width, histCanvas.height);

    const maxVal = Math.max(...gray, 1);
    const barW = histCanvas.width / 256;
    hctx.fillStyle = '#00f2fe';

    for (let i = 0; i < 256; i++) {
      const bh = (gray[i] / maxVal) * (histCanvas.height - 4);
      hctx.fillRect(i * barW, histCanvas.height - bh, barW, bh);
    }
  };

  useEffect(() => {
    drawOriginal();
    runPipeline();
  }, [
    activePreset,
    customImageEl,
    opGrayscale,
    opInvert,
    opBrightness,
    opContrast,
    opThreshold,
    thresholdVal,
    activeFilter,
    cannyLow,
    cannyHigh
  ]);

  // Handle image upload from user device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        soundFX.playSuccess();
        setCustomImageEl(img);
        setActivePreset('custom');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Inspect pixel on mouse move
  const handleCanvasMouseMove = (e) => {
    const canvas = procCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const ctx = canvas.getContext('2d');
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      setInspectData({ x, y, r, g, b, gray });
    }
  };

  // Download output image
  const handleDownload = () => {
    soundFX.playClick();
    const canvas = procCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'vision_processed_output.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Reset pipeline
  const handleReset = () => {
    soundFX.playClick();
    setOpGrayscale(false);
    setOpInvert(false);
    setOpBrightness(0);
    setOpContrast(1.0);
    setOpThreshold(false);
    setThresholdVal(128);
    setActiveFilter('none');
  };

  // Generate Python OpenCV Code dynamically
  const generatePythonCode = () => {
    let lines = [
      'import cv2',
      'import numpy as np',
      'import matplotlib.pyplot as plt',
      '',
      '# 1. Load image',
      'img = cv2.imread("input.jpg")',
      'result = img.copy()'
    ];

    if (opGrayscale || activeFilter === 'sobel' || activeFilter === 'canny' || activeFilter === 'he') {
      lines.push('result = cv2.cvtColor(result, cv2.COLOR_BGR2GRAY)');
    }

    if (opBrightness !== 0 || opContrast !== 1.0) {
      lines.push(`result = cv2.convertScaleAbs(result, alpha=${opContrast}, beta=${opBrightness})`);
    }

    if (opInvert) {
      lines.push('result = cv2.bitwise_not(result)');
    }

    if (activeFilter === 'boxBlur') {
      lines.push('result = cv2.blur(result, (3, 3))');
    } else if (activeFilter === 'gaussian') {
      lines.push('result = cv2.GaussianBlur(result, (3, 3), 0)');
    } else if (activeFilter === 'sharpen') {
      lines.push('kernel_sharpen = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])');
      lines.push('result = cv2.filter2D(result, -1, kernel_sharpen)');
    } else if (activeFilter === 'median') {
      lines.push('result = cv2.medianBlur(result, 3)');
    } else if (activeFilter === 'sobel') {
      lines.push('sobelx = cv2.Sobel(result, cv2.CV_64F, 1, 0, ksize=3)');
      lines.push('sobely = cv2.Sobel(result, cv2.CV_64F, 0, 1, ksize=3)');
      lines.push('result = cv2.magnitude(sobelx, sobely)');
    } else if (activeFilter === 'canny') {
      lines.push(`result = cv2.Canny(result, ${cannyLow}, ${cannyHigh})`);
    } else if (activeFilter === 'dilation') {
      lines.push('kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))');
      lines.push('result = cv2.dilate(result, kernel, iterations=1)');
    } else if (activeFilter === 'erosion') {
      lines.push('kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))');
      lines.push('result = cv2.erode(result, kernel, iterations=1)');
    } else if (activeFilter === 'he') {
      lines.push('result = cv2.equalizeHist(result)');
    }

    if (opThreshold) {
      lines.push(`_, result = cv2.threshold(result, ${thresholdVal}, 255, cv2.THRESH_BINARY)`);
    }

    lines.push('');
    lines.push('# 3. Save or display processed image');
    lines.push('cv2.imwrite("output.png", result)');

    return lines.join('\n');
  };

  const copyPythonCode = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(generatePythonCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="lab" className="py-16 px-4 max-w-7xl mx-auto space-y-12">
      {/* Lab Header */}
      <div className="space-y-4 text-center sm:text-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-neon-emerald">
          <Terminal className="w-4 h-4" />
          <span>{t.sandboxTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t.lab.title}
        </h2>
        <p className="text-slate-300 max-w-3xl leading-relaxed text-sm sm:text-base font-medium">
          {t.lab.desc}
        </p>
      </div>

      {/* Top Presets & Image Uploader Bar */}
      <div className="glass-panel rounded-2xl p-4 md:p-6 border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-300">{t.lab.presetsTitle}</span>
          {[
            { id: 'robot', label: t.lab.presetRobot, icon: '🤖' },
            { id: 'shapes', label: t.lab.presetShapes, icon: '🔷' },
            { id: 'coins', label: t.lab.presetCoins, icon: '🪙' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                soundFX.playClick();
                setActivePreset(preset.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                activePreset === preset.id
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-neon-cyan border-cyan-400 scale-105'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Upload Button */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-neon-purple transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>{t.lab.uploadBtn}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs"
            title="إعادة ضبط الفلاتر"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Dual Canvases + Live Histogram */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Canvas */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  {t.lab.originalImg}
                </span>
                <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                  <canvas
                    ref={origCanvasRef}
                    className="rounded-xl w-60 h-60 object-cover"
                  />
                </div>
              </div>

              {/* Processed Output Canvas */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.lab.processedImg}
                </span>
                <div className="p-2 bg-slate-950 rounded-2xl border border-cyan-500/40 shadow-neon-cyan relative">
                  <canvas
                    ref={procCanvasRef}
                    onMouseMove={handleCanvasMouseMove}
                    className="rounded-xl w-60 h-60 object-cover cursor-crosshair"
                  />
                </div>
              </div>
            </div>

            {/* Live Pixel Inspector Box */}
            <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <MousePointer className="w-4 h-4" />
                <span>{t.lab.pixelInspectorTitle}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span>
                  {t.lab.inspectCoords} <b>({inspectData.x}, {inspectData.y})</b>
                </span>
                <span>|</span>
                <span>
                  {t.lab.inspectRGB} <b className="text-rose-400">{inspectData.r}</b>, <b className="text-emerald-400">{inspectData.g}</b>, <b className="text-blue-400">{inspectData.b}</b>
                </span>
                <span>|</span>
                <span>
                  {t.lab.inspectIntensity} <b className="text-amber-400">{inspectData.gray}</b>
                </span>
              </div>
            </div>

            {/* Live Output Histogram */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
                <span>0 (Dark)</span>
                <span className="text-cyan-400 font-bold">Live Output Histogram</span>
                <span>255 (Bright)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <canvas
                  ref={histCanvasRef}
                  className="rounded-lg w-full h-16"
                />
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{t.lab.downloadResult}</span>
            </button>
          </div>
        </div>

        {/* Right: Operations & Filter Controls Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-cyan-400" />
              {t.lab.operationsTitle}
            </h3>

            {/* Quick Toggles */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setOpGrayscale(!opGrayscale);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  opGrayscale
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-neon-cyan'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                تحويل لرمادي (Grayscale)
              </button>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setOpInvert(!opInvert);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  opInvert
                    ? 'bg-purple-600 text-white border-purple-400 font-black shadow-neon-purple'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                عكس الألوان (Negative)
              </button>
            </div>

            {/* Sliders: Brightness, Contrast, Threshold */}
            <div className="space-y-4 pt-2">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>السطوع (Brightness)</span>
                  <span className="font-mono text-cyan-400">{opBrightness}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={opBrightness}
                  onChange={(e) => setOpBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>التباين (Contrast)</span>
                  <span className="font-mono text-emerald-400">{opContrast.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={opContrast}
                  onChange={(e) => setOpContrast(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Threshold */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="labThreshCheck"
                      checked={opThreshold}
                      onChange={(e) => setOpThreshold(e.target.checked)}
                      className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                    />
                    <label htmlFor="labThreshCheck" className="text-amber-400 cursor-pointer text-xs">
                      عتبة ثنائية (Threshold)
                    </label>
                  </div>
                  <span className="font-mono text-amber-400">{thresholdVal}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  disabled={!opThreshold}
                  value={thresholdVal}
                  onChange={(e) => setThresholdVal(Number(e.target.value))}
                  className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 ${
                    !opThreshold && 'opacity-40 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Filter Pipeline Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 block">
                اختر الفلتر المطبق (Active Spatial Filter):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'none', label: 'بدون فلتر (None)' },
                  { id: 'boxBlur', label: 'Box Blur 3×3' },
                  { id: 'gaussian', label: 'Gaussian Blur' },
                  { id: 'sharpen', label: 'Sharpen (حدة)' },
                  { id: 'median', label: 'Median Filter' },
                  { id: 'sobel', label: 'Sobel Gradient' },
                  { id: 'canny', label: 'Canny Detector' },
                  { id: 'dilation', label: 'Dilation (تمدد)' },
                  { id: 'erosion', label: 'Erosion (تآكل)' },
                  { id: 'he', label: 'Histogram Eq.' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundFX.playClick();
                      setActiveFilter(f.id);
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all truncate text-start ${
                      activeFilter === f.id
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-neon-cyan font-black'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canny Threshold Sliders if Canny selected */}
            {activeFilter === 'canny' && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2 text-xs">
                <span className="font-bold text-cyan-400 block text-[11px]">Canny Thresholds:</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Low:</span>
                    <span className="font-mono text-cyan-300">{cannyLow}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={cannyLow}
                    onChange={(e) => setCannyLow(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">High:</span>
                    <span className="font-mono text-emerald-300">{cannyHigh}</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={cannyHigh}
                    onChange={(e) => setCannyHigh(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Python OpenCV Code Display */}
          <div className="glass-panel-glow rounded-3xl p-5 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
                <FileCode2 className="w-4 h-4" />
                Python OpenCV Snippet
              </span>
              <button
                onClick={copyPythonCode}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? t.lab.copied : t.lab.copyCode}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#04060d] rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed shadow-inner">
              <code>{generatePythonCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
