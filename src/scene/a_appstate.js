import { C } from '../app/utils.ts'
import { Level } from '../app/rules.ts'

AFRAME.registerComponent('appstate', {
	sceneOnly: true,
	schema: {
		page: { default: 'hello' },
		stereofx: { default: '0' },
	},
	init: function () {
		this.leveldata = null;
		const saved = localStorage.getItem('js13k_catway');
		saved && C(this.el, { appstate: saved });
	},
	update(o) {
		for (const [k, v] of Object.entries(this.data)) if (o[k] != this.data[k]) {
			if (import.meta.env.DEV) console.log('catway:' + k, v);
			this.el.emit('catway:' + k, v);
		}
		localStorage.setItem('js13k_catway', AFRAME.utils.styleParser.stringify(this.data));
	},
	setLevel: function(lvl) {
		this.leveldata = new Level(lvl);
		if (import.meta.env.DEV) console.log('catway:leveldata', this.leveldata);
		this.el.emit('catway:leveldata', this.leveldata);
	},
});
