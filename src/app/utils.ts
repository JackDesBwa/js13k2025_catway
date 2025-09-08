export function C(tag: string, props?: Record<string, string>, style?: Record<string, string|number>) {
	const el = typeof tag == 'string' ? document.createElement(tag) : tag;
	for (const [k, v] of Object.entries(props || {})) el.setAttribute(k, v);
	for (const [k, v] of Object.entries(style || {})) el.style.setProperty(k, '' + v);
	return el;
}

export function S(cmp: any, n: string, fct: (state: any)=>void|undefined) {
	const g = cmp.el.sceneEl.components.appstate;
	if (typeof n == 'object') {
		cmp.el.sceneEl.setAttribute('appstate', n);
		return;
	}
	const v = n ? g.data[n] : g;
	if (fct) {
		cmp.el.sceneEl.addEventListener('catway:' + n, (e: CustomEvent) => {
			fct(e.detail);
		});
		fct(v);
	}
	return v;
}
