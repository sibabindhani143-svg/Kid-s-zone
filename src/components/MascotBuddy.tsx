import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { sounds, speech } from '../utils/audio';

interface MascotBuddyProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'celebrating';
  onTapMessage?: () => void;
  speechEnabled?: boolean;
}

export const MascotBuddy: React.FC<MascotBuddyProps> = ({
  message,
  mood = 'happy',
  onTapMessage,
  speechEnabled = true
}) => {
  const handleSpeak = () => {
    sounds.playPop(true);
    speech.speak(message, 0.9, 1.2, speechEnabled);
    if (onTapMessage) onTapMessage();
  };

  return (
    <div className="flex items-center gap-3 bg-white/90 p-3 sm:p-4 rounded-3xl shadow-lg border-2 border-amber-300 max-w-xl mx-auto my-3 relative overflow-hidden transition-all">
      {/* Decorative background sparkle */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-100 rounded-full blur-xl pointer-events-none" />

      {/* Mascot character */}
      <div 
        onClick={handleSpeak}
        className="relative cursor-pointer shrink-0 group select-none"
        title="Tap me to hear advice!"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-200 border-4 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:scale-110 transition-transform animate-bounce-gentle">
          {mood === 'celebrating' ? '🎉' : mood === 'thinking' ? '🤔' : '🐼'}
        </div>
        <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-amber-950 p-1 rounded-full text-xs shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Speech bubble */}
      <div 
        onClick={handleSpeak}
        className="flex-1 cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
            Pippa the Panda
          </span>
          <button 
            type="button" 
            className="text-amber-500 hover:text-amber-700 p-1 rounded-full group-hover:scale-110 transition-transform"
            aria-label="Listen to mascot hint"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
          "{message}"
        </p>
      </div>
    </div>
  );
};
