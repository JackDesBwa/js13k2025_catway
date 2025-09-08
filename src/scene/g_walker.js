import { C } from '../app/utils.js'
import { dir2vec3 } from '../app/rules.ts'

AFRAME.registerComponent('g_walker', {
	schema: {
		p: { type: 'vec3' },
		d: { default: 0 },
		h: { default: 0.55 },
		src: { default: '' },
	},

	init: function () {
		this.inner = C('a-plane', {
			'material': 'side: double; transparent: true; alphaTest: 0.5; src: ' + this.data.src,
		});
		this.el.append(this.inner);
	},

	update: function(o) {
		if (this.data.h != o.h) {
			C(this.inner, { position: { z: this.data.h } });
		}
		if (this.data.p != o.p) {
			C(this.el, { position: this.data.p });
		}
		if (this.data.d != o.d) {
			const up = new THREE.Vector3(0, 0, 1);
			const vec = dir2vec3(this.data.d);
			const quaternion = new THREE.Quaternion().setFromUnitVectors(up, vec);
			this.el.object3D.quaternion.copy(quaternion);
		}
	}
});
