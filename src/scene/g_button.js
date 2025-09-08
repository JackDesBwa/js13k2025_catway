import { C } from '../app/utils.js'

AFRAME.registerComponent('g_button', {
	schema: {
		fontsize: { default: 1 },
		value: { default: '' },
		width: { default: 1 },
		height: { default: 0.2 },
		circle: { defualt: false },
	},
	events: {
		'mouseenter': function() {
			C(this.el, { 'material': { 'color': '#eee' }})
		},
		'mouseleave': function() {
			C(this.el, { 'material': { 'color': '#ccc' }})
		},
	},
	init: function() {
		C(this.el, {
			'text': {
				'align': 'center',
				'color': '#666',
				'height': 0.001,
			},
			'material': { 'color': '#ccc', 'side': 'double' },
			'class': 'i'
		});
		this.back = C('a-text', {
			'align': 'center',
			'color': '#777',
			'height': 0.001,
			'rotation': '0 180 0',
			'position': '0 0 -0.001'
		});
		this.el.append(this.back);
	},
	update: function() {
		C(this.el, {
			text: {
				value: this.data.value,
				width: this.data.fontsize,
			},
			geometry: this.data.circle ? 
				{ primitive: 'circle', radius: this.data.width } :
				{ primitive: 'plane', width: this.data.width, height: this.data.height },
		});
		C(this.back, {
				value: this.data.value,
				width: this.data.fontsize,
		});
	}
});
