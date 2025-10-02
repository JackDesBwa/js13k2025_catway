AFRAME.registerSystem('fullscreen', {
	init: function () {
		const canvas = this.el.canvas;
		canvas.focus();
		
		canvas.addEventListener('keydown', e => {
			if (e.key == 'f') {
				if (document.fullscreenElement) {
					document.exitFullscreen()
				} else {
					canvas.requestFullscreen();
				}
			}
		});

		document.addEventListener('fullscreenchange', () => {
			canvas.focus();
		});
	},
});
