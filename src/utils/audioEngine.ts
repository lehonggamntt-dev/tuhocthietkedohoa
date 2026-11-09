/**
 * Procedural Web Audio Engine for 45s Educational Video
 * Generates soft background chimes and UI transition sound effects
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.20;
  private isPlaying: boolean = false;
  private beatTimer: number | null = null;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();

      this.musicGainNode.gain.value = this.musicVolume;
      this.sfxGainNode.gain.value = 0.35;

      this.musicGainNode.connect(this.ctx.destination);
      this.sfxGainNode.connect(this.ctx.destination);
    }
  }

  public getAudioDestinationNode(): AudioNode | null {
    this.init();
    return this.musicGainNode;
  }

  public getAudioContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setTargetAtTime(
        this.isMuted ? 0 : this.musicVolume,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setTargetAtTime(
        this.isMuted ? 0 : this.musicVolume,
        this.ctx.currentTime,
        0.05
      );
    }
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  // Play a pleasant educational chime note
  public playNote(
    freq: number,
    duration: number = 0.35,
    type: OscillatorType = 'sine',
    gainMultiplier: number = 1.0
  ) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.sfxGainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm envelope
    noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.18 * gainMultiplier, this.ctx.currentTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(noteGain);
    noteGain.connect(this.sfxGainNode);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  // Scene transition swoosh
  public playTransitionChime() {
    if (this.isMuted) return;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5 major arpeggio
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.45, 'triangle', 0.8);
      }, idx * 75);
    });
  }

  // Parameter adjustment tick
  public playParameterTick(pitch: number = 440) {
    if (this.isMuted) return;
    this.playNote(pitch, 0.08, 'sine', 0.3);
  }

  // Start background musical loop synced with playback
  public startMusic() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    if (this.beatTimer) clearInterval(this.beatTimer);

    // Warm, calm educational chords
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0], // Am7
      [174.61, 261.63, 329.63, 349.23], // Fmaj7
      [196.0, 293.66, 392.0, 440.0], // Gsus4
    ];

    let chordStep = 0;
    this.beatTimer = window.setInterval(() => {
      if (!this.isPlaying || this.isMuted) return;
      const currentChord = chords[chordStep % chords.length];
      chordStep++;

      // Play soft arpeggiated synth chime
      currentChord.forEach((freq, i) => {
        setTimeout(() => {
          if (this.isPlaying && !this.isMuted) {
            this.playNote(freq * 1.5, 0.8, 'sine', 0.2);
          }
        }, i * 180);
      });
    }, 1800);
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.beatTimer) {
      clearInterval(this.beatTimer);
      this.beatTimer = null;
    }
  }

  public resetSceneTrigger() {
    // No-op
  }
}

export const audioEngine = new AudioEngine();
