import React from 'react';
import { Play, Sparkles, Trophy, Calendar, HelpCircle, ArrowRight, Star } from 'lucide-react';
import { GameScreen, SoundSettings } from '../types/game';
import { sounds, speech } from '../utils/audio';
import { MascotBuddy } from './MascotBuddy';

interface HomeViewProps {
  onNavigate: (screen: GameScreen) => void;
  stars: number;
  soundSettings: SoundSettings;
  onOpenTutorial: () => void;
  onOpenDaily: () => void;
  onOpenTrophies: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  stars,
  soundSettings,
  onOpenTutorial,
  onOpenDaily,
  onOpenTrophies
}) => {
  const handlePlayBigButton = () => {
    sounds.playCorrect(soundSettings.soundEnabled);
    speech.speak("Let's explore Alphabet World!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
    onNavigate('alphabet');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden px-4 py-8 max-w-6xl mx-auto">
      {/* Playful Floating Background Elements */}
      <div className="absolute top-10 left-6 text-5xl opacity-80 pointer-events-none animate-float-slow select-none">
        ☁️
      </div>
      <div className="absolute top-16 right-10 text-6xl opacity-80 pointer-events-none animate-float-reverse select-none">
        ☁️
      </div>
      <div className="absolute top-36 right-4 text-4xl pointer-events-none animate-float-slow select-none">
        🎈
      </div>
      <div className="absolute top-44 left-10 text-4xl pointer-events-none animate-float-reverse select-none">
        🎈
      </div>
      <div className="absolute bottom-24 right-16 text-3xl pointer-events-none animate-bounce-gentle select-none">
        ⭐
      </div>
      <div className="absolute bottom-28 left-20 text-3xl pointer-events-none animate-bounce-gentle select-none">
        🌟
      </div>

      {/* Hero Welcome & Title */}
      <div className="relative z-10 text-center space-y-4 my-auto">
        {/* Animated Rainbow Banner */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full border-3 border-amber-300 shadow-md">
          <span className="text-2xl animate-bounce">🌈</span>
          <span className="text-sm sm:text-base font-black text-amber-900 tracking-wide">
            Interactive Kids Learning Paradise (Ages 3–8)
          </span>
          <span className="text-2xl animate-bounce">✨</span>
        </div>

        {/* Big Bouncy Title */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 drop-shadow-sm">
            <span className="text-sky-500">Smart </span>
            <span className="text-amber-500">Kids </span>
            <span className="text-rose-500">Puzzle </span>
            <span className="text-emerald-500">World!</span>
          </h1>
          <p className="text-base sm:text-xl font-bold text-slate-700 max-w-xl mx-auto">
            Learn Alphabets, Numbers 1–100, Shapes, and Colors with voice pronunciations, fun animations & rewards!
          </p>
        </div>

        {/* Mascot Buddy Tip */}
        <div className="max-w-md mx-auto">
          <MascotBuddy
            message="Hi friend! Tap the BIG PLAY button or pick an adventure island below!"
            speechEnabled={soundSettings.speechEnabled}
          />
        </div>

        {/* GIANT COLORFUL PLAY BUTTON */}
        <div className="pt-2 pb-4">
          <button
            onClick={handlePlayBigButton}
            className="group px-10 sm:px-14 py-5 sm:py-6 rounded-3xl btn-3d-green text-white font-black text-2xl sm:text-4xl inline-flex items-center gap-4 cursor-pointer transform hover:scale-105 active:scale-95 shadow-2xl transition-all"
            title="Start Playing Smart Kids Puzzle World"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/30 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white translate-x-0.5" />
            </div>
            <span className="tracking-wide drop-shadow">BIG PLAY!</span>
            <span className="text-3xl animate-bounce">🚀</span>
          </button>
        </div>

        {/* 4 MAIN ADVENTURE ISLANDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 max-w-5xl mx-auto">
          {/* Card 1: Alphabet Puzzle */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              speech.speak("Welcome to Alphabet World! Let's learn A to Z!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              onNavigate('alphabet');
            }}
            className="p-5 rounded-3xl btn-3d-yellow text-amber-950 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🔤
            </div>
            <h3 className="text-xl font-black tracking-tight">Alphabet World</h3>
            <p className="text-xs font-bold text-amber-900/90 leading-tight">
              A to Z with 3D blocks, Apple, Ball, Cat & voice sounds!
            </p>
            <span className="text-xs font-black text-amber-950 bg-white/70 px-3 py-1 rounded-full mt-1 flex items-center gap-1">
              <span>Play A–Z</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 2: Numerical Puzzle */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              speech.speak("Welcome to Number World! Let's count from 1 to 100!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              onNavigate('numbers');
            }}
            className="p-5 rounded-3xl btn-3d-blue text-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🔢
            </div>
            <h3 className="text-xl font-black tracking-tight">Number Land</h3>
            <p className="text-xs font-bold text-white/95 leading-tight">
              Numbers 1 to 100, counting animals & number trains!
            </p>
            <span className="text-xs font-black text-sky-950 bg-white/80 px-3 py-1 rounded-full mt-1 flex items-center gap-1">
              <span>Count 1–100</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 3: Shape & Color Puzzle */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              speech.speak("Welcome to Shapes and Colors! Match pizza slices and pop balloons!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              onNavigate('shapes-colors');
            }}
            className="p-5 rounded-3xl btn-3d-rose text-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🔺
            </div>
            <h3 className="text-xl font-black tracking-tight">Shapes & Colors</h3>
            <p className="text-xs font-bold text-white/95 leading-tight">
              Circle, Triangle, Star, balloon popping & color baskets!
            </p>
            <span className="text-xs font-black text-rose-950 bg-white/80 px-3 py-1 rounded-full mt-1 flex items-center gap-1">
              <span>Match Shapes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 4: Interactive Puzzle Mode */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              speech.speak("Welcome to Puzzle Mode! Drag, drop and arrange pieces!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              onNavigate('puzzle-mode');
            }}
            className="p-5 rounded-3xl btn-3d-purple text-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all transform hover:-translate-y-2 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🧩
            </div>
            <h3 className="text-xl font-black tracking-tight">Puzzle Mode</h3>
            <p className="text-xs font-bold text-white/95 leading-tight">
              Drag & drop jigsaw, number sequences & letter puzzles!
            </p>
            <span className="text-xs font-black text-purple-950 bg-white/80 px-3 py-1 rounded-full mt-1 flex items-center gap-1">
              <span>Solve Puzzles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* Quick Utility Strips: Daily Quest & Beginner Tutorial */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 max-w-xl mx-auto">
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenDaily();
            }}
            className="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-orange-700 border-2 border-orange-300 font-black text-sm flex items-center gap-2 shadow-sm cursor-pointer hover:scale-102 transition-transform"
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Today's Daily Quests (Earn +3⭐)</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenTutorial();
            }}
            className="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-sky-700 border-2 border-sky-300 font-black text-sm flex items-center gap-2 shadow-sm cursor-pointer hover:scale-102 transition-transform"
          >
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <span>How to Play Tutorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
