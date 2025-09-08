import { C } from '../app/utils.js'

AFRAME.registerComponent('page_play', {
	init: function() {
		const back = C('a-entity', {
			'g_button': { value: '<', width: 0.04, circle: true },
		});
		this.el.append(back);
		back.addEventListener('click', _ => this.el.emit('catway:page:back'));
	},
});
