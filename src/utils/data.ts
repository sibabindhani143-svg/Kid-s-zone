import { AlphabetItem, ColorItem, DailyQuest, NumberItem, ShapeItem, Trophy } from '../types/game';

export const ALPHABET_DATA: AlphabetItem[] = [
  {
    letter: 'A',
    word: 'Apple',
    phonics: '/æ/ as in Apple',
    emoji: '🍎',
    color: 'bg-red-500',
    shadowColor: 'border-red-700',
    exampleSentence: 'A is for sweet red Apple!',
    category: 'fruit'
  },
  {
    letter: 'B',
    word: 'Ball',
    phonics: '/b/ as in Ball',
    emoji: '⚽',
    color: 'bg-blue-500',
    shadowColor: 'border-blue-700',
    exampleSentence: 'B is for bouncy Ball!',
    category: 'toy'
  },
  {
    letter: 'C',
    word: 'Cat',
    phonics: '/k/ as in Cat',
    emoji: '🐱',
    color: 'bg-amber-500',
    shadowColor: 'border-amber-700',
    exampleSentence: 'C is for cute little Cat!',
    category: 'animal'
  },
  {
    letter: 'D',
    word: 'Dog',
    phonics: '/d/ as in Dog',
    emoji: '🐶',
    color: 'bg-orange-500',
    shadowColor: 'border-orange-700',
    exampleSentence: 'D is for friendly playful Dog!',
    category: 'animal'
  },
  {
    letter: 'E',
    word: 'Elephant',
    phonics: '/e/ as in Elephant',
    emoji: '🐘',
    color: 'bg-sky-500',
    shadowColor: 'border-sky-700',
    exampleSentence: 'E is for giant kind Elephant!',
    category: 'animal'
  },
  {
    letter: 'F',
    word: 'Fish',
    phonics: '/f/ as in Fish',
    emoji: '🐠',
    color: 'bg-teal-500',
    shadowColor: 'border-teal-700',
    exampleSentence: 'F is for swimming shiny Fish!',
    category: 'animal'
  },
  {
    letter: 'G',
    word: 'Grapes',
    phonics: '/g/ as in Grapes',
    emoji: '🍇',
    color: 'bg-purple-500',
    shadowColor: 'border-purple-700',
    exampleSentence: 'G is for juicy purple Grapes!',
    category: 'fruit'
  },
  {
    letter: 'H',
    word: 'House',
    phonics: '/h/ as in House',
    emoji: '🏠',
    color: 'bg-pink-500',
    shadowColor: 'border-pink-700',
    exampleSentence: 'H is for warm cozy House!',
    category: 'toy'
  },
  {
    letter: 'I',
    word: 'Ice Cream',
    phonics: '/aɪ/ as in Ice Cream',
    emoji: '🍦',
    color: 'bg-rose-400',
    shadowColor: 'border-rose-600',
    exampleSentence: 'I is for yummy cool Ice Cream!',
    category: 'fruit'
  },
  {
    letter: 'J',
    word: 'Juice',
    phonics: '/dʒ/ as in Juice',
    emoji: '🧃',
    color: 'bg-amber-500',
    shadowColor: 'border-amber-700',
    exampleSentence: 'J is for sweet fruit Juice!',
    category: 'fruit'
  },
  {
    letter: 'K',
    word: 'Kite',
    phonics: '/k/ as in Kite',
    emoji: '🪁',
    color: 'bg-emerald-500',
    shadowColor: 'border-emerald-700',
    exampleSentence: 'K is for high flying Kite!',
    category: 'toy'
  },
  {
    letter: 'L',
    word: 'Lion',
    phonics: '/l/ as in Lion',
    emoji: '🦁',
    color: 'bg-yellow-500',
    shadowColor: 'border-yellow-700',
    exampleSentence: 'L is for brave golden Lion!',
    category: 'animal'
  },
  {
    letter: 'M',
    word: 'Monkey',
    phonics: '/m/ as in Monkey',
    emoji: '🐒',
    color: 'bg-amber-600',
    shadowColor: 'border-amber-800',
    exampleSentence: 'M is for funny cheerful Monkey!',
    category: 'animal'
  },
  {
    letter: 'N',
    word: 'Nest',
    phonics: '/n/ as in Nest',
    emoji: '🪺',
    color: 'bg-lime-600',
    shadowColor: 'border-lime-800',
    exampleSentence: 'N is for birds in their cozy Nest!',
    category: 'nature'
  },
  {
    letter: 'O',
    word: 'Orange',
    phonics: '/ɒ/ as in Orange',
    emoji: '🍊',
    color: 'bg-orange-500',
    shadowColor: 'border-orange-700',
    exampleSentence: 'O is for bright sweet Orange!',
    category: 'fruit'
  },
  {
    letter: 'P',
    word: 'Penguin',
    phonics: '/p/ as in Penguin',
    emoji: '🐧',
    color: 'bg-cyan-600',
    shadowColor: 'border-cyan-800',
    exampleSentence: 'P is for cute waddling Penguin!',
    category: 'animal'
  },
  {
    letter: 'Q',
    word: 'Queen',
    phonics: '/kw/ as in Queen',
    emoji: '👑',
    color: 'bg-violet-600',
    shadowColor: 'border-violet-800',
    exampleSentence: 'Q is for a beautiful Queen with a crown!',
    category: 'toy'
  },
  {
    letter: 'R',
    word: 'Rainbow',
    phonics: '/r/ as in Rainbow',
    emoji: '🌈',
    color: 'bg-indigo-500',
    shadowColor: 'border-indigo-700',
    exampleSentence: 'R is for magical colorful Rainbow!',
    category: 'nature'
  },
  {
    letter: 'S',
    word: 'Sun',
    phonics: '/s/ as in Sun',
    emoji: '☀️',
    color: 'bg-yellow-400',
    shadowColor: 'border-yellow-600',
    exampleSentence: 'S is for bright warm smiling Sun!',
    category: 'nature'
  },
  {
    letter: 'T',
    word: 'Train',
    phonics: '/t/ as in Train',
    emoji: '🚂',
    color: 'bg-red-500',
    shadowColor: 'border-red-700',
    exampleSentence: 'T is for chugga-chugga Train!',
    category: 'vehicle'
  },
  {
    letter: 'U',
    word: 'Umbrella',
    phonics: '/ʌ/ as in Umbrella',
    emoji: '☂️',
    color: 'bg-purple-500',
    shadowColor: 'border-purple-700',
    exampleSentence: 'U is for colorful rainy day Umbrella!',
    category: 'toy'
  },
  {
    letter: 'V',
    word: 'Van',
    phonics: '/v/ as in Van',
    emoji: '🚐',
    color: 'bg-blue-600',
    shadowColor: 'border-blue-800',
    exampleSentence: 'V is for beep-beep family Van!',
    category: 'vehicle'
  },
  {
    letter: 'W',
    word: 'Watermelon',
    phonics: '/w/ as in Watermelon',
    emoji: '🍉',
    color: 'bg-emerald-500',
    shadowColor: 'border-emerald-700',
    exampleSentence: 'W is for fresh juicy Watermelon!',
    category: 'fruit'
  },
  {
    letter: 'X',
    word: 'Xylophone',
    phonics: '/z/ as in Xylophone',
    emoji: '🎵',
    color: 'bg-fuchsia-500',
    shadowColor: 'border-fuchsia-700',
    exampleSentence: 'X is for musical rainbow Xylophone!',
    category: 'toy'
  },
  {
    letter: 'Y',
    word: 'Yo-yo',
    phonics: '/j/ as in Yo-yo',
    emoji: '🪀',
    color: 'bg-rose-500',
    shadowColor: 'border-rose-700',
    exampleSentence: 'Y is for spinning bouncing Yo-yo!',
    category: 'toy'
  },
  {
    letter: 'Z',
    word: 'Zebra',
    phonics: '/z/ as in Zebra',
    emoji: '🦓',
    color: 'bg-slate-700',
    shadowColor: 'border-slate-900',
    exampleSentence: 'Z is for striped speedy Zebra!',
    category: 'animal'
  }
];

