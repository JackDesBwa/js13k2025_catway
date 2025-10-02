AFRAME.registerComponent('cursor3d_reposition', {
	dependencies: ['cursor'],
	init: function() {
		this.cursor = this.el.components.cursor;
		const wraped = this.cursor.onMouseMove;
		const transform = this.transform.bind(this);

		this.cursor.onMouseMove = function(evt) {
			const ev = { ...evt, type: evt.type };
			if (ev.type === 'touchmove' || ev.type === 'touchstart') {
				const touch = evt.touches.item(0);
				ev.touches = {
					item: function () {
						const [clientX, clientY] = transform(touch.clientX, touch.clientY);
						return { clientX, clientY };
					}
				};
			} else if (evt.type == 'mousemove') {
				const [clientX, clientY] = transform(evt.clientX, evt.clientY);
				ev.clientX = clientX;
				ev.clientY = clientY;
			}
			wraped.call(this.cursor, ev);
		};
	},

	transform: function(clientX, clientY) {
		const bounds = this.cursor.canvasBounds;
		let u = (clientX - bounds.left) / bounds.width;
		let v = (clientY - bounds.top) / bounds.height;

		const m = this.el.sceneEl.systems.stereofx.data;
		if (m < 2) {
			// No transform
		} else if (m < 4) {
			u = 0.25 + (u % 0.5);
		} else if (m < 6) {
			u = (u % 0.5) * 2;
		} else if (m < 8) {
			u = u * 2 - 0.5
			v = (v % 0.5) * 2;
		} else if (m < 10) {
			v = (v % 0.5) * 2;
		} else if (m < 16) {
			// No transform
		}	else if (m < 19) {
			const u0 = u;
			u = 0.25 + (u % 0.5);
			if (u0 < 0.5 && ((m - 15) & 1) == 1) u = 1 - u;
			if (u0 > 0.5 && ((m - 15) & 2) == 2) u = 1 - u;
		}

		return [
			u * bounds.width + bounds.left,
			v * bounds.height + bounds.top
		];
	}
});
