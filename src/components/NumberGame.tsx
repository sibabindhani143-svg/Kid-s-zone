import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Plus, ArrowRight, Train } from 'lucide-react';
import { NumberSubMode, SoundSettings } from '../types/game';
import { getNumberWord, NUMBER_EMOJIS, NUMBER_COLORS } from '../utils/data';
import { sounds, speech } from '../utils/audio';
import { MascotBuddy } from './MascotBuddy';

interface NumberGameProps {
  soundSettings: SoundSettings;
  onEarnStars: (count: number) => void;
  onNumberMastered: (num: number) => void;
  masteredNumbers: number[];
}

export const NumberGame: React.FC<NumberGameProps> = ({
  soundSettings,
  onEarnStars,
  onNumberMastered,
  masteredNumbers
}) => {
  const [subMode, setSubMode] = useState<NumberSubMode>('explore');
  const [selectedNumber, setSelectedNumber] = useState<number>(7);
  const [rangeFilter, setRangeFilter] = useState<'1-10' | '11-20' | '21-50' | '51-100'>('1-10');

  // Counting Objects Game State
  const [countTarget, setCountTarget] = useState<number>(5);
  const [countEmoji, setCountEmoji] = useState<string>('⭐');
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [countOptions, setCountOptions] = useState<number[]>([]);
  const [countFeedback, setCountFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Number Train Sequence Game State
  const [sequenceStart, setSequenceStart] = useState<number>(4);
  const [missingOffset, setMissingOffset] = useState<number>(2); // e.g. 4, 5, [6], 7
  const [trainStep, setTrainStep] = useState<number>(1);
  const [sequenceOptions, setSequenceOptions] = useState<number[]>([]);
  const [sequenceFeedback, setSequenceFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Initialize Counting Game round
  const startNewCountRound = () => {
    const target = Math.floor(Math.random() * 10) + 1; // 1 to 10 for toddlers/kids
    const emoji = NUMBER_EMOJIS[Math.floor(Math.random() * NUMBER_EMOJIS.length)];
    setCountTarget(target);
    setCountEmoji(emoji);
    setTappedIndices([]);
    setCountFeedback(null);

    // Pick 3 distractor numbers
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const d = Math.max(1, Math.min(10, target + (Math.floor(Math.random() * 5) - 2)));
      if (d !== target) distractors.add(d);
    }
    const options = [target, ...Array.from(distractors)].sort(() => 0.5 - Math.random());
    setCountOptions(options);

    setTimeout(() => {
      speech.speak(
        `Can you count the items on screen? Tap each one to count!`,
        soundSettings.speechRate,
        1.15,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  // Initialize Number Train Sequence round
  const startNewTrainRound = () => {
    const step = Math.random() > 0.4 ? 1 : (Math.random() > 0.5 ? 2 : 10);
    setTrainStep(step);

    const maxStart = step === 10 ? 60 : (step === 2 ? 20 : 15);
    const start = Math.floor(Math.random() * maxStart) + 1;
    setSequenceStart(start);

    const missing = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
    setMissingOffset(missing);
    setSequenceFeedback(null);

    const correctNum = start + missing * step;

    // Distractors
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const d = correctNum + (Math.floor(Math.random() * 7) - 3) * (step === 10 ? 10 : 1);
      if (d > 0 && d !== correctNum) distractors.add(d);
    }
    const opts = [correctNum, ...Array.from(distractors)].sort(() => 0.5 - Math.random());
    setSequenceOptions(opts);

    setTimeout(() => {
      speech.speak(
        `What number is missing in the train?`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  useEffect(() => {
    if (subMode === 'count-objects') {
      startNewCountRound();
    } else if (subMode === 'sequence-train') {
      startNewTrainRound();
    }
  }, [subMode]);

  // Pronounce number
  const handlePronounceNumber = (n: number) => {
    sounds.playPop(soundSettings.soundEnabled);
    setSelectedNumber(n);
    const word = getNumberWord(n);
    speech.speak(`${n}! ${word}!`, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
    onNumberMastered(n);
  };

  // Tap an item in counting game
  const handleTapCountItem = (index: number) => {
    if (tappedIndices.includes(index)) return;
    sounds.playDing(soundSettings.soundEnabled);
    const newCount = tappedIndices.length + 1;
    setTappedIndices(prev => [...prev, index]);
    speech.speak(`${newCount}`, soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
  };

  // Select count option
  const handleSelectCountAnswer = (ans: number) => {
    if (countFeedback === 'correct') return;

    if (ans === countTarget) {
      sounds.playCorrect(soundSettings.soundEnabled);
      setCountFeedback('correct');
      onEarnStars(2);
      onNumberMastered(ans);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      speech.speak(
        `Yes! There are ${countTarget} items! Excellent!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );

      setTimeout(() => {
        startNewCountRound();
      }, 1800);
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      setCountFeedback('wrong');
      speech.tryAgain(soundSettings.speechEnabled);
      setTimeout(() => setCountFeedback(null), 1000);
    }
  };

  // Select sequence train option
  const handleSelectSequenceAnswer = (ans: number) => {
    if (sequenceFeedback === 'correct') return;
    const correctNum = sequenceStart + missingOffset * trainStep;

    if (ans === correctNum) {
      sounds.playCorrect(soundSettings.soundEnabled);
      setSequenceFeedback('correct');
      onEarnStars(2);
      onNumberMastered(ans);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });

      speech.speak(
        `Choo choo! ${ans} completes the train! Wonderful!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );

      setTimeout(() => {
        startNewTrainRound();
      }, 1800);
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      setSequenceFeedback('wrong');
      speech.tryAgain(soundSettings.speechEnabled);
      setTimeout(() => setSequenceFeedback(null), 1000);
    }
  };

  // Determine numbers to show in explorer
  const getRangeNumbers = () => {
    switch (rangeFilter) {
      case '1-10':
        return Array.from({ length: 10 }, (_, i) => i + 1);
      case '11-20':
        return Array.from({ length: 10 }, (_, i) => i + 11);
      case '21-50':
        return Array.from({ length: 30 }, (_, i) => i + 21);
      case '51-100':
        return Array.from({ length: 50 }, (_, i) => i + 51);
      default:
        return Array.from({ length: 10 }, (_, i) => i + 1);
    }
  };

  const numbersList = getRangeNumbers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Submode Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('explore');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'explore'
              ? 'btn-3d-blue text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🔢 Numbers 1–100 Wall
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('count-objects');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'count-objects'
              ? 'btn-3d-yellow text-amber-950 scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🧁 Count the Objects
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('sequence-train');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'sequence-train'
              ? 'btn-3d-rose text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🚂 Number Train
        </button>
      </div>

      {/* Mascot Guidance */}
      <MascotBuddy
        message={
          subMode === 'explore'
            ? `Tap any number up to 100 to hear how to say it! Currently showing ${selectedNumber} (${getNumberWord(selectedNumber)})!`
            : subMode === 'count-objects'
            ? "Tap each item to count, then choose the correct total number below!"
            : "Look at the number train cars! Which number is missing in the middle?"
        }
        speechEnabled={soundSettings.speechEnabled}
      />

      {/* MODE 1: NUMBERS 1-100 EXPLORER */}
      {subMode === 'explore' && (
        <div className="space-y-6">
          {/* Big Featured Number Display */}
          <div className="bg-gradient-to-br from-sky-50 to-indigo-100 rounded-3xl p-6 sm:p-8 border-4 border-sky-300 shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
            {/* Giant 3D Number Block */}
            <div
              onClick={() => handlePronounceNumber(selectedNumber)}
              className="group cursor-pointer flex flex-col items-center"
              title="Tap to hear number pronunciation"
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 border-b-8 border-r-4 border-blue-800 shadow-2xl flex items-center justify-center transform group-hover:scale-105 active:scale-95 transition-all">
                <span className="text-7xl sm:text-8xl font-black text-white drop-shadow-md select-none tabular-nums">
                  {selectedNumber}
                </span>
              </div>
              <span className="mt-2 text-xs font-bold text-sky-800 bg-sky-200/80 px-3 py-1 rounded-full">
                Tap to hear voice 🔊
              </span>
            </div>

            {/* Visual Count representation */}
            <div className="flex-1 max-w-md text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-sky-200 text-xs font-bold text-sky-700 uppercase tracking-wide">
                <span>Number Explorer</span>
                <span>•</span>
                <span>Spelled: {getNumberWord(selectedNumber)}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
                Number {selectedNumber} is <span className="text-sky-600">{getNumberWord(selectedNumber)}</span>
              </h2>

              {/* Visual Counting Objects Box */}
              <div className="bg-white/90 p-4 rounded-2xl border-2 border-sky-200 shadow-inner">
                <p className="text-xs font-bold text-slate-500 mb-2">
                  Visual count ({selectedNumber} items):
                </p>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1">
                  {Array.from({ length: Math.min(selectedNumber, 50) }).map((_, i) => (
                    <span key={i} className="text-lg inline-block hover:scale-125 transition-transform">
                      ⭐
                    </span>
                  ))}
                  {selectedNumber > 50 && (
                    <span className="text-xs font-bold text-slate-500 self-center">
                      ...and {selectedNumber - 50} more!
                    </span>
                  )}
                </div>
              </div>

              {/* Pronounce Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handlePronounceNumber(selectedNumber)}
                  className="px-6 py-3 rounded-2xl btn-3d-blue text-white font-black text-lg flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>Say "{getNumberWord(selectedNumber)}"</span>
                </button>

                {masteredNumbers.includes(selectedNumber) && (
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-2xl font-bold text-sm border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mastered! ⭐</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Range Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: '1-10', label: '1 to 10 (Beginner)' },
              { id: '11-20', label: '11 to 20 (Junior)' },
              { id: '21-50', label: '21 to 50 (Explorer)' },
              { id: '51-100', label: '51 to 100 (Master)' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => {
                  sounds.playPop(soundSettings.soundEnabled);
                  setRangeFilter(range.id as typeof rangeFilter);
                }}
                className={`px-4 py-2 rounded-2xl font-black text-sm transition-all cursor-pointer ${
                  rangeFilter === range.id
                    ? 'btn-3d-blue text-white scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
            {numbersList.map(n => {
              const isSelected = selectedNumber === n;
              const isMastered = masteredNumbers.includes(n);
              const colorClass = NUMBER_COLORS[n % NUMBER_COLORS.length];

              return (
                <button
                  key={n}
                  onClick={() => handlePronounceNumber(n)}
                  className={`group relative p-3 rounded-2xl font-black text-2xl sm:text-3xl text-white flex flex-col items-center justify-center cursor-pointer transition-all transform hover:-translate-y-1 ${
                    isSelected ? 'ring-4 ring-amber-400 scale-105' : ''
                  } ${colorClass} border-b-6 shadow-md`}
                >
                  {isMastered && (
                    <span className="absolute -top-1 -right-1 text-xs bg-yellow-300 text-amber-950 p-0.5 rounded-full shadow">
                      ⭐
                    </span>
                  )}
                  <span className="drop-shadow">{n}</span>
                  <span className="text-[10px] font-bold text-white/90 truncate max-w-full">
                    {getNumberWord(n)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: COUNT THE OBJECTS GAME */}
      {subMode === 'count-objects' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                Count the {countEmoji} Items!
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                Tap each item to count it out loud!
              </p>
            </div>

            {/* Objects Arena */}
            <div className="min-h-44 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-dashed border-amber-300 flex flex-wrap items-center justify-center gap-4">
              {Array.from({ length: countTarget }).map((_, idx) => {
                const isTapped = tappedIndices.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTapCountItem(idx)}
                    className={`relative p-3 rounded-2xl cursor-pointer transition-all transform ${
                      isTapped
                        ? 'scale-110 bg-amber-200 border-2 border-amber-400 shadow-inner'
                        : 'hover:scale-125 bg-white border border-amber-200 shadow-md'
                    }`}
                  >
                    <span className="text-5xl sm:text-6xl select-none animate-bounce-gentle">
                      {countEmoji}
                    </span>
                    {isTapped && (
                      <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-white rounded-full font-black text-xs flex items-center justify-center shadow">
                        {tappedIndices.indexOf(idx) + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress status */}
            <div className="text-base font-bold text-amber-800">
              You tapped {tappedIndices.length} of {countTarget} items!
            </div>

            {/* Answer Selector */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-3">
                How many are there in total?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {countOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelectCountAnswer(opt)}
                    className="h-20 rounded-2xl btn-3d-yellow font-black text-4xl text-amber-950 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback message */}
            {countFeedback === 'correct' && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg animate-bounce">
                🎉 Wonderful! Exactly {countTarget}! +2 Stars!
              </div>
            )}
            {countFeedback === 'wrong' && (
              <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-900 font-black text-lg animate-wiggle">
                Oops! Let's count together and try again! 💖
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: NUMBER TRAIN SEQUENCE */}
      {subMode === 'sequence-train' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-rose-300 shadow-xl text-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-rose-600 font-black text-sm uppercase tracking-wider mb-1">
                <Train className="w-5 h-5" />
                <span>Number Train Puzzle</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                Which number is missing in the train?
              </h3>
            </div>

            {/* Train Carriages */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 p-4 bg-sky-50 rounded-3xl border-2 border-sky-200 overflow-x-auto">
              {/* Locomotive Engine */}
              <div className="px-4 py-4 rounded-2xl bg-rose-600 text-white font-black flex flex-col items-center shadow-lg border-b-6 border-rose-800">
                <span className="text-3xl sm:text-4xl">🚂</span>
                <span className="text-xs uppercase">Engine</span>
              </div>

              {/* 4 Carriages */}
              {[0, 1, 2, 3].map(offset => {
                const num = sequenceStart + offset * trainStep;
                const isMissing = offset === missingOffset;

                return (
                  <div
                    key={offset}
                    className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center font-black text-3xl sm:text-4xl shadow-md border-b-6 transition-all ${
                      isMissing
                        ? 'bg-amber-100 border-dashed border-4 border-amber-400 text-amber-600 animate-pulse'
                        : 'bg-sky-400 border-sky-600 text-white'
                    }`}
                  >
                    {isMissing ? (
                      <span className="text-2xl font-black text-amber-500">?</span>
                    ) : (
                      <span>{num}</span>
                    )}
                    <span className="text-[10px] text-white/90 mt-1 uppercase font-bold">
                      Car #{offset + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Answer Options */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-3">
                Tap the correct carriage number to attach:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sequenceOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelectSequenceAnswer(opt)}
                    className="h-20 rounded-2xl btn-3d-green font-black text-4xl text-white cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {sequenceFeedback === 'correct' && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg animate-bounce">
                🎉 Choo Choo! Train complete! +2 Stars!
              </div>
            )}
            {sequenceFeedback === 'wrong' && (
              <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-900 font-black text-lg animate-wiggle">
                Oops! Check the pattern and try again! 🚂
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
