import { C } from '../app/utils.js'

AFRAME.registerComponent('page_hello', {
	init: function() {
		this.el.append(C('a-plane', {
			'width': '0.4',
			'height': '0.4',
			'material': 'side: double; transparent: true; alphaTest: 0.5; src: #tex_c',
			'animation': 'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear',
		}));
	},
});
