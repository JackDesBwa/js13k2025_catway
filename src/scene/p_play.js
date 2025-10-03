import { OrientedPosition, dirInv } from '../app/rules.js';
import { C, S, anim_enter_scale } from '../app/utils.js'

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

const reldir = (d, v) => {
	const U = [1, 5, 1, 1, 2, 1],
	L = [2, 3, 3, 5, 3, 0];
	if (v == '') return d;
	if (v == 'L') return L[d];
	if (v == 'U') return U[d];
	if (v == 'R') return dirInv(L[d]);
	if (v == 'D') return dirInv(U[d]);
}

AFRAME.registerComponent('page_play', {
	init: function() {
		this.el.sceneEl.systems.a_switcher.reset_view();
		this.el.sceneEl.addEventListener('catway:leveldata', this.reloadLevel.bind(this));
		this.el.addEventListener('resetLevel', _ => this.resetLevel());
		this.reloadLevel();

		['face', 'walk', 'jump'].forEach(v => {
			this['on_' + v] = this['on_' + v].bind(this);
			this.el.sceneEl.addEventListener('catway:action:' + v, this['on_' + v]);
		});
	},

	remove: function() {
		this.el.sceneEl.removeEventListener('catway:action:face', this.on_face);
		this.el.sceneEl.removeEventListener('catway:action:walk', this.on_walk);
		this.el.sceneEl.removeEventListener('catway:action:jump', this.on_jump);
	},

	reloadLevel: function() {
		this.level = S(this).leveldata;

		for (const c of this.el.children) this.el.removeChild(c);
		if (!this.level) return;

		const w = C('a-entity');
		this.el.append(w);

		for (const pos of Object.keys(this.level.cubes)) {
			C(w, { ['g_cube__' + pos.replaceAll(' ', '_')]: pos });
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
			...anim_enter_scale(),
		});
		w.append(back);
		back.addEventListener('click', _ => this.el.emit('catway:page:back'));

		back.append(C('a-text', {
			'value': S(this, 'level'),
			'align': 'center',
			'position': '0 0.4 0',
			'color': '#666',
			...anim_enter_scale(),
		}));

		const skip = C('a-entity', {
			'g_button': { value: '>>', fontsize: 4, width: 0.25, circle: true },
			'position': '-1 -1.55 -1',
			...anim_enter_scale(),
		});
		w.append(skip);
		skip.addEventListener('click', _ => {
			S(this, { cat: vec4q(this.level.pillow) });
			this.el.emit('catway:play:win');
		});

		this.resetLevel();

		if (import.meta.env.DEV) {
			import('../dev/devtools.js').then(module => {
				module.graph_show(
					module.level_graph(this.level),
					this.level.pillow.p,
					this.level.pillow.d
				);
			});

			const hl = C('a-entity', {
				'g_walker': { ...this.level.cat, src: '#tex_f', h: 0.499, osc: 0 },
				'visible': false,
			});
			hl.addEventListener('loaded', _ => {
				C(hl.children[0], {
					'material': { color: '#fc0', opacity: 0.5 },
				});
			})
			w.append(hl);
			this.el.sceneEl.addEventListener('catway:hl', e => {
				if (e.detail != '') {
					C(hl, { 'visible': true, 'g_walker': vec4q(e.detail) });
				} else {
					C(hl, { 'visible': false });
				}
			})
		}
	},

	resetLevel: function() {
		S(this, { cat: vec4q(this.level.cat) });
	},

	on_face: function(e) {
		this.on_move(e.detail);
	},

	on_walk: function(e) {
		const cat_q = vec4q(S(this, 'cat'));
		const dir = reldir(cat_q.d, e.detail);
		const dest = this.level.move_walk(cat_q, dir);
		this.on_move(dest ? dest : this.level.move_orbit(cat_q, dir));
	},

	on_jump: function(e) {
		const cat_q = vec4q(S(this, 'cat'));
		const dir = reldir(cat_q.d, e.detail);
		const dest = this.level.move_jump(cat_q, dir);
		this.on_move(dest ? dest : this.level.move_sidejump(cat_q, dir));
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
