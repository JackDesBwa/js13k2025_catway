import { C, S } from '../app/utils.js'
import {
	OrientedPosition,
	cubeColors,
} from '../app/rules.ts'

AFRAME.registerComponent('g_cube', {
	schema: { default: '0 0 0' },
	multiple: true,
	init: function () {
		const pos0 = this.data.split(' ').map(Number);
		const up = new THREE.Vector3(0, 0, 1);
		S(this).leveldata.forEachFace(this.data, (type, dir, vec) => {
			const position = vec.toArray().map((c, i) => c/2 + pos0[i]).join(' ');
			const plane = C('a-plane', {
				position,
				'class': 'i',
				'material': {
					'color': cubeColors[type],
					'src': '#tex_f',
					'side': 'double',
					'opacity': 0.8,
				},
				'animation': {
					'property': 'material.opacity',
					'dir': 'alternate',
					'loop': true,
					'dur': 2200,
					'easing': 'easeInOutQuad',
					'from': 0.8,
					'to': 0.2,
				},
			});
			this.el.append(plane);
			plane.addEventListener('mouseenter', () => {
				C(plane, { color: '#ccc' });
			});
			plane.addEventListener('mouseleave', () => {
				C(plane, { color: cubeColors[type] });
			});
			plane.addEventListener('click', () => {
				this.el.emit('catway:action:face', new OrientedPosition({ p: this.data, d: dir }));
			});
			const quaternion = new THREE.Quaternion().setFromUnitVectors(up, vec);
			plane.object3D.quaternion.copy(quaternion);
		});
	},
});
