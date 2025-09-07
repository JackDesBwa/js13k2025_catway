AFRAME.registerComponent('orbit-controls', {
	schema: {
		anchor: { type: 'vec3' },
		distance: { default: 2 },
	},

	init: function () {
		this.rig = this.el.object3D;
		this.anchor = new THREE.Vector3().copy(this.data.anchor);
		this.isLeftDragging = false;
		this.isRightDragging = false;
		this.angles = new THREE.Vector2();

		const canvas = this.el.sceneEl.canvas;
		canvas.addEventListener('pointerdown', e => {
			if (e.button === 0) this.isLeftDragging = true;
			if (e.button === 2) this.isRightDragging = true;
		});

		canvas.addEventListener('pointerup', e => {
			if (e.button === 0) this.isLeftDragging = false;
			if (e.button === 2) this.isRightDragging = false;
		});
		
		canvas.addEventListener('pointermove', this.onMouseMove.bind(this));
		
		canvas.addEventListener('dblclick', _ => {
			this.anchor = new THREE.Vector3().copy(this.data.anchor);
			this.angles.set(0, 0);
			this.camupdate();
		});
		
		canvas.addEventListener('contextmenu', e => e.preventDefault());

		this.camupdate();
	},

	onMouseMove: function (e) {
		if (this.isLeftDragging) {
			this.angles.add(new THREE.Vector2(
				0.005 * -e.movementY,
				0.005 * -e.movementX 
			));
			this.angles.x = THREE.MathUtils.clamp(this.angles.x, -Math.PI/2+0.1, Math.PI/2-0.1);
			this.camupdate();
		}

		if (this.isRightDragging) {
			const q = this.rig.quaternion;
			this.anchor.addScaledVector(
				new THREE.Vector3(1, 0, 0).applyQuaternion(q),
				0.005 * -e.movementX
			);
			this.anchor.addScaledVector(
				new THREE.Vector3(0, 1, 0).applyQuaternion(q),
				0.005 * e.movementY
			);
		}
		this.camupdate();
	},

	camupdate: function() {
		const v = new THREE.Vector3(0, 0, this.data.distance);
		const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.angles.y);
		const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.angles.x);
		v.applyQuaternion(qY.multiply(qX)); // X then Y
		this.rig.position.copy(v).add(this.anchor);
		this.rig.lookAt(new THREE.Vector3().copy(this.rig.position).add(v));
	},
});
