AFRAME.registerSystem('i_process', {
	init: function() {
		const inputs = {};
		"WJLURD".split('').forEach(input => {
			inputs[input] = false;
			this.el.addEventListener('catway:input:' + input, e => {
				if (import.meta.env.DEV) console.log('catway:input:' + input, e.detail)
				if (!input[input] && e.detail) {
					inputs[input] = e.detail;
					const dir = 'LURD'.split('').map(k => inputs[k] ? k : '').join('');
					if (inputs['W'] && !inputs['J'] && dir.length == 1) {
						this.el.emit('catway:action:walk', dir);
					} else if (inputs['J'] && !inputs['W'] && dir.length < 2) {
						this.el.emit('catway:action:jump', dir);
					}
				}
				inputs[input] = e.detail;
			});
		});
		if (import.meta.env.DEV) {
			this.el.addEventListener('catway:action:walk', e => console.log('catway:action:walk', e.detail));
			this.el.addEventListener('catway:action:jump', e => console.log('catway:action:jump', e.detail));
		}
	}
});
