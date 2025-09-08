import { C, S } from '../app/utils.ts'
import { SoundFx } from '../app/sound.ts'
import level1 from '../data/level_01.json'

AFRAME.registerSystem('a_switcher', {
	init: function() {
		this.added = [];
		this.sfx = false;
		this.inner = C('a-entity', { id: 'worldgrab' });
		this.el.append(this.inner);
		this.el.addEventListener('loaded', this.on_loaded.bind(this));
	},

	on_loaded: function() {
		this.el.camera.focus = 2;
		S(this, 'stereofx', v => C(this.el, { stereofx: v }));
		S(this, 'page', this.on_page.bind(this));
		S(this).setLevel(level1);
		const sound_on = _ => {
			this.sfx = new SoundFx();
			S(this, 'music_on', v => {
				if (v) {
					this.sfx.playLoop('1', this.sfx.MUSIC1);
					this.sfx.playLoop('2', this.sfx.MUSIC2);
				} else {
					this.sfx.stopLoop('1');
					this.sfx.stopLoop('2');
				}
			})
		};
		this.el.addEventListener('pointerdown', sound_on, { once: true });
		this.el.addEventListener('keydown', sound_on, { once: true });
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
			const play = s => S(this, 'sfx_on') && this.sfx && this.sfx.play(s);
			p.addEventListener('catway:page:back', _ => S(this, { page: 'hello' }));
			p.addEventListener('catway:play:move', _ => play(this.sfx.MOVE));
			p.addEventListener('catway:play:cantmove', _ => play(this.sfx.CANT_MOVE));
			p.addEventListener('catway:play:win', _ => {
				play(this.sfx.WIN);
				S(this, { page: 'hello' });
			});
			p.addEventListener('catway:play:die', _ => {
				play(this.sfx.DIE);
				setTimeout(_ => p.emit('resetLevel'), 500);
			});
		}
	}
});
