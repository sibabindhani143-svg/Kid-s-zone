import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ColorItem, ShapeColorSubMode, ShapeItem, SoundSettings } from '../types/game';
import { COLORS_DATA, SHAPES_DATA } from '../utils/data';
import { sounds, speech } from '../utils/audio';
import { MascotBuddy } from './MascotBuddy';

interface ShapeColorGameProps {
  soundSettings: SoundSettings;
  onEarnStars: (count: number) => void;
  onShapeMastered: (shapeId: string) => void;
  masteredShapes: string[];
}

export const ShapeColorGame: React.FC<ShapeColorGameProps> = ({
  soundSettings,
  onEarnStars,
  onShapeMastered,
  masteredShapes
}) => {
  const [subMode, setSubMode] = useState<ShapeColorSubMode>('shape-match');

  // Shape Match State
  const [currentShapeRound, setCurrentShapeRound] = useState<{
    targetShape: ShapeItem;
    targetObject: { name: string; emoji: string; hint: string };
    options: ShapeItem[];
  } | null>(null);
  const [shapeFeedback, setShapeFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Color Balloon Pop State
  const [targetColor, setTargetColor] = useState<ColorItem>(COLORS_DATA[0]);
  const [balloonList, setBalloonList] = useState<{ id: number; color: ColorItem; popped: boolean }[]>([]);
  const [balloonFeedback, setBalloonFeedback] = useState<string | null>(null);

  // Color Sort State
  const [sortItem, setSortItem] = useState<{ name: string; emoji: string; colorId: string } | null>(null);
  const [sortColorOptions, setSortColorOptions] = useState<ColorItem[]>([]);
  const [sortFeedback, setSortFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Initialize Shape Match round
  const startNewShapeRound = () => {
    const targetShape = SHAPES_DATA[Math.floor(Math.random() * SHAPES_DATA.length)];
    const randomObject = targetShape.realWorldItems[Math.floor(Math.random() * targetShape.realWorldItems.length)];

    // Distractors
    const others = SHAPES_DATA.filter(s => s.id !== targetShape.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [targetShape, ...shuffledOthers].sort(() => 0.5 - Math.random());

    setCurrentShapeRound({
      targetShape,
      targetObject: randomObject,
      options
    });
    setShapeFeedback(null);

    setTimeout(() => {
      speech.speak(
        `What shape is the ${randomObject.name}?`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  // Initialize Balloon Pop round
  const startNewBalloonRound = () => {
    const target = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    setTargetColor(target);
    setBalloonFeedback(null);

    // Create 6 balloons, at least 2 are the target color
    const generated: { id: number; color: ColorItem; popped: boolean }[] = [];
    // 2 targets
    generated.push({ id: 1, color: target, popped: false });
    generated.push({ id: 2, color: target, popped: false });

    // 4 random colors
    for (let i = 3; i <= 6; i++) {
      const otherColors = COLORS_DATA.filter(c => c.id !== target.id);
      const randomCol = otherColors[Math.floor(Math.random() * otherColors.length)];
      generated.push({ id: i, color: randomCol, popped: false });
    }

    setBalloonList(generated.sort(() => 0.5 - Math.random()));

    setTimeout(() => {
      speech.speak(
        `Pop all the ${target.name} balloons!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  // Initialize Color Sort round
  const startNewColorSortRound = () => {
    // Pick a random color and one of its items
    const chosenColor = COLORS_DATA[Math.floor(Math.random() * COLORS_DATA.length)];
    const chosenItem = chosenColor.items[Math.floor(Math.random() * chosenColor.items.length)];

    setSortItem({
      name: chosenItem.name,
      emoji: chosenItem.emoji,
      colorId: chosenColor.id
    });

    // 3 or 4 color buckets
    const otherColors = COLORS_DATA.filter(c => c.id !== chosenColor.id);
    const distractors = [...otherColors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [chosenColor, ...distractors].sort(() => 0.5 - Math.random());

    setSortColorOptions(options);
    setSortFeedback(null);

    setTimeout(() => {
      speech.speak(
        `Which color basket does the ${chosenItem.name} belong to?`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );
    }, 200);
  };

  useEffect(() => {
    if (subMode === 'shape-match') {
      startNewShapeRound();
    } else if (subMode === 'balloon-pop') {
      startNewBalloonRound();
    } else if (subMode === 'color-sort') {
      startNewColorSortRound();
    }
  }, [subMode]);

  // Answer Shape Match
  const handleSelectShapeAnswer = (shape: ShapeItem) => {
    if (!currentShapeRound || shapeFeedback === 'correct') return;

    if (shape.id === currentShapeRound.targetShape.id) {
      sounds.playCorrect(soundSettings.soundEnabled);
      setShapeFeedback('correct');
      onEarnStars(2);
      onShapeMastered(shape.id);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      speech.speak(
        `Correct! The ${currentShapeRound.targetObject.name} is a ${shape.name}!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );

      setTimeout(() => {
        startNewShapeRound();
      }, 1800);
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      setShapeFeedback('wrong');
      speech.tryAgain(soundSettings.speechEnabled);
      setTimeout(() => setShapeFeedback(null), 1000);
    }
  };

  // Pop a Balloon
  const handlePopBalloon = (balloon: { id: number; color: ColorItem; popped: boolean }) => {
    if (balloon.popped) return;

    if (balloon.color.id === targetColor.id) {
      sounds.playPop(soundSettings.soundEnabled);
      setBalloonList(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b));
      onEarnStars(1);

      // Check if all targets popped
      const remainingTargets = balloonList.filter(
        b => b.color.id === targetColor.id && b.id !== balloon.id && !b.popped
      );

      if (remainingTargets.length === 0) {
        sounds.playCorrect(soundSettings.soundEnabled);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.5 }
        });
        speech.speak(`Awesome! You popped all ${targetColor.name} balloons!`, soundSettings.speechRate, 1.25, soundSettings.speechEnabled);
        setTimeout(startNewBalloonRound, 1800);
      } else {
        speech.speak("Pop! One more!", soundSettings.speechRate, 1.3, soundSettings.speechEnabled);
      }
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      speech.speak(`That's ${balloon.color.name}! Look for ${targetColor.name}!`, soundSettings.speechRate, 1.15, soundSettings.speechEnabled);
    }
  };

  // Select Color Basket
  const handleSelectColorBasket = (color: ColorItem) => {
    if (!sortItem || sortFeedback === 'correct') return;

    if (color.id === sortItem.colorId) {
      sounds.playCorrect(soundSettings.soundEnabled);
      setSortFeedback('correct');
      onEarnStars(2);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      speech.speak(
        `Great job! ${sortItem.name} goes in the ${color.name} basket!`,
        soundSettings.speechRate,
        1.2,
        soundSettings.speechEnabled
      );

      setTimeout(() => {
        startNewColorSortRound();
      }, 1800);
    } else {
      sounds.playWrong(soundSettings.soundEnabled);
      setSortFeedback('wrong');
      speech.tryAgain(soundSettings.speechEnabled);
      setTimeout(() => setSortFeedback(null), 1000);
    }
  };

  // Render SVG Shape icon
  const renderShapeIcon = (shapeType: string) => {
    switch (shapeType) {
      case 'circle':
        return <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-amber-600 shadow-md" />;
      case 'square':
        return <div className="w-16 h-16 rounded-xl bg-blue-400 border-4 border-blue-600 shadow-md" />;
      case 'triangle':
        return (
          <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[56px] border-b-emerald-500 drop-shadow-md" />
        );
      case 'rectangle':
        return <div className="w-20 h-14 rounded-lg bg-orange-400 border-4 border-orange-600 shadow-md" />;
      case 'star':
        return <span className="text-6xl text-yellow-400 filter drop-shadow">⭐</span>;
      case 'heart':
        return <span className="text-6xl text-rose-500 filter drop-shadow">💖</span>;
      case 'diamond':
        return <div className="w-14 h-14 bg-cyan-400 border-4 border-cyan-600 transform rotate-45 shadow-md" />;
      case 'oval':
        return <div className="w-20 h-14 rounded-[50%] bg-purple-400 border-4 border-purple-600 shadow-md" />;
      default:
        return <div className="w-16 h-16 rounded-full bg-amber-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Submode Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('shape-match');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'shape-match'
              ? 'btn-3d-yellow text-amber-950 scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🔺 Shape Detective
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('balloon-pop');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'balloon-pop'
              ? 'btn-3d-rose text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🎈 Balloon Color Pop
        </button>

        <button
          onClick={() => {
            sounds.playPop(soundSettings.soundEnabled);
            setSubMode('color-sort');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg cursor-pointer transition-all ${
            subMode === 'color-sort'
              ? 'btn-3d-purple text-white scale-105'
              : 'bg-white/80 hover:bg-white text-slate-700 border-2 border-slate-200'
          }`}
        >
          🧺 Color Baskets
        </button>
      </div>

      {/* Mascot Guidance */}
      <MascotBuddy
        message={
          subMode === 'shape-match'
            ? currentShapeRound
              ? `Look at the ${currentShapeRound.targetObject.name}! What shape is it?`
              : "Let's find the matching shape!"
            : subMode === 'balloon-pop'
            ? `Listen carefully: Pop all the ${targetColor.name} balloons floating in the sky!`
            : sortItem
            ? `Can you place the ${sortItem.name} into the matching colored basket?`
            : "Sort items into the right color basket!"
        }
        speechEnabled={soundSettings.speechEnabled}
      />

      {/* MODE 1: SHAPE DETECTIVE */}
      {subMode === 'shape-match' && currentShapeRound && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              What shape is this item?
            </h3>

            {/* Target Real-World Object Display */}
            <div 
              onClick={() => {
                speech.speak(
                  `This is a ${currentShapeRound.targetObject.name}. ${currentShapeRound.targetObject.hint}. What shape is it?`,
                  soundSettings.speechRate,
                  1.2,
                  soundSettings.speechEnabled
                );
              }}
              className="inline-flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-orange-100 border-4 border-amber-300 rounded-3xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              <span className="text-7xl sm:text-8xl animate-bounce-gentle select-none">
                {currentShapeRound.targetObject.emoji}
              </span>
              <span className="text-2xl font-black text-slate-800 mt-2">
                {currentShapeRound.targetObject.name}
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-200/80 px-3 py-1 rounded-full mt-1">
                {currentShapeRound.targetObject.hint} 🔊
              </span>
            </div>

            {/* Shape Options */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-3">
                Choose the correct shape:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentShapeRound.options.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => handleSelectShapeAnswer(shape)}
                    className="p-4 rounded-3xl bg-sky-50 hover:bg-sky-100 border-4 border-sky-300 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <div className="h-16 flex items-center justify-center">
                      {renderShapeIcon(shape.svgShape)}
                    </div>
                    <span className="font-black text-lg text-slate-800">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {shapeFeedback === 'correct' && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg animate-bounce">
                🎉 Wonderful! It is a {currentShapeRound.targetShape.name}! +2 Stars!
              </div>
            )}
            {shapeFeedback === 'wrong' && (
              <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-900 font-black text-lg animate-wiggle">
                Oops! Look closely at the corners and try again! 💖
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: BALLOON COLOR POP */}
      {subMode === 'balloon-pop' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl p-6 sm:p-8 border-4 border-sky-400 shadow-xl space-y-6 relative overflow-hidden">
            {/* Target Clue Header */}
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-sky-800 uppercase tracking-wider">
                Sky Balloon Game
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                <span>Pop all</span>
                <span 
                  className={`px-3 py-1 rounded-2xl text-white shadow-md ${targetColor.bgClass}`}
                >
                  {targetColor.name}
                </span>
                <span>Balloons!</span>
              </h3>
            </div>

            {/* Sky Arena with Floating Balloons */}
            <div className="min-h-72 p-4 grid grid-cols-2 sm:grid-cols-3 gap-6 items-center justify-items-center">
              {balloonList.map(balloon => (
                <div key={balloon.id} className="relative flex flex-col items-center">
                  {!balloon.popped ? (
                    <button
                      onClick={() => handlePopBalloon(balloon)}
                      className={`w-24 h-32 rounded-full cursor-pointer transition-all transform hover:scale-110 active:scale-90 flex flex-col items-center justify-center shadow-lg relative ${
                        balloon.color.bgClass
                      } animate-float-slow`}
                      style={{
                        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
                      }}
                      title={`Pop ${balloon.color.name} balloon`}
                    >
                      {/* Reflection highlight */}
                      <div className="w-4 h-8 bg-white/40 rounded-full absolute top-3 left-4 transform -rotate-20" />
                      <span className="text-xs font-black text-white/95 drop-shadow">
                        {balloon.color.name}
                      </span>
                      {/* Balloon string knot */}
                      <div className="w-2 h-2 bg-black/30 rounded-full absolute -bottom-1" />
                    </button>
                  ) : (
                    <div className="w-24 h-32 flex flex-col items-center justify-center">
                      <span className="text-4xl animate-ping">💥</span>
                      <span className="text-xs font-black text-emerald-700 mt-1">Popped! ⭐</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  sounds.playPop(soundSettings.soundEnabled);
                  startNewBalloonRound();
                }}
                className="px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border-b-4 border-slate-300 text-slate-700 font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Balloons</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: COLOR BASKETS SORTING */}
      {subMode === 'color-sort' && sortItem && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-purple-300 shadow-xl text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              Sort Into the Matching Basket
            </h3>

            {/* Current Item to Sort */}
            <div 
              onClick={() => {
                speech.speak(`This is a ${sortItem.name}. Which color basket does it match?`, soundSettings.speechRate, 1.2, soundSettings.speechEnabled);
              }}
              className="inline-flex flex-col items-center justify-center p-6 bg-purple-50 border-4 border-purple-200 rounded-3xl cursor-pointer hover:scale-105 transition-transform shadow-md"
            >
              <span className="text-7xl sm:text-8xl animate-bounce-gentle select-none">
                {sortItem.emoji}
              </span>
              <span className="text-2xl font-black text-slate-800 mt-2">
                {sortItem.name}
              </span>
            </div>

            {/* Color Baskets */}
            <div>
              <p className="text-sm font-bold text-slate-600 mb-3">
                Tap the matching color basket:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {sortColorOptions.map(col => (
                  <button
                    key={col.id}
                    onClick={() => handleSelectColorBasket(col)}
                    className="p-4 rounded-3xl bg-white border-4 border-slate-200 hover:border-slate-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105 shadow-md"
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl shadow-inner flex items-center justify-center text-3xl"
                      style={{ backgroundColor: col.hex }}
                    >
                      🧺
                    </div>
                    <span className="font-black text-lg text-slate-800">
                      {col.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {sortFeedback === 'correct' && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg animate-bounce">
                🎉 Perfect! Sorted right into the basket! +2 Stars!
              </div>
            )}
            {sortFeedback === 'wrong' && (
              <div className="p-3 bg-rose-100 border-2 border-rose-400 rounded-2xl text-rose-900 font-black text-lg animate-wiggle">
                Oops! Check the color closely and try again! 💖
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
