import React, { useState, useEffect } from 'react';
import { Eye, ArrowRight, ArrowLeft, Play, Sparkles, Terminal, Cpu, CheckCircle } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export function HeroSection({ t, lang, onStartJourney, onOpenLab }) {
  const isRtl = lang === 'ar';
  const [pulseIndex, setPulseIndex] = useState(0);

  // Animated futuristic scanline effect in hero mini-matrix
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 64);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden py-12 lg:py-20 px-4">
      {/* Dynamic Cyber Grid and Neon Glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Headlines & Call to Actions */}
        <div className="lg:col-span-7 text-center lg:text-start space-y-6">
          {/* Futuristic Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-neon-cyan animate-float">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{t.hero.tag}</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.hero.title}{' '}
            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
              {t.hero.highlight}
            </span>
          </h1>

          {/* Hero Subtitle / Narrative */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
            {t.hero.desc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => {
                soundFX.playClick();
                onStartJourney();
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-neon-cyan hover:scale-105 active:scale-95 transition-all"
            >
              <span>{t.startJourney}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenLab();
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-bold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-105"
            >
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>{t.openLab}</span>
            </button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-cyan-400 font-mono">6</span>
              <span className="text-xs text-slate-400 font-medium">{t.hero.statsLevels}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-emerald-400 font-mono">15+</span>
              <span className="text-xs text-slate-400 font-medium">{t.hero.statsInteractive}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-xl sm:text-2xl font-black text-purple-400 font-mono">100%</span>
              <span className="text-xs text-slate-400 font-medium">{t.hero.statsPython}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Futuristic Vision Aperture Visualizer */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-cyan-500/40">
            {/* Terminal Top bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs font-mono text-cyan-300">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold">VISION_SCANNER_v3.09</span>
              </div>
              <span className="text-emerald-400 animate-pulse font-bold">ONLINE</span>
            </div>

            {/* Matrix Scan Screen */}
            <div className="relative bg-[#060912] rounded-2xl p-4 border border-cyan-500/20 shadow-inner overflow-hidden">
              {/* Laser Scan line */}
              <div 
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-neon-cyan z-20 pointer-events-none transition-all duration-300"
                style={{ top: `${(pulseIndex % 8) * 12.5}%` }}
              />

              {/* 8x8 Animated Digit Matrix */}
              <div className="grid grid-cols-8 gap-1.5 aspect-square">
                {Array.from({ length: 64 }).map((_, i) => {
                  const isActive = i === pulseIndex;
                  // Generate an eye shape in numbers
                  const eyePattern = [
                    0,0,0,0,0,0,0,0,
                    0,0,1,1,1,1,0,0,
                    0,1,2,3,3,2,1,0,
                    1,2,3,4,4,3,2,1,
                    1,2,3,4,4,3,2,1,
                    0,1,2,3,3,2,1,0,
                    0,0,1,1,1,1,0,0,
                    0,0,0,0,0,0,0,0,
                  ];
                  const intensity = eyePattern[i] * 60;
                  return (
                    <div
                      key={i}
                      className={`rounded-md flex items-center justify-center text-[9px] font-mono transition-all duration-200 select-none ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-bold scale-110 shadow-neon-cyan'
                          : intensity > 100
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                          : intensity > 50
                          ? 'bg-slate-900 text-slate-400 border border-slate-800'
                          : 'bg-slate-950/90 text-slate-600'
                      }`}
                    >
                      {isActive ? '255' : intensity}
                    </div>
                  );
                })}
              </div>

              {/* Floating Target Overlay in Center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border border-cyan-500/40 flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                  <div className="w-16 h-16 rounded-full border border-dashed border-teal-400/60" />
                </div>
              </div>
            </div>

            {/* Bottom mini telemetry */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Cpu className="w-3.5 h-3.5" /> 8×8 Matrix Tensor
              </span>
              <span>Shape: (8, 8, 1) | uint8</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
