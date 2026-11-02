import React from 'react';
import { X, Calendar, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyQuest } from '../types/game';
import { sounds, speech } from '../utils/audio';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  soundEnabled: boolean;
  speechEnabled: boolean;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  quests,
  onClaimQuest,
  soundEnabled,
  speechEnabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-4 border-orange-400 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop(soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          aria-label="Close Daily Quests"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-orange-100 border-4 border-orange-300 flex items-center justify-center text-4xl mx-auto shadow-md">
            🎁
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Today's Learning Quests!
          </h2>
          <p className="text-sm font-bold text-slate-600">
            Complete fun missions every day to earn bonus golden stars!
          </p>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {quests.map(quest => {
            const isFinished = quest.currentCount >= quest.targetCount;

            return (
              <div
                key={quest.id}
                className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{quest.icon}</span>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm sm:text-base">
                      {quest.title}
                    </h4>
                    <p className="text-xs font-bold text-orange-700 mt-0.5">
                      Progress: {Math.min(quest.currentCount, quest.targetCount)} / {quest.targetCount}
                    </p>
                  </div>
                </div>

                <div>
                  {quest.completed ? (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Claimed!</span>
                    </div>
                  ) : isFinished ? (
                    <button
                      onClick={() => {
                        sounds.playCorrect(soundEnabled);
                        confetti({ particleCount: 50, spread: 60 });
                        onClaimQuest(quest.id);
                        speech.speak(`You completed ${quest.title}! Here are ${quest.rewardStars} bonus stars!`, 0.9, 1.25, speechEnabled);
                      }}
                      className="px-3 py-1.5 rounded-xl btn-3d-yellow text-amber-950 font-black text-xs flex items-center gap-1 cursor-pointer animate-bounce"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim +{quest.rewardStars}⭐</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      +{quest.rewardStars} ⭐ Reward
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            onClick={() => {
              sounds.playPop(soundEnabled);
              onClose();
            }}
            className="w-full py-3 rounded-2xl btn-3d-orange font-black text-lg text-white cursor-pointer"
          >
            Let's Go Learn! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
