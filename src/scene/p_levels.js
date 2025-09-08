import { C } from '../app/utils.js'

AFRAME.registerComponent('page_levels', {
	schema: { default: 1 },
	init: function() {
		const b = Math.ceil(Math.sqrt(this.data+1));
		const s0 = (b - 1) / 2 * 0.12;
		const back = C('a-entity', {
			'g_button': { value: '<', width: 0.05, circle: true },
			'position': { 
				x: -s0,
				y: s0,
				z: 0.1
			},
		});
		back.addEventListener('click', _ => this.el.emit('catway:page:back'));
		this.el.append(back);
		for (let i = 1; i <= this.data; i++) {
			const x = -s0 + (i % b) * 0.12;
			const y = s0 - Math.floor(i / b) * 0.12;
			const el = C('a-entity', {
				'g_button': { value: i, width: 0.05, circle: true },
				'position': { x, y, z: 0.1 },
			});
			this.el.append(el);
			el.addEventListener('click', _ => this.el.emit('catway:page:next', i));
		}
		this.el.append(C('a-text', {
			value: 'Levels',
			align: 'center',
			position: [0, s0 + 0.1, 0.1].join(' '),
			width: 1,
		}));
	},
});
