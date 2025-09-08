import { C } from '../app/utils.ts'

AFRAME.registerSystem('a_switcher', {
	init: function() {
		this.added = [];
		this.el.addEventListener('loaded', this.on_loaded.bind(this));
	},

	on_loaded: function() {
		this.on_page('hello');
	},

	on_page: function(n) {
		for (const el of this.added) this.el.removeChild(el);
		this.added = [];

		const p = C('a-entity', {
			['page_' + n]: '',
			'position': '0 1 -0.6'
		});
		this.added.push(p);
		this.el.append(p);
	}
});
