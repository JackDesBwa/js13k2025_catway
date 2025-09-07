function C(tag: string, props?: Record<string, string>, style?: Record<string, string|number>) {
	const el = typeof tag == 'string' ? document.createElement(tag) : tag;
	for (const [k, v] of Object.entries(props || {})) el.setAttribute(k, v);
	for (const [k, v] of Object.entries(style || {})) el.style.setProperty(k, '' + v);
	return el;
}

const scene = C('a-scene', {
	'xr-mode-ui': 'XRMode: xr',
});
if (import.meta.env.DEV) scene.setAttribute('stats', '');
document.body.appendChild(scene);

scene.append(C('a-entity', { // Camera
	'camera': 'fov: 30',
	'position': '0 1 1',
	'look-controls': '',
	'wasd-controls': '',
}));

const assets = C('a-assets');
scene.appendChild(assets);

assets.append(C('img', { // Cat texture
	'id': 'tex_c',
	'src': '/catway.svg',
}));

scene.append(C('a-plane', { // Logo
	'position': '0 1 -0.6',
	'width': '0.4',
	'height': '0.4',
	'material': 'side: double; transparent: true; src: #tex_c',
	'animation': 'property: rotation; to: 0 360 0; loop: true; dur: 3000; easing: linear',
}));
