import { C } from '../app/utils.ts'

AFRAME.registerSystem('g_keyboard', {
	init: function() {
		const canvas = this.el.canvas;
		C(canvas, { tabindex: 1 });
		canvas.addEventListener('keydown', e => {
			const key = this.map[e.key.toLowerCase()];
			if (key && !e.repeat) this.el.emit('catway:input:' + key, true);
		});
		canvas.addEventListener('keyup', e => {
			const key = this.map[e.key.toLowerCase()];
			if (key) this.el.emit('catway:input:' + key, false);
		});
	},
	map: {
		'arrowleft': 'L',
		'arrowup': 'U',
		'arrowright': 'R',
		'arrowdown': 'D',
		'c': 'W',
		'x': 'J',
	}
});
