AFRAME.registerComponent('cursor3d', {
	dependencies: ['cursor'],
	init: function() {
		document.body.style.cursor = 'none';
		this.el.setAttribute('cursor', { mouseCursorStylesEnabled: false });

		const canvas = this.el.sceneEl.canvas;
		const raycaster = this.el.components.raycaster;
		const camera = document.querySelector('[camera]').object3D;
		const dotEl = document.querySelector('#cursorDot');
		const dot = dotEl.object3D;

		this.dotEl = dotEl;
		this.timer = -1;
		this.lastMove = Date.now();

		canvas.addEventListener('mouseenter', _ => dotEl.setAttribute('visible', true));
		canvas.addEventListener('mouseleave', _ => dotEl.setAttribute('visible', false));
		canvas.addEventListener('mousemove', _ => {
			if (raycaster && raycaster.intersections.length > 0) {
				const intersection = raycaster.intersections[0];

				const normal = intersection.face.normal.clone().applyMatrix3(
					new THREE.Matrix3().getNormalMatrix(intersection.object.matrixWorld)
				).normalize();
				const offset = normal.clone().multiplyScalar(
					0.013 * (raycaster.raycaster.ray.direction.dot(normal) < 0 ? 1 : -1)
				)

				const pos = intersection.point.clone().add(offset);
				dot.position.copy(pos);
				dot.lookAt(dot.position.clone().add(offset));

			} else {
				const pos = new THREE.Vector3();
				raycaster.raycaster.ray.at(2, pos);
				dot.position.copy(pos);
				dot.lookAt(camera.position);
			}

			if (this.timer < 0) {
				this.timer = setTimeout(this.hideCursorTimeout.bind(this), 4000);
				dotEl.setAttribute('visible', true);
			}
		});
	},
	hideCursorTimeout: function() {
		const now = Date.now();
		const delay = 4200;
		const dt = now - this.lastMove;

		if (dt >= delay) {
			this.dotEl.setAttribute('visible', false);
			this.timer = -1;
		} else {
			this.timer = setTimeout(this.hideCursorTimeout.bind(this), delay - dt);
		}
	},
});
