import React from 'react';
import { X, Trophy as TrophyIcon, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Trophy } from '../types/game';
import { sounds, speech } from '../utils/audio';

interface TrophyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  trophies: Trophy[];
  stars: number;
  soundEnabled: boolean;
  speechEnabled: boolean;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  isOpen,
  onClose,
  trophies,
  stars,
  soundEnabled,
  speechEnabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-4 border-amber-400 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          aria-label="Close Trophy Room"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-4xl mx-auto shadow-md">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Trophy Showcase 🌟
          </h2>
          <p className="text-sm font-bold text-slate-600">
            You currently have <strong className="text-amber-600 text-lg">{stars}</strong> stars! Collect more stars to unlock shiny trophies!
          </p>
        </div>

        {/* Trophies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {trophies.map(trophy => {
            const isUnlocked = stars >= trophy.requiredStars;

            return (
              <div
                key={trophy.id}
                onClick={() => {
                  sounds.playPop(soundEnabled);
                  if (isUnlocked) {
                    speech.speak(`You unlocked the ${trophy.title}! ${trophy.description}`, 0.9, 1.2, speechEnabled);
                  } else {
                    speech.speak(`Earn ${trophy.requiredStars - stars} more stars to unlock ${trophy.title}!`, 0.9, 1.15, speechEnabled);
                  }
                }}
                className={`p-4 rounded-2xl border-3 flex items-center gap-3.5 cursor-pointer transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-md hover:scale-102'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${
                  isUnlocked ? 'bg-amber-300 text-amber-950' : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? trophy.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-800 text-sm truncate">
                      {trophy.title}
                    </h4>
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {trophy.description}
                  </p>
                  <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                    {isUnlocked ? 'Unlocked! ⭐' : `Needs ${trophy.requiredStars} Stars`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom encouragement */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            onClick={() => {
              sounds.playPop(soundEnabled);
              onClose();
            }}
            className="w-full py-3 rounded-2xl btn-3d-yellow font-black text-lg text-amber-950 cursor-pointer"
          >
            Awesome! Keep Learning! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
