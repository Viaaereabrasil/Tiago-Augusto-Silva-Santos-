// Audio synthesizer using Web Audio API (no external asset dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Pleasant chime when checking off a set
  playSetCheck() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);

      if ('vibrate' in navigator) {
        navigator.vibrate?.([40]);
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Energizing chime when starting a workout
  playStartWorkout() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });

      if ('vibrate' in navigator) {
        navigator.vibrate?.([50, 40, 70]);
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Quick click feedback
  playClick() {
    this.playSetCheck();
  }

  // Success celebration tone
  playSuccess() {
    this.playStartWorkout();
  }

  // Alarm looping interval ID & active oscillators
  private alarmInterval: number | null = null;
  private isAlarmPlaying = false;
  private activeAlarmOscillators: OscillatorNode[] = [];

  // Energetic beep sequence when rest timer finishes
  playTimerDone() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
        this.activeAlarmOscillators.push(osc);
      };

      const now = ctx.currentTime;
      playBeep(880, now, 0.15); // A5
      playBeep(880, now + 0.2, 0.15);
      playBeep(1174.66, now + 0.4, 0.35); // D6

      if ('vibrate' in navigator) {
        navigator.vibrate?.([100, 50, 100, 50, 200]);
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Play a specific alarm pulse based on pattern
  private triggerAlarmPulse(pattern: 'intense' | 'classic' | 'chime' | 'countdown' = 'intense') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (pattern === 'intense') {
        // High energy gym buzzer / motivational alarm
        const playHorn = (freq: number, offset: number, dur: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + offset);
          gain.gain.setValueAtTime(0.25, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + dur);
          this.activeAlarmOscillators.push(osc);
        };

        playHorn(440, 0, 0.2);
        playHorn(554.37, 0.15, 0.2);
        playHorn(659.25, 0.3, 0.2);
        playHorn(880, 0.45, 0.45);

        if ('vibrate' in navigator) {
          navigator.vibrate?.([200, 100, 200, 100, 400]);
        }
      } else if (pattern === 'classic') {
        // Classic digital alarm clock (beep-beep-beep-beep)
        const playBeep = (offset: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(987.77, now + offset); // B5
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
          this.activeAlarmOscillators.push(osc);
        };

        playBeep(0);
        playBeep(0.18);
        playBeep(0.36);
        playBeep(0.54);

        if ('vibrate' in navigator) {
          navigator.vibrate?.([150, 100, 150, 100, 150]);
        }
      } else if (pattern === 'chime') {
        // Harmonious bell chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          gain.gain.setValueAtTime(0.2, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.6);
          this.activeAlarmOscillators.push(osc);
        });

        if ('vibrate' in navigator) {
          navigator.vibrate?.([80, 80, 80, 80, 150]);
        }
      } else {
        // Countdown progressive pulse
        const freqs = [330, 440, 587.33, 880];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.15);
          gain.gain.setValueAtTime(0.15 + i * 0.04, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.25);
          this.activeAlarmOscillators.push(osc);
        });
      }
    } catch {
      // Ignore audio failure
    }
  }

  // Play a single 1-2 sec preview of an alarm sound
  previewAlarmSound(pattern: 'intense' | 'classic' | 'chime' | 'countdown' = 'intense') {
    this.triggerAlarmPulse(pattern);
  }

  // Start continuous workout alarm loop
  startAlarm(pattern: 'intense' | 'classic' | 'chime' | 'countdown' = 'intense') {
    this.stopAlarm();
    this.isAlarmPlaying = true;
    this.triggerAlarmPulse(pattern);

    this.alarmInterval = window.setInterval(() => {
      if (this.isAlarmPlaying) {
        this.triggerAlarmPulse(pattern);
      }
    }, 1800);
  }

  // Check if alarm is currently ringing
  getIsAlarmPlaying(): boolean {
    return this.isAlarmPlaying;
  }

  // Stop the continuous alarm immediately, cut all active audio oscillators and cancel vibrations
  stopAlarm() {
    this.isAlarmPlaying = false;
    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }

    // Immediately stop & disconnect all active oscillators
    if (this.activeAlarmOscillators.length > 0) {
      this.activeAlarmOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped oscillators
        }
      });
      this.activeAlarmOscillators = [];
    }

    // Cancel all hardware vibrations immediately
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.(0);
      } catch {
        // ignore vibration failure
      }
    }
  }
}

export const sounds = new SoundEngine();
export const soundEngine = sounds;
