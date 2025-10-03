import { C, S, anim_enter_scale } from '../app/utils.js'
import { StereoscopicEffects } from 'threejs-stereoscopiceffects';

AFRAME.registerComponent('page_3dmode', {
	init: async function() {
		const sceneEl = this.el.sceneEl;
		sceneEl.systems.a_switcher.reset_view();
	
		if (sceneEl.is('ar-mode') || sceneEl.is('vr-mode')) sceneEl.exitVR();

		const btn = (to, value, position, fct) => {
			const el = C('a-entity', {
				'g_button': { value, width: 0.4, height: 0.035, fontsize: 0.5 },
				'position': position,
			});
			to.append(el);
			el.addEventListener('click', fct);
			return el;
		}

		const change_3dmode = m => {
			if (m == 'vr') this.el.sceneEl.enterVR();
			else if (m == 'ar') this.el.sceneEl.enterAR();
			else S(this, { 'stereofx': m });
			this.el.emit('catway:page:next');
		};

		const lst = StereoscopicEffects.effectsList();
		[lst[3], lst[4]] = [lst[4], lst[3]];
		const xrmodes = [];
		if (navigator.xr) {
			if (await navigator.xr.isSessionSupported('immersive-vr')) 
				xrmodes.push({ name: 'Virtual reality', value: 'vr' });
			if (await navigator.xr.isSessionSupported('immersive-ar')) 
				xrmodes.push({ name: 'Augmented reality', value: 'ar' });
		}
		if (xrmodes.length) lst.unshift({ category: 'WebXR', elements: xrmodes });
		let y = 0.35, col = -1;

		const g_modes = C('a-entity', {});
		const g_modes_simplified = C('a-entity', {});
		this.el.append(g_modes_simplified);

		this.el.append(C('a-text', {
			value: 'Choose how to display 3D',
			align: 'center',
			position: [0, y + 0.08, 0.1].join(' '),
			width: 1,
		}));
		this.el.append(C('a-text', {
			value: 'Depending on your device. If unsure, "Single view left" is a fallback working on all screens.',
			'wrap-count': 110,
			align: 'center',
			position: [0, y + 0.035, 0.1].join(' '),
			width: 1,
		}));
		lst.forEach(c => {
			if (c.category[0] == 'I') {
				const back = C('a-entity', {
					'g_button': { value: '<', width: 0.04, circle: true },
					'position': [-0.22, y - 0.05, 0.1].join(' '),
					...anim_enter_scale(),
				});
				back.addEventListener('click', _ => this.el.emit('catway:page:back'));
				this.el.append(back);

				col += 2;
				y = 0.35;
			}
			y -= 0.01;
			g_modes.append(C('a-text', {
				value: c.category,
				position: [col * 0.22 - 0.19, y, 0.1].join(' '),
				width: 0.5,
			}));
			y -= 0.035;
			c.elements.forEach(m => {
				btn(g_modes, m.name, [col * 0.22, y, 0.1].join(' '), _ => {
					change_3dmode(m.value);
				});
				y -= 0.04;
			})
		});

		const simplified_modes = [
			...xrmodes,
			{ name: "HSBS (for 3D TV & co)", value: 4 },
			{ name: "Anaglyph red/cyan glasses", value: 20 },
			{ name: "2D projection (Single view left)", value: 0 },
		];

		y = 0.34;
		g_modes_simplified.append(C('a-text', {
			value: "Common 3D modes",
			position: [-0.19, y, 0.1].join(' '),
			width: 0.5,
		}));
		y -= 0.035;
		simplified_modes.forEach(m => {
				btn(g_modes_simplified, m.name, [0, y, 0.1].join(' '), _ => {
					change_3dmode(m.value);
				});
				y -= 0.04;
		});
		y -= 0.04;
		btn(g_modes_simplified, "All modes", [0, y, 0.1].join(' '), _ => {
			this.el.removeChild(g_modes_simplified);
			this.el.append(g_modes);
		});
	},
});
