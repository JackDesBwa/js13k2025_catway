AFRAME.registerComponent('grabworld', {
	init: function () {
		this.grabbed = null;
	},
	events: {
		gripdown: function () {
			this.grabbed = this.el.sceneEl.querySelector('#worldgrab');
			if (this.grabbed)
				this.el.object3D.attach(this.grabbed.object3D);
		},
		gripup: function () {
			if (this.grabbed) {
				this.el.sceneEl.object3D.attach(this.grabbed.object3D);
				this.grabbed = null;
			}
		}
	}
});
