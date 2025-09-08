import { C, S } from '../app/utils.ts'
import level1 from '../data/level_01.json'

AFRAME.registerSystem('a_switcher', {
	init: function() {
		this.added = [];
		this.inner = C('a-entity', { id: 'worldgrab' });
		this.el.append(this.inner);
		this.el.addEventListener('loaded', this.on_loaded.bind(this));
	},

	on_loaded: function() {
		this.el.camera.focus = 2;
		S(this, 'stereofx', v => C(this.el, { stereofx: v }));
		S(this, 'page', this.on_page.bind(this));
		S(this).setLevel(level1);
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

		if (n == '3dmode') {
			p.addEventListener('catway:page:next', _ => S(this, { page: 'hello' }));
			p.addEventListener('catway:page:back', _ => S(this, { page: 'hello' }));
		}
		if (n == 'hello') {
			p.addEventListener('catway:page:next', _ => S(this, { page: 'play' }));
			p.addEventListener('catway:page:3D', _ => S(this, { page: '3dmode' }));
		}
		if (n == 'play') {
			p.addEventListener('catway:page:back', _ => S(this, { page: 'hello' }));
			p.addEventListener('catway:play:win', _ => S(this, { page: 'hello' }));
			p.addEventListener('catway:play:die', _ => {
				setTimeout(_ => p.emit('resetLevel'), 500);
			});
		}
	}
});
