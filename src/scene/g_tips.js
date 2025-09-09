import { C } from '../app/utils.js'

AFRAME.registerComponent('g_tips', {
	events: {
		'tips': function(e) {
			this.tips = e.detail.toReversed();
			this.m = this.tips.length - 1;
			this.el.emit('show');
		},
		'show': function() {
			if (this.m < 0) {
				C(this.el, { 'visible': false, 'text': { 'value': '', 'width': 0 } });
			} else {
				const t = { 'text': {
					'value': '\n' + this.tips[this.m] + '\n ',
					'width': 0.6
				}};
				C(this.el, {
					'visible': true,
					...t,
				});
				C(this.back, t);
			}
		},
		'click': function() {
			this.m -= 1;
			this.el.emit('show');
		}
	},
	init: function() {
		C(this.el, {
			'text': {
				'align': 'center',
				'color': '#666',
				'width': '1',
			},
			'geometry': { 'primitive': 'plane', 'height': 0, 'width': 0 },
			'material': { 'color': '#ccc', 'side': 'double' },
			'class': 'i',
		});
		this.back = C('a-text', {
			'align': 'center',
			'color': '#777',
			'width': '1',
			'rotation': '0 180 0',
			'position': '0 0 -0.001'
		});
		this.el.append(this.back);
	},
});
