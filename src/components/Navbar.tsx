import React from 'react';
import { Volume2, VolumeX, Music, HelpCircle, Trophy as TrophyIcon, Sparkles, Home, Settings, Calendar } from 'lucide-react';
import { GameScreen, SoundSettings } from '../types/game';
import { sounds, speech } from '../utils/audio';

interface NavbarProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  stars: number;
  soundSettings: SoundSettings;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenTrophies: () => void;
  onOpenDaily: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  stars,
  soundSettings,
  onToggleSound,
  onToggleMusic,
  onOpenTrophies,
  onOpenDaily,
  onOpenTutorial,
  onOpenSettings
}) => {
  return (
    <header className="relative z-30 w-full px-4 py-3 bg-white/80 backdrop-blur-md border-b-4 border-sky-300 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand or Back to Home */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' ? (
            <button
              onClick={() => {
                sounds.playPop(soundSettings.soundEnabled);
                onNavigate('home');
              }}
              className="px-4 py-2 rounded-2xl btn-3d-yellow flex items-center gap-2 text-amber-950 font-bold text-base sm:text-lg cursor-pointer"
              title="Go back to Home"
            >
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Home</span>
            </button>
          ) : (
            <div 
              onClick={() => {
                sounds.playPop(soundSettings.soundEnabled);
                speech.speak("Welcome to Smart Kids Puzzle World!", soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span className="text-3xl sm:text-4xl animate-bounce-gentle">🌈</span>
              <div className="leading-tight">
                <h1 className="text-xl sm:text-2xl font-black text-sky-600 tracking-tight flex items-center gap-1">
                  <span>Smart Kids</span>
                  <span className="text-amber-500">World</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 hidden sm:block">Ages 3–8 Learning Fun</p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Stars Reward Meter */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div 
            onClick={() => {
              sounds.playDing(soundSettings.soundEnabled);
              speech.speak(`You have earned ${stars} golden stars! Wonderful!`, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-amber-100 border-2 border-amber-400 px-3 py-1.5 rounded-full shadow-inner cursor-pointer hover:scale-105 transition-transform"
            title="Your Stars"
          >
            <span className="text-2xl sm:text-3xl animate-spin" style={{ animationDuration: '6s' }}>⭐</span>
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Stars</span>
              <span className="text-lg sm:text-xl font-black text-amber-900 tabular-nums">{stars}</span>
            </div>
          </div>

          {/* Daily Quests button */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenDaily();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl btn-3d-orange text-white flex items-center gap-1.5 font-bold cursor-pointer"
            title="Daily Learning Challenges"
          >
            <Calendar className="w-5 h-5" />
            <span className="hidden md:inline text-sm">Daily Quests</span>
          </button>

          {/* Trophy Room button */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenTrophies();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl btn-3d-purple text-white flex items-center gap-1.5 font-bold cursor-pointer"
            title="Trophy Showcase"
          >
            <TrophyIcon className="w-5 h-5 text-yellow-200" />
            <span className="hidden md:inline text-sm">Trophies</span>
          </button>
        </div>

        {/* Right: Audio and Utility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Music Toggle */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onToggleMusic();
            }}
            className={`p-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
              soundSettings.musicEnabled
                ? 'btn-3d-green text-white'
                : 'bg-slate-200 border-b-4 border-slate-300 text-slate-500'
            }`}
            title={soundSettings.musicEnabled ? 'Turn Off Music' : 'Turn On Music'}
            aria-label="Toggle background music"
          >
            <Music className={`w-5 h-5 ${soundSettings.musicEnabled ? 'animate-bounce-gentle' : ''}`} />
          </button>

          {/* Sound/Voice Toggle */}
          <button
            onClick={() => {
              sounds.playPop(true);
              onToggleSound();
            }}
            className={`p-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
              soundSettings.soundEnabled
                ? 'btn-3d-blue text-white'
                : 'bg-slate-200 border-b-4 border-slate-300 text-slate-500'
            }`}
            title={soundSettings.soundEnabled ? 'Mute Sounds & Voice' : 'Unmute Sounds & Voice'}
            aria-label="Toggle sound effects and speech"
          >
            {soundSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Tutorial Help Button */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenTutorial();
            }}
            className="p-2.5 rounded-2xl btn-3d-rose text-white font-bold cursor-pointer"
            title="How to Play"
            aria-label="How to play tutorial"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              onOpenSettings();
            }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700 font-bold cursor-pointer"
            title="Game Settings"
            aria-label="Game settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
