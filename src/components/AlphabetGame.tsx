import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowLeft, ArrowRight, Play, Award } from 'lucide-react';
import { AlphabetItem, AlphabetSubMode, SoundSettings } from '../types/game';
import { ALPHABET_DATA } from '../utils/data';
import { sounds, speech } from '../utils/audio';
import { MascotBuddy } from './MascotBuddy';

interface AlphabetGameProps {
  soundSettings: SoundSettings;
  onEarnStars: (count: number) => void;
  onAlphabetMastered: (letter: string) => void;
  masteredLetters: string[];
}

export const AlphabetGame: React.FC<AlphabetGameProps> = ({
  soundSettings,
  onEarnStars,
  onAlphabetMastered,
  masteredLetters
}) => {
  const [subMode, setSubMode] = useState<AlphabetSubMode>('explore');
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // "Find the Letter" challenge state
  const [quizTarget, setQuizTarget] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [quizOptions, setQuizOptions] = useState<AlphabetItem[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // "Match Shadow" challenge state
  const [matchPairs, setMatchPairs] = useState<{ item: AlphabetItem; matched: boolean }[]>([]);
  const [selectedMatchLetter, setSelectedMatchLetter] = useState<AlphabetItem | null>(null);

  // Initialize or reset quiz
  const startNewQuizRound = () => {
    const randomTarget = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setQuizTarget(randomTarget);

    // Pick 3 distractors
    const others = ALPHABET_DATA.filter(item => item.letter !== randomTarget.letter);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [randomTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setQuizOptions(options);
    setQuizFeedback(null);

    // Announce quiz question
    setTimeout(() => {
      speech.speak(
        `Can you find ${randomTarget.letter}? ${randomTarget.letter} for ${randomTarget.word}!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  // Initialize shadow matching
  const startNewMatchRound = () => {
    const subset = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, 4);
    setMatchPairs(subset.map(item => ({ item, matched: false })));
    setSelectedMatchLetter(null);
    setTimeout(() => {
      speech.speak(
        "Match the alphabet blocks with their cute pictures!",
        soundSettings.speechRate,
        1.15,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  useEffect(() => {
    if (subMode === 'find-letter') {
      startNewQuizRound();
    } else if (subMode === 'match-shadow') {
      startNewMatchRound();
    }
  }, [subMode]);

  // Pronounce current letter
  const handlePronounceLetter = (item: AlphabetItem) => {
    sounds.playPop(soundSettings.soundEnabled);
    setSelectedLetter(item);
    const phrase = `${item.letter}! ${item.letter} for ${item.word}!`;
    speech.speak(phrase, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
    onAlphabetMastered(item.letter);
  };

  // Handle Quiz selection
  const handleSelectQuizOption = (option: AlphabetItem) => {
    if (quizFeedback === 'correct') return;

    if (option.letter === quizTarget.letter) {
      // Correct!
      sounds.playCorrect(soundSettings.soundEnabled);
      setQuizFeedback('correct');
      setQuizScore(prev => prev + 1);
      onEarnStars(2);
      onAlphabetMastered(option.letter);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      speech.cheer(soundSettings.speechEnabled);

      setTimeout(() => {
        startNewQuizRound();
      }, 1600);
    } else {
      // Try again
      sounds.playWrong(soundSettings.soundEnabled);
      setQuizFeedback('wrong');
      speech.tryAgain(soundSettings.speechEnabled);

      setTimeout(() => {
        setQuizFeedback(null);
      }, 1000);
    }
  };

  // Handle Match Game clicks
  const handleSelectLetterForMatch = (item: AlphabetItem) => {
    sounds.playPop(soundSettings.soundEnabled);
    setSelectedMatchLetter(item);
    speech.speak(item.letter, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
  };

  const handleSelectPictureForMatch = (item: AlphabetItem) => {
    if (!selectedMatchLetter) {
      speech.speak(`This is ${item.word}. Tap a letter first!`, soundSettings.speechRate, 1.1, soundSettings.speechEnabled);
      return;
    }

    if (selectedMatchLetter.letter === item.letter) {
      // Match success!
      sounds.playCorrect(soundSettings.soundEnabled);
      setMatchPairs(prev => prev.map(p => p.item.letter === item.letter ? { ...p, matched: true } : p));
      setSelectedMatchLetter(null);
      onEarnStars(2);
      onAlphabetMastered(item.letter);

      speech.speak(`Yes! ${item.letter} is for ${item.word}!`, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);

      // Check if all matched
      const allDone = matchPairs.every(p => p.item.letter === item.letter || p.matched);
      if (allDone) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 }
        });
        setTimeout(() => {
          sounds.playFanfare(soundSettings.soundEnabled);
          speech.speak("Hooray! All puzzles matched!", soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
          setTimeout(startNewMatchRound, 2000);
        }, 800);
      }
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      speech.tryAgain(soundSettings.speechEnabled);
    }
  };

  const filteredLetters = activeCategory === 'all'
    ? ALPHABET_DATA
    : ALPHABET_DATA.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Submode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('explore');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'explore'
              ? 'btn-3d-yellow text-amber-950 scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🔤 Alphabet Cards (A–Z)
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('find-letter');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'find-letter'
              ? 'btn-3d-green text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🎯 Find the Letter
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('match-shadow');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'match-shadow'
              ? 'btn-3d-purple text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🧩 Picture Match
        </button>
      </div>

      {/* Mascot Guidance */}
      <MascotBuddy
        message={
          subMode === 'explore'
            ? `Tap any letter block to hear how it sounds! Currently showing ${selectedLetter.letter} for ${selectedLetter.word}!`
            : subMode === 'find-letter'
            ? `Can you tap the letter ${quizTarget.letter} for ${quizTarget.word}?`
            : "Tap a colorful letter block, then tap its matching picture!"
        }
        speechEnabled={soundSettings.speechEnabled}
      />

      {/* MODE 1: EXPLORE ALPHABET CARDS */}
      {subMode === 'explore' && (
        <div className="space-y-6">
          {/* Big Featured 3D Block View */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
            {/* Giant 3D Letter Cube */}
            <div 
              onClick={() => handlePronounceLetter(selectedLetter)}
              className="group cursor-pointer flex flex-col items-center"
              title="Tap to hear letter sound"
            >
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-rose-400 to-red-500 border-b-8 border-r-4 border-red-700 shadow-2xl flex items-center justify-center transform group-hover:scale-105 active:scale-95 transition-all">
                <span className="text-8xl sm:text-9xl font-black text-white drop-shadow-md select-none">
                  {selectedLetter.letter}
                </span>
              </div>
              <span className="mt-2 text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full">
                Tap letter to hear sound 🔊
              </span>
            </div>

            {/* Picture & Phonics Information */}
            <div className="flex-1 max-w-md text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-700 uppercase tracking-wide">
                <span>{selectedLetter.category}</span>
                <span>•</span>
                <span>{selectedLetter.phonics}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-6xl sm:text-7xl animate-bounce-gentle">
                  {selectedLetter.emoji}
                </span>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
                    {selectedLetter.letter} is for {selectedLetter.word}
                  </h2>
                  <p className="text-base text-slate-600 font-semibold">
                    {selectedLetter.exampleSentence}
                  </p>
                </div>
              </div>

              {/* Big Pronunciation Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handlePronounceLetter(selectedLetter)}
                  className="px-6 py-3 rounded-2xl btn-3d-green text-white font-black text-lg flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>Pronounce "{selectedLetter.word}"</span>
                </button>

                {masteredLetters.includes(selectedLetter.letter) && (
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-2xl font-bold text-sm border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mastered! ⭐</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Categories filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All A–Z' },
              { id: 'animal', label: '🐶 Animals' },
              { id: 'fruit', label: '🍎 Fruits' },
              { id: 'toy', label: '🪁 Toys' },
              { id: 'nature', label: '🌈 Nature' },
              { id: 'vehicle', label: '🚂 Vehicles' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playPop(soundSettings.soundEnabled);
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* A–Z 3D Blocks Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
            {filteredLetters.map(item => {
              const isSelected = selectedLetter.letter === item.letter;
              const isMastered = masteredLetters.includes(item.letter);

              return (
                <button
                  key={item.letter}
                  onClick={() => handlePronounceLetter(item)}
                  className={`group relative p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:-translate-y-1 ${
                    isSelected
                      ? 'ring-4 ring-amber-400 scale-105'
                      : ''
                  } ${item.color} ${item.shadowColor} border-b-6 shadow-md`}
                >
                  {isMastered && (
                    <span className="absolute -top-1.5 -right-1.5 text-xs bg-yellow-300 text-amber-950 p-0.5 rounded-full shadow">
                      ⭐
                    </span>
                  )}
                  <span className="text-4xl sm:text-5xl font-black text-white drop-shadow">
                    {item.letter}
                  </span>
                  <span className="text-2xl mt-1 group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-black text-white/95 mt-0.5 tracking-wide">
                    {item.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: FIND THE LETTER QUIZ */}
      {subMode === 'find-letter' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-sky-300 shadow-xl text-center space-y-4">
            <div className="flex items-center justify-between text-slate-500 font-bold text-sm">
              <span>Challenge Mode</span>
              <span className="flex items-center gap-1 text-amber-600">
                Score: <strong className="text-xl text-amber-700">{quizScore}</strong> ⭐
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              Can you find the letter:
            </h3>

            {/* Target Clue Block */}
            <div 
              onClick={() => {
                speech.speak(`Find the letter ${quizTarget.letter} for ${quizTarget.word}!`, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              }}
              className="inline-flex flex-col items-center justify-center p-4 bg-sky-50 border-2 border-sky-200 rounded-3xl cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-7xl sm:text-8xl animate-bounce-gentle">
                {quizTarget.emoji}
              </span>
              <span className="text-xl font-black text-sky-800 mt-1">
                {quizTarget.word}
              </span>
              <span className="text-xs font-bold text-sky-600 flex items-center gap-1 mt-1">
                <Volume2 className="w-3.5 h-3.5" /> Tap to hear clue
              </span>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {quizOptions.map(option => (
                <button
                  key={option.letter}
                  onClick={() => handleSelectQuizOption(option)}
                  className={`h-28 sm:h-32 rounded-3xl font-black text-5xl sm:text-6xl text-white cursor-pointer transition-all transform hover:scale-105 ${
                    option.color
                  } ${option.shadowColor} border-b-8 shadow-lg active:translate-y-1 active:border-b-2`}
                >
                  {option.letter}
                </button>
              ))}
            </div>

            {/* Instant Feedback indicator */}
            {quizFeedback === 'correct' && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg animate-bounce">
                🎉 Excellent! You found {quizTarget.letter} for {quizTarget.word}! +2 Stars!
              </div>
            )}
            {quizFeedback === 'wrong' && (
              <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-900 font-black text-lg animate-wiggle">
                Oops! Try again, you can do it! 💖
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: PICTURE & LETTER SHADOW MATCH */}
      {subMode === 'match-shadow' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-300 shadow-xl space-y-6">
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                Match Letters to Pictures
              </h3>
              <p className="text-sm font-semibold text-slate-600">
                Step 1: Tap a letter on the left. Step 2: Tap its matching picture on the right!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              {/* Letters Column */}
              <div className="space-y-3">
                <h4 className="text-center font-black text-purple-700 text-sm uppercase tracking-wider">
                  1. Alphabet Blocks
                </h4>
                {matchPairs.map(({ item, matched }) => (
                  <button
                    key={`letter-${item.letter}`}
                    disabled={matched}
                    onClick={() => handleSelectLetterForMatch(item)}
                    className={`w-full p-4 rounded-2xl font-black text-3xl sm:text-4xl flex items-center justify-center gap-3 transition-all cursor-pointer ${
                      matched
                        ? 'bg-slate-200 text-slate-400 border-2 border-slate-300 cursor-not-allowed opacity-60'
                        : selectedMatchLetter?.letter === item.letter
                        ? 'btn-3d-yellow text-amber-950 scale-105 ring-4 ring-amber-400'
                        : `${item.color} text-white border-b-6 ${item.shadowColor} shadow-md hover:scale-102`
                    }`}
                  >
                    <span>{item.letter}</span>
                    {matched && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  </button>
                ))}
              </div>

              {/* Pictures Column */}
              <div className="space-y-3">
                <h4 className="text-center font-black text-purple-700 text-sm uppercase tracking-wider">
                  2. Matching Pictures
                </h4>
                {matchPairs
                  .slice()
                  .reverse()
                  .map(({ item, matched }) => (
                    <button
                      key={`pic-${item.letter}`}
                      disabled={matched}
                      onClick={() => handleSelectPictureForMatch(item)}
                      className={`w-full p-3 sm:p-4 rounded-2xl font-black text-base sm:text-xl flex items-center justify-between px-4 transition-all cursor-pointer ${
                        matched
                          ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 cursor-not-allowed opacity-80'
                          : 'bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-slate-800 shadow hover:scale-102'
                      }`}
                    >
                      <span className="text-4xl">{item.emoji}</span>
                      <span className="font-bold">{item.word}</span>
                      {matched ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <span className="text-xs bg-sky-200 text-sky-800 px-2 py-1 rounded-full">
                          Match?
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => {
                  sounds.playPop(soundSettings.soundEnabled);
                  startNewMatchRound();
                }}
                className="px-6 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-b-4 border-slate-300 text-slate-700 font-bold flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Round</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
