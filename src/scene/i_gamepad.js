AFRAME.registerSystem('g_gamepad', {
	init: function() {
		this.pressed = {}
	},

	map: {
		L: g => g.axes[0] < -0.7,
		U: g => g.axes[1] < -0.7,
		R: g => g.axes[0] > 0.7,
		D: g => g.axes[1] > 0.7,
		J: g => g.buttons[0].pressed,
		W: g => g.buttons[1].pressed,
	},

	tick: function () {
		Array.from(navigator.getGamepads()).forEach(g => {
			if (!g) return;
			Object.keys(this.map).forEach(input => {
				const v = this.map[input](g);
				if (this.pressed[input] != v) this.el.emit('catway:input:' + input, v);
				this.pressed[input] = v;
			})
		});
	}
});
