import { C, S } from '../app/utils.js'

AFRAME.registerComponent('page_play', {
	init: function() {
		this.el.sceneEl.addEventListener('catway:leveldata', this.reloadLevel.bind(this));
		this.el.addEventListener('catway:action:face', e => console.log(e));
		this.reloadLevel();
	},
	reloadLevel: function() {
		this.level = S(this).leveldata;

		for (const c of this.el.children) this.el.removeChild(c);
		if (!this.level) return;

		const w = C('a-entity');
		this.el.append(w);

		for (const pos of Object.keys(this.level.cubes)) {
			w.append(C('a-entity', {
				'g_cube': pos,
				'position': pos
			}));
		}

		this.cat = C('a-entity', {
			'g_walker': { ...this.level.cat, src: '#tex_c', h: 0.56 },
		});
		w.append(this.cat);

		w.append(C('a-entity', {
			'g_walker': { ...this.level.pillow, src: '#tex_p' },
		}));

		const s = 0.6/(Math.max(...this.level.size)+1);
		C(w, {
			'scale': [s, s, s].join(' '),
			'position': this.level.size.map(c => -c*s/2).join(' '),
		});

		const back = C('a-entity', {
			'g_button': { value: '<', fontsize: 4, width: 0.25, circle: true },
			'position': '-1 -1 -1',
		});
		w.append(back);
		back.addEventListener('click', _ => this.el.emit('catway:page:back'));
	},
});
