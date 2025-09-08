type ToneOptions = {
	frequency?: number;
	duration?: number;
	type?: OscillatorType;
	volume?: number;
	startTime?: number;
	attack?: number;
	release?: number;
	lowpass?: number;
};

function s2f(s: string) {
	let td = 0;
	return [...s].map(a => {
		if (a == ' ') {
			td += 1;
			return null;
		}
		const ascii = a.charCodeAt(0)
		const d = ascii > 90 ? 1 : 2;
		const note = d < 2 ? ascii - 97 + 45 : ascii - 65 + 45;
		td += d;
		return { f: 440 * Math.pow(2, (note - 69) / 12), d, td: td - d };
	}).filter(a => a !== null);
}

export class SoundFx {
  ctx: AudioContext;
	loops_id: Record<string, any>;
	loops_en: Record<string, boolean>;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
		this.loops_id = {};
		this.loops_en = {};
  }

	playTone(options: ToneOptions): void {
		const {
			frequency = 440,
			duration = 0.1,
			type = 'triangle',
			volume = 0.5,
			startTime = this.ctx.currentTime,
			attack = 0.01,
			release = 0.05,
			lowpass
		} = options;

		const oscillator = this.ctx.createOscillator();
		const gainNode = this.ctx.createGain();
		const filter = this.ctx.createBiquadFilter();

		oscillator.type = type;
		oscillator.frequency.setValueAtTime(frequency, startTime);

		gainNode.gain.setValueAtTime(0.0001, startTime);
		gainNode.gain.exponentialRampToValueAtTime(volume, startTime + attack);
		gainNode.gain.setValueAtTime(volume, startTime + duration - release);
		gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

		filter.type = 'lowpass';
		filter.frequency.value = lowpass || 100;
		filter.Q.value = 1;

		oscillator.connect(gainNode);
		if (lowpass) {
			gainNode.connect(filter);
			filter.connect(this.ctx.destination);
		}else {
			gainNode.connect(this.ctx.destination);
		}

		oscillator.start(startTime);
		oscillator.stop(startTime + duration);
	}

	playSeq(sequence: ToneOptions[]): void {
		const now = this.ctx.currentTime;
		for (const tone of sequence) {
			this.playTone({
				...tone,
				startTime: now + (tone.startTime || 0),
			});
		}
	}

	play(c: {
		seq: string[];
		loop?: string,
		opts: ToneOptions | ToneOptions[]
	}) {
		const opts = Array.isArray(c.opts) ? c.opts : [c.opts];
		const s = c.seq[Math.floor(Math.random() * c.seq.length)];
		const d = opts.reduce((m, v) => Math.max(m, v.duration || 0.1), 0);
		let td = 0;
		for (const opt of opts) {
			this.playSeq(
				s2f(s).map((s: { f: number, d: number, td: number }) => {
					const startTime = (opt.startTime || 0) + s.td * d;
					const duration = d * s.d;
					td = Math.max(td, startTime + duration);
					return {
						...opt,
						frequency: s.f,
						duration,
						startTime,
					};
				})
			);
		}
		if (c.loop && this.loops_en[c.loop]) {
			this.loops_id[c.loop] = setTimeout(() => this.play(c), 1000 * td);
		}
		return td;
	}

	playLoop(loop_name: string, c: any) {
		this.loops_en[loop_name] = true;
		this.play({ ...c, loop: loop_name });
	}

	stopLoop(loop_name: string) {
		this.loops_en[loop_name] = false;
		clearTimeout(this.loops_id[loop_name]);
	}
}
