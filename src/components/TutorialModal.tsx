import React from 'react';
import { X, Volume2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sounds, speech } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  speechEnabled: boolean;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  speechEnabled
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Tap & Hear Voice',
      emoji: '🔊',
      desc: 'Tap any letter, number, or shape block! Pippa will pronounce it out loud so you can learn quickly!'
    },
    {
      title: '2. Count & Play Puzzles',
      emoji: '🔢',
      desc: 'Tap cute stars and animals to count them! Drag or tap puzzle pieces into the right slots!'
    },
    {
      title: '3. Pop & Match Shapes',
      emoji: '🎈',
      desc: 'Pop flying balloons of the right color, and match yummy items like pizza into triangles!'
    },
    {
      title: '4. Win Stars & Trophies',
      emoji: '⭐',
      desc: 'Earn shiny golden stars with every right answer! Open the Trophy Room to collect sweet badges!'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-4 border-rose-400 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          aria-label="Close Tutorial"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-100 border-4 border-rose-300 flex items-center justify-center text-4xl mx-auto shadow-md">
            🎓
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            How to Play! 🎈
          </h2>
          <p className="text-sm font-bold text-slate-600">
            It's super easy and fun for kids aged 3–8!
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((st, i) => (
            <div
              key={i}
              onClick={() => {
                sounds.playPop(soundEnabled);
                speech.speak(`${st.title}! ${st.desc}`, 0.9, 1.2, speechEnabled);
              }}
              className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3.5 cursor-pointer hover:scale-102 transition-transform"
            >
              <span className="text-3xl shrink-0 mt-0.5">{st.emoji}</span>
              <div>
                <h4 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <span>{st.title}</span>
                  <Volume2 className="w-4 h-4 text-rose-500" />
                </h4>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 leading-snug">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            onClick={() => {
              sounds.playPop(soundEnabled);
              speech.speak("Yay! Let's start the adventure!", 0.9, 1.2, speechEnabled);
              onClose();
            }}
            className="w-full py-3 rounded-2xl btn-3d-rose font-black text-lg text-white cursor-pointer"
          >
            I'm Ready to Play! 🌟
          </button>
        </div>
      </div>
    </div>
  );
};
