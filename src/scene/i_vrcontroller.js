AFRAME.registerComponent('i_vrcontroller', {
	init: function() {
		const pressed = {};
		for (const ev of Object.keys(this.btnmap)) {
			this.el.addEventListener(ev, e => {
				const t = this.btnmap[ev];
				const v = e.detail.pressed;
				if (v != pressed[t]) this.el.sceneEl.emit('catway:input:' + t, v);
				pressed[t] = v;
			});
		}
		this.el.addEventListener('thumbstickmoved', e => {
			Object.keys(this.stickmap).forEach(input => {
				const v = this.stickmap[input](e.detail.x, e.detail.y);
				if (pressed[input] != v) this.el.emit('catway:input:' + input, v);
				pressed[input] = v;
			})
		});
	},

	btnmap: {
		abuttonchanged: 'W',
		bbuttonchanged: 'J',
		xbuttonchanged: 'W',
		ybuttonchanged: 'J',
	},
	stickmap: {
		L: (x, _) => x < -0.7,
		U: (_, y) => y < -0.7,
		R: (x, _) => x > 0.7,
		D: (_, y) => y > 0.7,
	},
});
