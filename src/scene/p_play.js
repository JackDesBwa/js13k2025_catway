import { OrientedPosition } from '../app/rules.js';
import { C, S } from '../app/utils.js'

function vec4q(v) {
	if (v.p) {
		return v.p + ' ' + v.d;
	} else {
		const c = v.split(' ').map(Number);
		return new OrientedPosition({
			p: c.slice(0, 3).join(' '),
			d: c[3]
		});
	}
}

AFRAME.registerComponent('page_play', {
	init: function() {
		this.el.sceneEl.addEventListener('catway:leveldata', this.reloadLevel.bind(this));
		this.el.addEventListener('catway:action:face', e => this.on_move(e.detail));
		this.el.addEventListener('resetLevel', _ => this.resetLevel());
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
			'class': 'cat',
			'g_walker': { ...this.level.cat, src: '#tex_c', h: 0.56 },
		});
		w.append(this.cat);

		w.append(C('a-entity', {
			'g_walker': { ...this.level.pillow, src: '#tex_p', osc: -10 },
		}));

		S(this, 'cat', cat => C(this.cat, { 'g_walker' : vec4q(cat) }));

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

		this.resetLevel();

		if (import.meta.env.DEV) {
			import('../dev/devtools.js').then(module => {
				module.graph_show(
					module.level_graph(this.level),
					this.level.pillow.p,
					this.level.pillow.d
				);
			});
		}
	},

	resetLevel: function() {
		S(this, { cat: vec4q(this.level.cat) });
	},

	on_move: function(q) {
		const cat_q = vec4q(S(this, 'cat'));
		const e = m => this.el.emit('catway:play:' + m);

		let valid = false;
		this.level.forEachMove(cat_q, dest => q && dest.equals(q) && (valid = true));
		if (!valid) return e('cantmove');

		S(this, { cat: vec4q(q) });

		if (this.level.die(q)) return e('die');
		if (q.equals(this.level.pillow)) return e('win');
		return e('move');
	}
});
