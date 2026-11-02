/**
 * Smart Kids Puzzle World 🌈
 * An interactive, colorful, and engaging educational puzzle game for children aged 3–8
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameScreen, SoundSettings, Trophy, DailyQuest } from './types/game';
import { INITIAL_TROPHIES, INITIAL_DAILY_QUESTS } from './utils/data';
import { sounds, speech } from './utils/audio';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AlphabetGame } from './components/AlphabetGame';
import { NumberGame } from './components/NumberGame';
import { ShapeColorGame } from './components/ShapeColorGame';
import { InteractivePuzzleGame } from './components/InteractivePuzzleGame';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';

const LOCAL_STORAGE_KEY = 'smart_kids_puzzle_world_progress_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');

  // Stars and Game Progress
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.stars === 'number' ? parsed.stars : 5;
      }
    } catch {}
    return 5; // Start with 5 stars as a welcoming gift!
  });

  const [masteredLetters, setMasteredLetters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.masteredLetters) ? parsed.masteredLetters : ['A', 'B'];
      }
    } catch {}
    return ['A', 'B'];
  });

  const [masteredNumbers, setMasteredNumbers] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.masteredNumbers) ? parsed.masteredNumbers : [1, 2, 3];
      }
    } catch {}
    return [1, 2, 3];
  });

  const [masteredShapes, setMasteredShapes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.masteredShapes) ? parsed.masteredShapes : ['circle'];
      }
    } catch {}
    return ['circle'];
  });

  const [puzzlesSolved, setPuzzlesSolved] = useState<number>(0);
  const [trophies, setTrophies] = useState<Trophy[]>(INITIAL_TROPHIES);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_DAILY_QUESTS);

  // Sound and Voice Settings
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    soundEnabled: true,
    musicEnabled: false, // Default false until user interacts or toggles
    speechEnabled: true,
    speechRate: 0.9,
  });

  // Modals
  const [isTrophyOpen, setIsTrophyOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save progress to local storage
  useEffect(() => {
    try {
      const data = {
        stars,
        masteredLetters,
        masteredNumbers,
        masteredShapes,
        puzzlesSolved
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [stars, masteredLetters, masteredNumbers, masteredShapes, puzzlesSolved]);

  // Earn Stars handler
  const handleEarnStars = (count: number) => {
    setStars(prev => {
      const next = prev + count;
      // Check for newly unlocked trophies
      trophies.forEach(t => {
        if (!t.unlocked && next >= t.requiredStars && prev < t.requiredStars) {
          setTimeout(() => {
            sounds.playFanfare(soundSettings.soundEnabled);
            speech.speak(`New Trophy Unlocked: ${t.title}!`, soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
          }, 1200);
        }
      });
      return next;
    });
  };

  // Mastered letter callback + daily progress
  const handleAlphabetMastered = (letter: string) => {
    if (!masteredLetters.includes(letter)) {
      setMasteredLetters(prev => [...prev, letter]);
    }
    // Update daily quest
    setDailyQuests(prev =>
      prev.map(q => q.id === 'daily_abc' ? { ...q, currentCount: q.currentCount + 1 } : q)
    );
  };

  // Mastered number callback + daily progress
  const handleNumberMastered = (num: number) => {
    if (!masteredNumbers.includes(num)) {
      setMasteredNumbers(prev => [...prev, num]);
    }
    setDailyQuests(prev =>
      prev.map(q => q.id === 'daily_count' ? { ...q, currentCount: q.currentCount + 1 } : q)
    );
  };

  // Mastered shape callback + daily progress
  const handleShapeMastered = (shapeId: string) => {
    if (!masteredShapes.includes(shapeId)) {
      setMasteredShapes(prev => [...prev, shapeId]);
    }
    setDailyQuests(prev =>
      prev.map(q => q.id === 'daily_shape' ? { ...q, currentCount: q.currentCount + 1 } : q)
    );
  };

  // Puzzle solved callback
  const handlePuzzleSolved = () => {
    setPuzzlesSolved(prev => prev + 1);
  };

  // Claim daily quest
  const handleClaimQuest = (questId: string) => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    handleEarnStars(quest.rewardStars);
    setDailyQuests(prev =>
      prev.map(q => q.id === questId ? { ...q, completed: true } : q)
    );
  };

  // Toggle Sound
  const handleToggleSound = () => {
    setSoundSettings(prev => {
      const next = !prev.soundEnabled;
      return { ...prev, soundEnabled: next, speechEnabled: next };
    });
  };

  // Toggle Background Music
  const handleToggleMusic = () => {
    setSoundSettings(prev => {
      const next = !prev.musicEnabled;
      sounds.toggleMusic(next);
      return { ...prev, musicEnabled: next };
    });
  };

  // Reset Progress
  const handleResetProgress = () => {
    setStars(5);
    setMasteredLetters(['A', 'B']);
    setMasteredNumbers([1, 2, 3]);
    setMasteredShapes(['circle']);
    setPuzzlesSolved(0);
    setDailyQuests(INITIAL_DAILY_QUESTS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 text-slate-800">
      {/* Top Friendly Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        stars={stars}
        soundSettings={soundSettings}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onOpenTrophies={() => setIsTrophyOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Game Screen View */}
      <main className="flex-1 w-full pb-8">
        {currentScreen === 'home' && (
          <HomeView
            onNavigate={setCurrentScreen}
            stars={stars}
            soundSettings={soundSettings}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onOpenDaily={() => setIsDailyOpen(true)}
            onOpenTrophies={() => setIsTrophyOpen(true)}
          />
        )}

        {currentScreen === 'alphabet' && (
          <AlphabetGame
            soundSettings={soundSettings}
            onEarnStars={handleEarnStars}
            onAlphabetMastered={handleAlphabetMastered}
            masteredLetters={masteredLetters}
          />
        )}

        {currentScreen === 'numbers' && (
          <NumberGame
            soundSettings={soundSettings}
            onEarnStars={handleEarnStars}
            onNumberMastered={handleNumberMastered}
            masteredNumbers={masteredNumbers}
          />
        )}

        {currentScreen === 'shapes-colors' && (
          <ShapeColorGame
            soundSettings={soundSettings}
            onEarnStars={handleEarnStars}
            onShapeMastered={handleShapeMastered}
            masteredShapes={masteredShapes}
          />
        )}

        {currentScreen === 'puzzle-mode' && (
          <InteractivePuzzleGame
            soundSettings={soundSettings}
            onEarnStars={handleEarnStars}
            onPuzzleSolved={handlePuzzleSolved}
          />
        )}
      </main>

      {/* Modals */}
      <TrophyRoomModal
        isOpen={isTrophyOpen}
        onClose={() => setIsTrophyOpen(false)}
        trophies={trophies}
        stars={stars}
        soundEnabled={soundSettings.soundEnabled}
        speechEnabled={soundSettings.speechEnabled}
      />

      <DailyChallengeModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        quests={dailyQuests}
        onClaimQuest={handleClaimQuest}
        soundEnabled={soundSettings.soundEnabled}
        speechEnabled={soundSettings.speechEnabled}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        soundEnabled={soundSettings.soundEnabled}
        speechEnabled={soundSettings.speechEnabled}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={soundSettings}
        onUpdateSettings={newS => setSoundSettings(prev => ({ ...prev, ...newS }))}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
