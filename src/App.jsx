import React, { useState, useEffect } from 'react';
import { translations } from './i18n/translations';
import { soundFX } from './utils/soundEffects';

import { Navbar } from './components/Navbar';
import { LevelProgressHUD } from './components/LevelProgressHUD';
import { HeroSection } from './components/HeroSection';
import { Level1_Pixels } from './components/Level1_Pixels';
import { Level2_ColorSpaces } from './components/Level2_ColorSpaces';
import { Level3_PointOps } from './components/Level3_PointOps';
import { Level4_Convolution } from './components/Level4_Convolution';
import { Level5_EdgeDetection } from './components/Level5_EdgeDetection';
import { Level6_Morphology } from './components/Level6_Morphology';
import { VisionSandboxLab } from './components/VisionSandboxLab';
import { BadgeModal } from './components/BadgeModal';
import { Footer } from './components/Footer';

export function App() {
  // Localization: 'ar' | 'en' | 'tr'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('vision_lang') || 'ar';
  });

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vision_theme') || 'dark';
  });

  // Sound effects
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Gamification: XP & Unlocked Levels
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('vision_xp');
    return saved ? Number(saved) : 50;
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('vision_unlocked');
    return saved ? JSON.parse(saved) : [1];
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // Synchronize translation object
  const t = translations[lang] || translations.ar;

  // Persist language and direction
  useEffect(() => {
    localStorage.setItem('vision_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Persist and apply theme
  useEffect(() => {
    localStorage.setItem('vision_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist gamification progress
  useEffect(() => {
    localStorage.setItem('vision_xp', String(xp));
    localStorage.setItem('vision_unlocked', JSON.stringify(unlockedLevels));
  }, [xp, unlockedLevels]);

  // Handle level completion
  const handleCompleteLevel = (levelNum, earnedXp = 100) => {
    soundFX.playXp();
    setXp((prev) => prev + earnedXp);

    const nextLevel = levelNum + 1;
    if (nextLevel <= 6 && !unlockedLevels.includes(nextLevel)) {
      setUnlockedLevels((prev) => [...prev, nextLevel]);
    }
  };

  const handleResetProgress = () => {
    setXp(0);
    setUnlockedLevels([1]);
    localStorage.removeItem('vision_xp');
    localStorage.removeItem('vision_unlocked');
  };

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#07090e] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top sticky Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        xp={xp}
        unlockedLevels={unlockedLevels}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        openBadgeModal={() => setIsBadgeModalOpen(true)}
      />

      <main className="space-y-4">
        {/* HUD Roadmap */}
        <LevelProgressHUD
          t={t}
          unlockedLevels={unlockedLevels}
          xp={xp}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          streak={3}
        />

        {/* Hero Section */}
        <HeroSection
          t={t}
          lang={lang}
          onStartJourney={() => scrollTo('level1')}
          onOpenLab={() => scrollTo('lab')}
        />

        {/* Level 1: Pixels & Matrices */}
        <Level1_Pixels
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.includes(2)}
          isUnlocked={true}
        />

        {/* Level 2: Color Spaces & RGB */}
        <Level2_ColorSpaces
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.includes(3)}
          isUnlocked={unlockedLevels.includes(2)}
        />

        {/* Level 3: Point Operations & Histograms */}
        <Level3_PointOps
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.includes(4)}
          isUnlocked={unlockedLevels.includes(3)}
        />

        {/* Level 4: Spatial Filters & Convolution */}
        <Level4_Convolution
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.includes(5)}
          isUnlocked={unlockedLevels.includes(4)}
        />

        {/* Level 5: Edge Detection & Canny */}
        <Level5_EdgeDetection
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.includes(6)}
          isUnlocked={unlockedLevels.includes(5)}
        />

        {/* Level 6: Morphological Operations */}
        <Level6_Morphology
          t={t}
          lang={lang}
          onCompleteLevel={handleCompleteLevel}
          isCompleted={unlockedLevels.length >= 6}
          isUnlocked={unlockedLevels.includes(6)}
        />

        {/* Sandbox Studio */}
        <VisionSandboxLab
          t={t}
          lang={lang}
        />
      </main>

      {/* Badges Trophy Modal */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        unlockedLevels={unlockedLevels}
        xp={xp}
        t={t}
      />

      {/* Footer */}
      <Footer
        t={t}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}

export default App;
