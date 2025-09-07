import { C } from '../app/utils.js'

AFRAME.registerSystem('g_sky', {
	init: function() {
		this.sky = null;
		const s = this.el.sceneEl;

		const starsCanvas = C('canvas', {
			'id': 'tex_s',
			'width': '512',
			'height': '512',
		});
		s.querySelector('a-assets').append(starsCanvas);
		const ctx = starsCanvas.getContext('2d');
		if (ctx) {
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
			for (let i = 0; i < 150; i++) {
				const x = Math.random() * starsCanvas.width;
				const y = Math.random() * starsCanvas.height;
				const radius = Math.random() * 1.5 + 0.5;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fillStyle = '#333';
				ctx.fill();
			}
		}

		const r = _ => {
			this.sky?.parentNode?.removeChild(this.sky);
			this.sky = C('a-sky', {
				'src': '#tex_s',
				'repeat': '20 15',
				'geometry': 'segmentsHeight: 4; segmentsWidth: 4',
			});
			if (s.is('ar-mode')) {
				// Nothing, already removed
			} else if (s.is('vr-mode')) {
				s.append(this.sky);
			} else {
				s.querySelector('[camera]').append(this.sky);
			}
		}

		s.addEventListener('enter-vr', r);
		s.addEventListener('exit-vr', r);
		r();
	},
});
