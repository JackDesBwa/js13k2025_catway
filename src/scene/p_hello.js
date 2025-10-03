import { C, S, anim_enter_scale, anim_enter_opacity } from '../app/utils.js'

AFRAME.registerComponent('page_hello', {
	init: function() {
		this.el.sceneEl.systems.a_switcher.reset_view();
		this.el.append(C('a-plane', {
			'width': '0.4',
			'height': '0.4',
			'position': '0 0.25 0.1',
			'material': 'side: double; transparent: true; alphaTest: 0.5; src: #tex_c',
			'animation': 'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear',
		}));

		const btn = (value, position, fct) => {
			const el = C('a-entity', {
				'g_button': { value, height: 0.08, width: 0.3 },
				'position': position,
			});
			this.el.append(el);
			el.addEventListener('click', fct);
			return el;
		};

		C(btn('Start', '0 -0.03 0.1', _ => this.el.emit('catway:page:next')), {
			g_button: { circle: true, width: 0.08 },
			...anim_enter_scale(),
		});
		btn('3D mode', '0 -0.2 0.1', _ => this.el.emit('catway:page:3D'));

		const btnMusic = btn('', '0 -0.29 0.1', _ => { S(this, { 'music_on': !S(this, 'music_on') }); });
		S(this, 'music_on', v => { C(btnMusic, { 'g_button': {
			value: 'Music is O' + (v ? 'N' : 'FF')
		} }); });

		const btnSfx = btn('', '0 -0.38 0.1', _ => { S(this, { 'sfx_on': !S(this, 'sfx_on') }); });
		S(this, 'sfx_on', v => { C(btnSfx, { 'g_button': {
			value: 'SFX are O' + (v ? 'N' : 'FF')
		} }); });
	},
});
