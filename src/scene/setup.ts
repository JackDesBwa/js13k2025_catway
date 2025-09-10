import { C } from '../app/utils.ts'

const scene = C('a-scene', {
	'xr-mode-ui': 'enabled: false',
	'appstate': '',
});
if (import.meta.env.DEV) scene.setAttribute('stats', '');
document.body.appendChild(scene);

scene.append(C('a-entity', { // Camera
	'camera': 'fov: 30',
	'position': '0 1 1',
	'fov-controls': '',
	'orbit-controls': 'anchor: 0 1 -0.6',
}));

scene.append(C('a-entity', { // Cursor
	'cursor': 'rayOrigin:mouse',
	'cursor3d': '',
	'raycaster': 'objects: .i',
}));

scene.append(C('a-entity', { // Laser Left
	'laser-controls': 'hand: left',
	'raycaster': 'objects: .i',
	'grabworld': '',
	'i_vrcontroller': '',
}));

scene.append(C('a-entity', { // Laser Right
	'laser-controls': 'hand: right',
	'raycaster': 'objects: .i',
	'grabworld': '',
	'i_vrcontroller': '',
}));

const assets = C('a-assets');
scene.appendChild(assets);

assets.append(C('img', { // Cat texture
	'id': 'tex_c',
	'src': '/catway.svg',
}));

assets.append(C('img', { // Pillow texture
	'id': 'tex_p',
	'src': '/pillow.svg',
}));

if (import.meta.env.DEV) {
	if (!Number(localStorage.getItem('hide_console'))) {
		document.head.append(C('script', {
			src: 'https://cdn.jsdelivr.net/gh/kylebakerio/a-console/a-console.min.js'
		}));
		scene.append(C('a-plane', {
			'console': 'skipIntroAnimation: true',
			'width': '0.40',
			'height': '0.60',
			'position': '-0.5 0.5 -0.4',
			'rotation': '0 45 0'
		}));
	}
}
