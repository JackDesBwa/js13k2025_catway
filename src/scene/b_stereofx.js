import { StereoscopicEffects } from 'threejs-stereoscopiceffects'

AFRAME.registerSystem('stereofx', {
	schema: { default: 0 },
	init: function () {
		this.sfx = new StereoscopicEffects({
			renderer: this.el.renderer,
			defaultEffect: this.data,
			inject: true,
		});
	},
	update: function() {
		this.sfx.setEffect(this.data);
	}
});
