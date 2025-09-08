import { C, S } from '../app/utils.js'
import {
	OrientedPosition,
	cubeColors,
	pos2vec3,
} from '../app/rules.ts'

AFRAME.registerComponent('g_cube', {
	schema: { default: '0 0 0' },
	init: function () {
		const up = new THREE.Vector3(0, 0, 1);
		S(this).leveldata.forEachFace(this.data, (type, dir, vec) => {
			const position = vec.toArray().map(c => c/2).join(' ');
			const plane = C('a-plane', {
				position,
				'color': cubeColors[type],
				'class': 'i',
				'side': 'double',
				'opacity': 0.8,
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

			const facelines = new THREE.LineLoop(
				new THREE.BufferGeometry().setFromPoints([
					new THREE.Vector3(-0.5, -0.5, 0),
					new THREE.Vector3(0.5, -0.5, 0),
					new THREE.Vector3(0.5, 0.5, 0),
					new THREE.Vector3(-0.5, 0.5, 0),
				]),
				new THREE.LineBasicMaterial({ color: '#333', linewidth: 3 })
			);
			facelines.position.copy(pos2vec3(position));
			facelines.quaternion.copy(quaternion);
			this.el.setObject3D('lines_mesh_' + dir, facelines); 
		});
	},
});
