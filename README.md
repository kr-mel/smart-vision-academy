# 🎓 Smart Vision Academy | أكاديمية الرؤية الذكية | Akıllı Görüntü Akademisi
### YZM 309 - Digital Image Processing | Sayısal Görüntü İşleme

An interactive, gamified, and multilingual (Arabic, English, Turkish) educational web application designed to teach **Digital Image Processing (YZM 309)** from scratch.

---

## 🌟 Features / المميزات

1. **Multilingual (AR / EN / TR)**:
   - Full Arabic RTL support with **Cairo** typography.
   - English LTR and Turkish LTR with exact academic terminology.
2. **Gamification**:
   - Progressive level unlocking (Levels 1 to 6).
   - Real-time XP tracking and unlockable Badges / Trophies.
   - Retro sound effects powered by the Web Audio API synthesizer.
   - Interactive mission quizzes with instant visual feedback and celebratory confetti.
3. **Interactive Visual Laboratories**:
   - **Level 1**: 8×8 Pixel Matrix Editor & Real-time NumPy Tensor View + 16x Pixel Magnifier.
   - **Level 2**: RGB Channel Splitter, Luminance Grayscale Formula ($\text{Gray} = 0.299R + 0.587G + 0.114B$).
   - **Level 3**: Live Point Operations (Brightness, Contrast, Threshold) + Real-time 256-bin Histogram Graph & Histogram Equalization.
   - **Level 4**: 3×3 Sliding Window Convolution Step-by-Step Simulator + Salt & Pepper Noise vs Median Filter Superhero.
   - **Level 5**: Sobel Gradient Vectors vs Canny Edge Detector with interactive Hysteresis sliders.
   - **Level 6**: Binary Morphological Operations (Erosion, Dilation, Opening, Closing).
   - **Sandbox Studio**: Upload custom images, inspect pixels under cursor, apply filter pipelines, and copy ready-to-run Python OpenCV code.

---

## 🛠️ Tech Stack

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **Canvas API** for client-side digital image processing
- **Web Audio API** for synthesized retro SFX

---

## 🚀 Local Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
