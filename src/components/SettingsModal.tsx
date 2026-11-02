import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Mic, RotateCcw, Check } from 'lucide-react';
import { SoundSettings } from '../types/game';
import { sounds, speech } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SoundSettings;
  onUpdateSettings: (newSettings: Partial<SoundSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-4 border-sky-400 shadow-2xl relative">
        <button
          onClick={() => {
            sounds.playPop(settings.soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          aria-label="Close Settings"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-100 border-4 border-sky-300 flex items-center justify-center text-3xl mx-auto shadow-md">
            ⚙️
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Game Settings
          </h2>
          <p className="text-xs font-bold text-slate-500">
            Parent & Teacher Controls
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-sky-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Sound Effects</h4>
                <p className="text-xs text-slate-500">Pops, chimes, and cheers</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                sounds.playPop(true);
                onUpdateSettings({ soundEnabled: next });
              }}
              className={`px-4 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Background Music */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Background Music</h4>
                <p className="text-xs text-slate-500">Soothing playful nursery tune</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.musicEnabled;
                sounds.playPop(settings.soundEnabled);
                onUpdateSettings({ musicEnabled: next });
                sounds.toggleMusic(next);
              }}
              className={`px-4 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                settings.musicEnabled ? 'bg-purple-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              {settings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice Pronunciation */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Mic className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">English Voice</h4>
                <p className="text-xs text-slate-500">Clear pronunciations & encouragement</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.speechEnabled;
                sounds.playPop(settings.soundEnabled);
                onUpdateSettings({ speechEnabled: next });
                if (next) speech.speak("Voice is on!", 0.9, 1.2, true);
              }}
              className={`px-4 py-1.5 rounded-full font-black text-xs transition-all cursor-pointer ${
                settings.speechEnabled ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}
            >
              {settings.speechEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice Speed */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800">Pronunciation Speed</h4>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                {settings.speechRate < 0.9 ? 'Gentle & Slow (Age 3-4)' : 'Normal (Age 5-8)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playPop(settings.soundEnabled);
                  onUpdateSettings({ speechRate: 0.8 });
                  speech.speak("Slow friendly voice for toddlers!", 0.8, 1.2, settings.speechEnabled);
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  settings.speechRate < 0.9
                    ? 'btn-3d-blue text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                🐢 Slow (Ages 3–4)
              </button>
              <button
                onClick={() => {
                  sounds.playPop(settings.soundEnabled);
                  onUpdateSettings({ speechRate: 1.0 });
                  speech.speak("Normal speed for older kids!", 1.0, 1.2, settings.speechEnabled);
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  settings.speechRate >= 0.9
                    ? 'btn-3d-blue text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
              >
                🐰 Normal (Ages 5–8)
              </button>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="pt-2">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 cursor-pointer"
              >
                Reset Stars & Progress
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-center">
                <p className="text-xs font-bold text-rose-700">
                  Are you sure you want to restart all stars and trophies?
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                      sounds.playPop(settings.soundEnabled);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              sounds.playPop(settings.soundEnabled);
              onClose();
            }}
            className="w-full py-3 rounded-2xl btn-3d-blue font-black text-base text-white cursor-pointer"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
