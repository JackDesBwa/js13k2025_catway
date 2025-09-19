import { C } from '../app/utils.ts'

AFRAME.registerComponent('laser2-controls', {
	schema: {
	'hand': {default: 'right', oneOf: ['left', 'right']},
	},
	init: function() {
		C(this.el, { // Laser Left
			'laser-controls': { 'hand': this.data.hand },
			'hand-tracking-controls': { 'hand': this.data.hand },
			'raycaster': 'objects: .i',
			'grabworld': '',
			'i_vrcontroller': '',
		});
		this.el.addEventListener('pinchended', () => {
			const raycaster = this.el.children[0]?.components.raycaster;
			const intersects = raycaster?.intersectedEls || [];
			if (intersects.length > 0) {
				intersects[0].emit('click');
			}
		});
		this.el.sceneEl.addEventListener('controllersupdated', () => {
			setTimeout(() => {
				const hand = this.el.components['tracked-controls']?.controller?.hand;
				if (hand) {
					const s = this.data.hand == 'left' ? '-' : '';
					if (this.el.children.length == 0) this.el.append(C('a-entity', {
						'raycaster': 'objects: .i; showLine:true; direction: ' + s + '0.3 -0.2 -1; origin: 0 -0.05 -0.25',
					}));
				} else {
					if (this.el.children.length > 0)
						this.el.removeChild(this.el.children[0]);
				}
			}, 10);
		});
		this.el.sceneEl.addEventListener('exit-vr', () => {
			if (this.el.children.length > 0)
				this.el.removeChild(this.el.children[0]);
		});
	},
});
