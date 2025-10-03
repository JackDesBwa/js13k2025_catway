import { C, S } from '../app/utils.js'

AFRAME.registerComponent('page_tryxr', {
	schema: { default: 1 },
	init: async function() {
		const sceneEl = this.el.sceneEl;
		sceneEl.systems.a_switcher.reset_view();

		if (sceneEl.is('ar-mode') || sceneEl.is('vr-mode') || S(this, 'noxr')) {
			this.el.emit('catway:page:next');
			return;
		}

		let ar = false, vr = false;
		if (navigator.xr) {
			vr = !!(await navigator.xr.isSessionSupported('immersive-vr'));
			ar = !!(await navigator.xr.isSessionSupported('immersive-ar'));
		}

		if (!ar && !vr) {
			this.el.emit('catway:page:next');
			return;
		}

		const btn = (value, position, fct) => {
			const el = C('a-entity', {
				'g_button': { value, width: 0.4, height: 0.035, fontsize: 0.5 },
				'position': position,
			});
			this.el.append(el);
			el.addEventListener('click', fct);
			return el;
		}

		this.el.append(C('a-text', {
			value: 'Your device has XR capabilities, but no session is started. Do you want to switch to XR?',
			align: 'center',
			position: [0, 0.15, 0.1].join(' '),
			width: 0.8,
		}));

		if (ar) {
			btn('Augmented Reality', {x: 0, y: 0.05, z: 0.1}, _ => {
				this.el.sceneEl.enterAR();
				this.el.emit('catway:page:next');
			});
		}

		if (vr) {
			btn('Virtual Reality', {x: 0, y: 0, z: 0.1}, _ => {
				this.el.sceneEl.enterVR();
				this.el.emit('catway:page:next');
			});
		}

		btn('Nope, continue', {x: 0, y: -0.05, z: 0.1}, _ => {
			S(this, { 'noxr': true });
			this.el.emit('catway:page:next');
		});
	},
});
