import { C } from '../app/utils.js'

AFRAME.registerComponent('page_hello', {
	init: function() {
		this.el.append(C('a-plane', {
			'width': '0.4',
			'height': '0.4',
			'position': '0 0.15 0.1',
			'material': 'side: double; transparent: true; alphaTest: 0.5; src: #tex_c',
			'animation': 'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear',
		}));

		const btn = (value, position, fct) => {
			const el = C('a-entity', {
				'g_button': { value, height: 0.08, width: 0.4 },
				'position': position,
			});
			this.el.append(el);
			el.addEventListener('click', fct);
			return el;
		};

		btn('Start', '0 -0.14 0.1', _ => this.el.emit('catway:page:next'));
		btn('3D mode', '0 -0.25 0.1', _ => this.el.emit('catway:page:3D'));
	},
});
