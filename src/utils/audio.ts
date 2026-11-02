/**
 * Audio Engine for Smart Kids Puzzle World
 * - Pure Web Audio API synthesized sound effects (Pop, Chime, Boing, Fanfare, Star)
 * - Pure Web Audio API soft, cheerful nursery background music
 * - Web Speech API text-to-speech for friendly English pronunciation
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimeout: number | null = null;
  private musicStep = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a gentle bubble pop sound (great for tapping buttons, letters, balloons)
  playPop(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      // Quick pitch glide up and snap
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play a sweet star/ding sound
  playDing(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Play correct answer cheer arpeggio
  playCorrect(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.28, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {}
  }

  // Play playful cartoon "boing" / "try again" sound
  playWrong(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Gentle downward cartoon slide
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.18);
      osc.frequency.linearRampToValueAtTime(180, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Play grand celebration fanfare (victory on completing puzzle)
  playFanfare(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },    // C5
        { f: 523.25, t: 0.15, d: 0.15 }, // C5
        { f: 523.25, t: 0.30, d: 0.15 }, // C5
        { f: 659.25, t: 0.45, d: 0.3 },  // E5
        { f: 783.99, t: 0.75, d: 0.2 },  // G5
        { f: 1046.5, t: 0.95, d: 0.6 },  // C6
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.3, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {}
  }

  // Cheerful soft background nursery music using Web Audio API
  startMusic(musicEnabled = true) {
    if (!musicEnabled) {
      this.stopMusic();
      return;
    }
    if (this.isMusicPlaying) return;

    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Pentatonic scale notes for pleasant nursery tune: C4, D4, E4, G4, A4, C5
    const melody = [
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63,
      293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 523.25, 392.00,
      440.00, 392.00, 329.63, 293.66, 261.63, 329.63, 392.00, 261.63
    ];

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const freq = melody[this.musicStep % melody.length];
      this.musicStep++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Very soft background music volume (0.04) so voice is always loud & clear
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);

      // Schedule next note every 380ms
      this.musicTimeout = window.setTimeout(playNextNote, 380);
    };

    playNextNote();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  toggleMusic(enable: boolean) {
    if (enable) {
      this.startMusic(true);
    } else {
      this.stopMusic();
    }
  }
}

export const sounds = new SoundEngine();

/**
 * Text-to-Speech Engine for clear English pronunciation
 */
class SpeechEngine {
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    // Prefer friendly natural English voices (Google, Samantha, Karen, Daniel, or en-US)
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferred = enVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Samantha') || 
      v.name.includes('Google US English') ||
      v.name.includes('Karen') ||
      v.name.includes('Victoria')
    ) || enVoices[0];

    this.selectedVoice = preferred || null;
  }

  speak(text: string, rate = 0.9, pitch = 1.15, speechEnabled = true) {
    if (!speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = rate; // Slightly slower for kids
      utterance.pitch = pitch; // Cheerful higher pitch for kids
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error fallback
    }
  }

  // Cheerful praise generator
  cheer(speechEnabled = true) {
    const cheers = [
      'Excellent! Great job!',
      'Hooray! You did it!',
      'Superstar! Fantastic!',
      'Awesome! Star power!',
      'Brilliant! You are so smart!',
      'Wonderful! Keep going!'
    ];
    const phrase = cheers[Math.floor(Math.random() * cheers.length)];
    this.speak(phrase, 0.95, 1.25, speechEnabled);
    return phrase;
  }

  // Gentle encouragement for mistakes
  tryAgain(speechEnabled = true) {
    const encourages = [
      'Oops! Try again, you can do it!',
      'Almost there! Give it another try!',
      'Good try! Let\'s tap again!'
    ];
    const phrase = encourages[Math.floor(Math.random() * encourages.length)];
    this.speak(phrase, 0.9, 1.15, speechEnabled);
    return phrase;
  }
}

export const speech = new SpeechEngine();
