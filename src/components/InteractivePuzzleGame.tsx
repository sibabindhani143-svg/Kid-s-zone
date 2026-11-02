import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Shuffle, Award, Check } from 'lucide-react';
import { Difficulty, SoundSettings } from '../types/game';
import { sounds, speech } from '../utils/audio';
import { MascotBuddy } from './MascotBuddy';

interface InteractivePuzzleGameProps {
  soundSettings: SoundSettings;
  onEarnStars: (count: number) => void;
  onPuzzleSolved: () => void;
}

interface PuzzlePiece {
  id: number;
  label: string;
  emoji: string;
  currentSlot: number | null; // null if in tray
  targetSlot: number;
}

export const InteractivePuzzleGame: React.FC<InteractivePuzzleGameProps> = ({
  soundSettings,
  onEarnStars,
  onPuzzleSolved
}) => {
  const [puzzleType, setPuzzleType] = useState<'number-order' | 'animal-alphabet' | 'jigsaw'>('number-order');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Piece count by difficulty
  const pieceCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

  // Initialize Puzzle
  const startNewPuzzle = () => {
    setIsCompleted(false);
    setSelectedPieceId(null);

    const generated: PuzzlePiece[] = [];

    if (puzzleType === 'number-order') {
      // Start from 1 or a multiple
      const startNum = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 10 : 20;
      for (let i = 0; i < pieceCount; i++) {
        const val = startNum + i;
        generated.push({
          id: i,
          label: `${val}`,
          emoji: ['🌟', '🎈', '🍎', '🐶', '🚗', '🍓', '🧁'][i % 7],
          currentSlot: null,
          targetSlot: i
        });
      }
    } else if (puzzleType === 'animal-alphabet') {
      const items = [
        { l: 'A', e: '🍎', w: 'Apple' },
        { l: 'B', e: '⚽', w: 'Ball' },
        { l: 'C', e: '🐱', w: 'Cat' },
        { l: 'D', e: '🐶', w: 'Dog' },
        { l: 'E', e: '🐘', w: 'Elephant' },
        { l: 'F', e: '🐠', w: 'Fish' },
        { l: 'G', e: '🍇', w: 'Grapes' },
      ].slice(0, pieceCount);

      items.forEach((item, idx) => {
        generated.push({
          id: idx,
          label: `${item.l} - ${item.w}`,
          emoji: item.e,
          currentSlot: null,
          targetSlot: idx
        });
      });
    } else {
      // Jigsaw Cartoon Animals
      const themes = [
        { e: '🦁', name: 'Lion Head' },
        { e: '🦒', name: 'Giraffe Neck' },
        { e: '🐘', name: 'Elephant Trunk' },
        { e: '🐼', name: 'Panda Face' },
        { e: '🐵', name: 'Playful Monkey' },
        { e: '🦓', name: 'Zebra Stripes' },
        { e: '🐬', name: 'Dolphin Splash' }
      ].slice(0, pieceCount);

      themes.forEach((th, idx) => {
        generated.push({
          id: idx,
          label: th.name,
          emoji: th.e,
          currentSlot: null,
          targetSlot: idx
        });
      });
    }

    setPieces(generated);

    setTimeout(() => {
      speech.speak(
        puzzleType === 'number-order'
          ? "Arrange the numbers in the correct order!"
          : puzzleType === 'animal-alphabet'
          ? "Place each letter block into its matching slot!"
          : "Fit the puzzle pieces into their slots!",
        soundSettings.speechRate,
        1.15,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  useEffect(() => {
    startNewPuzzle();
  }, [puzzleType, difficulty]);

  // Handle clicking a piece in the tray or puzzle
  const handleSelectPiece = (piece: PuzzlePiece) => {
    sounds.playPop(soundSettings.soundEnabled);
    if (selectedPieceId === piece.id) {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId(piece.id);
      speech.speak(piece.label, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
    }
  };

  // Place selected piece into target slot
  const handlePlaceIntoSlot = (slotIndex: number) => {
    if (selectedPieceId === null) return;

    const piece = pieces.find(p => p.id === selectedPieceId);
    if (!piece) return;

    // Is there already a piece in this slot?
    const existingInSlot = pieces.find(p => p.currentSlot === slotIndex);

    const updated = pieces.map(p => {
      if (p.id === selectedPieceId) {
        return { ...p, currentSlot: slotIndex };
      }
      if (existingInSlot && p.id === existingInSlot.id) {
        // Return existing piece to tray
        return { ...p, currentSlot: null };
      }
      return p;
    });

    sounds.playDing(soundSettings.soundEnabled);
    setPieces(updated);
    setSelectedPieceId(null);

    // Check if entire puzzle is solved
    const allFilled = updated.every(p => p.currentSlot !== null);
    if (allFilled) {
      const isAllCorrect = updated.every(p => p.currentSlot === p.targetSlot);
      if (isAllCorrect) {
        setIsCompleted(true);
        sounds.playFanfare(soundSettings.soundEnabled);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 }
        });
        const starBonus = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8;
        onEarnStars(starBonus);
        onPuzzleSolved();
        speech.speak("Hooray! Puzzle completed! Great job!", soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
      } else {
        sounds.playWrong(soundSettings.soundEnabled);
        speech.speak("Almost there! Some pieces are in the wrong spot. Swap them!", soundSettings.speechRate, 1.15, soundSettings.speechEnabled);
      }
    }
  };

  // Drag and Drop support
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    e.dataTransfer.setData('text/plain', pieceId.toString());
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const pieceIdStr = e.dataTransfer.getData('text/plain');
    if (!pieceIdStr) return;
    const pieceId = parseInt(pieceIdStr, 10);
    const piece = pieces.find(p => p.id === pieceId);
    if (!piece) return;

    const updated = pieces.map(p => {
      if (p.id === pieceId) {
        return { ...p, currentSlot: slotIndex };
      }
      if (p.currentSlot === slotIndex) {
        return { ...p, currentSlot: null };
      }
      return p;
    });

    sounds.playDing(soundSettings.soundEnabled);
    setPieces(updated);
    setSelectedPieceId(null);

    const allFilled = updated.every(p => p.currentSlot !== null);
    if (allFilled) {
      const isAllCorrect = updated.every(p => p.currentSlot === p.targetSlot);
      if (isAllCorrect) {
        setIsCompleted(true);
        sounds.playFanfare(soundSettings.soundEnabled);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 }
        });
        const starBonus = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8;
        onEarnStars(starBonus);
        onPuzzleSolved();
        speech.speak("Hooray! Puzzle completed! Great job!", soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const trayPieces = pieces.filter(p => p.currentSlot === null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Puzzle Type Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setPuzzleType('number-order');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            puzzleType === 'number-order'
              ? 'btn-3d-yellow text-amber-950 scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🔢 Order Numbers
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setPuzzleType('animal-alphabet');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            puzzleType === 'animal-alphabet'
              ? 'btn-3d-green text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🔤 Alphabet Order
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setPuzzleType('jigsaw');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            puzzleType === 'jigsaw'
              ? 'btn-3d-purple text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🧩 Animal Friends
        </button>
      </div>

      {/* Difficulty Level Bar */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-2">
          Difficulty:
        </span>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(lvl => (
          <button
            key={lvl}
            onClick={() => {
              sounds.playPop(soundSettings.soundEnabled);
              setDifficulty(lvl);
            }}
            className={`px-4 py-1.5 rounded-xl text-sm font-black capitalize transition-all cursor-pointer ${
              difficulty === lvl
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {lvl === 'easy' ? '⭐ Easy (3 Pcs)' : lvl === 'medium' ? '⭐⭐ Med (5 Pcs)' : '⭐⭐⭐ Hard (7 Pcs)'}
          </button>
        ))}
      </div>

      {/* Mascot Guidance */}
      <MascotBuddy
        message={
          isCompleted
            ? "Superstar! You solved the puzzle! Tap Play Again or pick another difficulty!"
            : selectedPieceId !== null
            ? "Now tap the target puzzle slot where you want to place this piece!"
            : "Tap or drag pieces from the tray at the bottom into the empty numbered slots!"
        }
        speechEnabled={soundSettings.speechEnabled}
      />

      {/* Main Puzzle Board */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-8">
        {/* Target Slots Row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-slate-800 text-base sm:text-lg">
              1. Puzzle Slots (Put pieces in order):
            </h4>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              {pieces.filter(p => p.currentSlot !== null).length} of {pieceCount} Placed
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4 p-4 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-300 min-h-36 items-center">
            {Array.from({ length: pieceCount }).map((_, slotIdx) => {
              const placedPiece = pieces.find(p => p.currentSlot === slotIdx);
              const isCorrect = placedPiece?.targetSlot === slotIdx;

              return (
                <div
                  key={slotIdx}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDropOnSlot(e, slotIdx)}
                  onClick={() => handlePlaceIntoSlot(slotIdx)}
                  className={`h-28 sm:h-32 rounded-2xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all border-4 ${
                    placedPiece
                      ? isCorrect
                        ? 'bg-emerald-100 border-emerald-400 shadow-md'
                        : 'bg-amber-100 border-amber-400 shadow-md'
                      : selectedPieceId !== null
                      ? 'bg-amber-100/60 border-amber-400 border-dashed animate-pulse'
                      : 'bg-white border-dashed border-slate-300 hover:border-slate-400'
                  }`}
                  title={placedPiece ? `Slot ${slotIdx + 1}: ${placedPiece.label}` : `Empty Slot ${slotIdx + 1}`}
                >
                  {placedPiece ? (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl select-none animate-bounce-gentle">
                        {placedPiece.emoji}
                      </span>
                      <span className="text-xs font-black text-slate-800 mt-1 line-clamp-1">
                        {placedPiece.label}
                      </span>
                      {isCorrect && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <span className="text-xl font-black">Slot {slotIdx + 1}</span>
                      <span className="text-[10px] font-bold">Tap to place</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Piece Tray (Available Pieces) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-slate-800 text-base sm:text-lg">
              2. Available Pieces (Tap piece, then tap slot):
            </h4>
            <button
              onClick={() => {
                sounds.playPop(soundSettings.soundEnabled);
                startNewPuzzle();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pieces</span>
            </button>
          </div>

          <div className="p-4 bg-sky-50 rounded-3xl border-2 border-sky-200 min-h-28 flex flex-wrap items-center justify-center gap-3">
            {trayPieces.length === 0 ? (
              <div className="text-sm font-bold text-sky-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>All pieces placed! Check your slots above!</span>
              </div>
            ) : (
              trayPieces.map(piece => {
                const isSelected = selectedPieceId === piece.id;

                return (
                  <div
                    key={piece.id}
                    draggable
                    onDragStart={e => handleDragStart(e, piece.id)}
                    onClick={() => handleSelectPiece(piece)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 active:scale-95 shadow-md ${
                      isSelected
                        ? 'btn-3d-yellow text-amber-950 scale-110 ring-4 ring-amber-400'
                        : 'btn-3d-blue text-white'
                    }`}
                  >
                    <span className="text-4xl select-none">{piece.emoji}</span>
                    <span className="text-xs font-black mt-1">{piece.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Celebration Banner when completed */}
        {isCompleted && (
          <div className="p-6 bg-gradient-to-r from-emerald-100 via-teal-100 to-green-100 border-4 border-emerald-400 rounded-3xl text-center space-y-3 animate-bounce-gentle">
            <div className="text-5xl">🏆 ⭐ 🎉</div>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-900">
              Puzzle Master! You Solved It!
            </h3>
            <p className="text-base font-bold text-emerald-800">
              You earned bonus stars! Keep playing to unlock more trophies!
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  sounds.playPop(soundSettings.soundEnabled);
                  startNewPuzzle();
                }}
                className="px-8 py-3 rounded-2xl btn-3d-green text-white font-black text-lg cursor-pointer"
              >
                Play Next Puzzle! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
