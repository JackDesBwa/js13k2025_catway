AFRAME.registerComponent('fov-controls', {
	schema: {
		min: { default: 10 },
		max: { default: 120 },
	},

	init: function () {
		const camera = this.el.getObject3D('camera');
		const setFov = f => {
			camera.fov = THREE.MathUtils.clamp(f, this.data.min, this.data.max);
			camera.updateProjectionMatrix();
		};

		this.el.sceneEl.addEventListener('wheel', e => setFov(camera.fov + e.deltaY/20));

		let d0;
		const d = t => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)/15;
		this.el.sceneEl.addEventListener('touchstart', e => e.touches.length == 2 && (d0 = camera.fov + d(e.touches)));
		this.el.sceneEl.addEventListener('touchmove', e => e.touches.length == 2 && d0 && setFov(d0 - d(e.touches)));
		this.el.sceneEl.addEventListener('touchend', _ => d0 = 0);
	},
});
