// audio.js - ES6 Module for Web Audio API synthesized tones (bells, chimes, timer alerts)

class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    _initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(isMuted) {
        this.muted = isMuted;
    }

    isMuted() {
        return this.muted;
    }

    /**
     * Plays a classic pleasant college lecture bell chime (dual harmonic)
     */
    playBell() {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [880, 1108.73, 1318.51]; // A5 major chord

        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (i * 0.08));

            gain.gain.setValueAtTime(0.15 / (i + 1), now + (i * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + (i * 0.2));

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (i * 0.08));
            osc.stop(now + 2.0);
        });
    }

    /**
     * Plays a victorious 3-note ascending fanfare when a countdown/sprint finishes
     */
    playCompleteFanfare() {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const startTime = now + (idx * 0.12);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }

    /**
     * Plays a subtle UI click feedback
     */
    playClick() {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }
}

export const SoundEngine = new SoundFX();