// Number names for 1 to 100
const NUMBER_WORDS: { [key: number]: string } = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  30: 'Thirty', 40: 'Forty', 50: 'Fifty', 60: 'Sixty', 70: 'Seventy',
  80: 'Eighty', 90: 'Ninety', 100: 'One Hundred'
};

export function getNumberWord(n: number): string {
  if (NUMBER_WORDS[n]) return NUMBER_WORDS[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  return `${NUMBER_WORDS[tens]} ${NUMBER_WORDS[ones]}`;
}

export const NUMBER_EMOJIS = ['⭐', '🎈', '🍎', '🐱', '🚗', '🍓', '🧁', '🍭', '🧸', '🚀'];
export const NUMBER_COLORS = [
  'bg-amber-400 border-amber-600',
  'bg-sky-400 border-sky-600',
  'bg-emerald-400 border-emerald-600',
  'bg-rose-400 border-rose-600',
  'bg-purple-400 border-purple-600',
  'bg-orange-400 border-orange-600',
  'bg-teal-400 border-teal-600',
  'bg-pink-400 border-pink-600',
];

export const SHAPES_DATA: ShapeItem[] = [
  {
    id: 'circle',
    name: 'Circle',
    color: 'text-amber-500 fill-amber-400 stroke-amber-600',
    svgShape: 'circle',
    realWorldItems: [
      { name: 'Wall Clock', emoji: '⏰', hint: 'Ticks round and round' },
      { name: 'Pizza Pie', emoji: '🍕', hint: 'Delicious round slice' },
      { name: 'Big Sun', emoji: '☀️', hint: 'Shining round in the sky' },
      { name: 'Play Coin', emoji: '🪙', hint: 'Shiny round gold coin' }
    ]
  },
  {
    id: 'square',
    name: 'Square',
    color: 'text-blue-500 fill-blue-400 stroke-blue-600',
    svgShape: 'square',
    realWorldItems: [
      { name: 'Gift Box', emoji: '🎁', hint: 'Has four equal sides' },
      { name: 'Window', emoji: '🪟', hint: 'Look outside through the square' },
      { name: 'Alphabet Block', emoji: '🧱', hint: 'Toy block for building' },
      { name: 'Dice', emoji: '🎲', hint: 'Roll the square dice' }
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle',
    color: 'text-emerald-500 fill-emerald-400 stroke-emerald-600',
    svgShape: 'triangle',
    realWorldItems: [
      { name: 'Pizza Slice', emoji: '🍕', hint: 'Has 3 sharp corners' },
      { name: 'Mountain Peak', emoji: '⛰️', hint: 'Points high up' },
      { name: 'Party Hat', emoji: '🎉', hint: 'Wear it on your birthday' },
      { name: 'Watermelon Slice', emoji: '🍉', hint: 'Juicy triangular treat' }
    ]
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    color: 'text-orange-500 fill-orange-400 stroke-orange-600',
    svgShape: 'rectangle',
    realWorldItems: [
      { name: 'Wooden Door', emoji: '🚪', hint: 'Tall with 4 sides' },
      { name: 'Story Book', emoji: '📚', hint: 'Read stories every day' },
      { name: 'School Bus', emoji: '🚌', hint: 'Long vehicle for students' },
      { name: 'Smart Tablet', emoji: '📱', hint: 'Screen for playing games' }
    ]
  },
  {
    id: 'star',
    name: 'Star',
    color: 'text-yellow-400 fill-yellow-300 stroke-yellow-500',
    svgShape: 'star',
    realWorldItems: [
      { name: 'Night Star', emoji: '⭐', hint: 'Twinkles in the dark sky' },
      { name: 'Sea Starfish', emoji: '🌟', hint: 'Living under the blue sea' },
      { name: 'Gold Medal', emoji: '🏅', hint: 'Winner star medal' },
      { name: 'Magic Wand', emoji: '🪄', hint: 'Star on top of the wand' }
    ]
  },
  {
    id: 'heart',
    name: 'Heart',
    color: 'text-rose-500 fill-rose-400 stroke-rose-600',
    svgShape: 'heart',
    realWorldItems: [
      { name: 'Love Balloon', emoji: '🎈', hint: 'Heart shaped celebration' },
      { name: 'Sweet Cookie', emoji: '🍪', hint: 'Baked with love' },
      { name: 'Greeting Card', emoji: '💌', hint: 'Card with sweet message' },
      { name: 'Strawberry', emoji: '🍓', hint: 'Sweet heart shaped berry' }
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond',
    color: 'text-cyan-500 fill-cyan-400 stroke-cyan-600',
    svgShape: 'diamond',
    realWorldItems: [
      { name: 'Flying Kite', emoji: '🪁', hint: 'Soars in windy skies' },
      { name: 'Shiny Jewel', emoji: '💎', hint: 'Sparkles in the light' },
      { name: 'Street Sign', emoji: '🔶', hint: 'Diamond alert shape' }
    ]
  },
  {
    id: 'oval',
    name: 'Oval',
    color: 'text-purple-500 fill-purple-400 stroke-purple-600',
    svgShape: 'oval',
    realWorldItems: [
      { name: 'Bird Egg', emoji: '🥚', hint: 'Smooth oval egg' },
      { name: 'Watermelon', emoji: '🍉', hint: 'Large green oval fruit' },
      { name: 'Rugby Ball', emoji: '🏈', hint: 'Toss the oval ball' }
    ]
  }
];

export const COLORS_DATA: ColorItem[] = [
  {
    id: 'red',
    name: 'Red',
    hex: '#ef4444',
    textClass: 'text-red-500',
    bgClass: 'bg-red-500',
    items: [
      { name: 'Red Apple', emoji: '🍎' },
      { name: 'Red Strawberry', emoji: '🍓' },
      { name: 'Fire Engine', emoji: '🚒' },
      { name: 'Red Rose', emoji: '🌹' }
    ]
  },
  {
    id: 'blue',
    name: 'Blue',
    hex: '#3b82f6',
    textClass: 'text-blue-500',
    bgClass: 'bg-blue-500',
    items: [
      { name: 'Blue Sky', emoji: '☁️' },
      { name: 'Blue Whale', emoji: '🐋' },
      { name: 'Blue Jeans', emoji: '👖' },
      { name: 'Blueberry', emoji: '🫐' }
    ]
  },
  {
    id: 'green',
    name: 'Green',
    hex: '#22c55e',
    textClass: 'text-green-500',
    bgClass: 'bg-green-500',
    items: [
      { name: 'Green Frog', emoji: '🐸' },
      { name: 'Tree Leaf', emoji: '🍃' },
      { name: 'Cucumber', emoji: '🥒' },
      { name: 'Green Pear', emoji: '🍐' }
    ]
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#eab308',
    textClass: 'text-yellow-500',
    bgClass: 'bg-yellow-400',
    items: [
      { name: 'Ripe Banana', emoji: '🍌' },
      { name: 'Yellow Duck', emoji: '🦆' },
      { name: 'Bright Sun', emoji: '☀️' },
      { name: 'Sunflower', emoji: '🌻' }
    ]
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#f97316',
    textClass: 'text-orange-500',
    bgClass: 'bg-orange-500',
    items: [
      { name: 'Orange Fruit', emoji: '🍊' },
      { name: 'Carrot', emoji: '🥕' },
      { name: 'Basketball', emoji: '🏀' },
      { name: 'Orange Fox', emoji: '🦊' }
    ]
  },
  {
    id: 'purple',
    name: 'Purple',
    hex: '#a855f7',
    textClass: 'text-purple-500',
    bgClass: 'bg-purple-500',
    items: [
      { name: 'Purple Grapes', emoji: '🍇' },
      { name: 'Eggplant', emoji: '🍆' },
      { name: 'Purple Flower', emoji: '🪻' },
      { name: 'Magic Hat', emoji: '🧙' }
    ]
  },
  {
    id: 'pink',
    name: 'Pink',
    hex: '#ec4899',
    textClass: 'text-pink-500',
    bgClass: 'bg-pink-500',
    items: [
      { name: 'Pink Flamingo', emoji: '🦩' },
      { name: 'Cotton Candy', emoji: '🍭' },
      { name: 'Pink Piggy', emoji: '🐷' },
      { name: 'Cupcake Icing', emoji: '🧁' }
    ]
  },
  {
    id: 'cyan',
    name: 'Cyan',
    hex: '#06b6d4',
    textClass: 'text-cyan-500',
    bgClass: 'bg-cyan-500',
    items: [
      { name: 'Water Drop', emoji: '💧' },
      { name: 'Ice Cube', emoji: '🧊' },
      { name: 'Cyan Dolphin', emoji: '🐬' },
      { name: 'Sparkling Gem', emoji: '💎' }
    ]
  }
];

export const INITIAL_TROPHIES: Trophy[] = [
  {
    id: 'first_step',
    title: 'First Step Badge',
    description: 'Earned your very first golden star!',
    icon: '🌟',
    requiredStars: 1,
    unlocked: false,
    category: 'general'
  },
  {
    id: 'abc_starter',
    title: 'ABC Explorer',
    description: 'Learned 5 alphabets with pronunciation!',
    icon: '🔤',
    requiredStars: 5,
    unlocked: false,
    category: 'alphabet'
  },
  {
    id: 'number_hero',
    title: 'Counting Hero',
    description: 'Counted numbers and solved math puzzle!',
    icon: '🔢',
    requiredStars: 10,
    unlocked: false,
    category: 'number'
  },
  {
    id: 'shape_wizard',
    title: 'Shape Wizard',
    description: 'Mastered circle, triangle, and square!',
    icon: '🔷',
    requiredStars: 15,
    unlocked: false,
    category: 'shape'
  },
  {
    id: 'rainbow_champ',
    title: 'Rainbow Champion',
    description: 'Popped colorful balloons and sorted items!',
    icon: '🌈',
    requiredStars: 20,
    unlocked: false,
    category: 'shape'
  },
  {
    id: 'puzzle_master',
    title: 'Puzzle Master',
    description: 'Solved interactive match puzzles!',
    icon: '🧩',
    requiredStars: 30,
    unlocked: false,
    category: 'puzzle'
  },
  {
    id: 'super_scholar',
    title: 'Grand Super Star',
    description: 'Earned 50 stars! You are super smart!',
    icon: '🏆',
    requiredStars: 50,
    unlocked: false,
    category: 'general'
  }
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'daily_abc',
    title: 'Tap 3 Letters in Alphabet World',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardStars: 3,
    icon: '🔤'
  },
  {
    id: 'daily_count',
    title: 'Count objects in Number World',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    rewardStars: 3,
    icon: '🔢'
  },
  {
    id: 'daily_shape',
    title: 'Match 2 Shapes correctly',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    rewardStars: 3,
    icon: '🔺'
  }
];
