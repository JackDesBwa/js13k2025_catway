export function C(tag: string, props?: Record<string, string>, style?: Record<string, string|number>) {
	const el = typeof tag == 'string' ? document.createElement(tag) : tag;
	for (const [k, v] of Object.entries(props || {})) el.setAttribute(k, v);
	for (const [k, v] of Object.entries(style || {})) el.style.setProperty(k, '' + v);
	return el;
}
