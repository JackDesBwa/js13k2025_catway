import { C, S } from '../app/utils.ts'

AFRAME.registerSystem('a_switcher', {
	init: function() {
		this.added = [];
		this.inner = C('a-entity', { id: 'worldgrab' });
		this.el.append(this.inner);
		this.el.addEventListener('loaded', this.on_loaded.bind(this));
	},

	on_loaded: function() {
		S(this, 'page', this.on_page.bind(this));
	},

	on_page: function(n) {
		for (const el of this.added) this.inner.removeChild(el);
		this.added = [];

		const p = C('a-entity', {
			['page_' + n]: '',
			'position': '0 1 -0.6'
		});
		this.added.push(p);
		this.inner.append(p);
	}
});
