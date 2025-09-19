import svg_box from '../img/box.svg?raw'
import svg_cat from '../img/catway.svg?raw'
import svg_pillow from '../img/pillow.svg?raw'
import { C } from '../app/utils.ts'

const scene = C('a-scene', {
	'xr-mode-ui': 'enabled: false',
	'appstate': '',
});
if (import.meta.env.DEV) scene.setAttribute('stats', '');
(document.querySelector('#scene') || document.body).appendChild(scene);

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
	'laser2-controls': 'hand: left',
}));

scene.append(C('a-entity', { // Laser Right
	'laser2-controls': 'hand: right',
}));

const assets = C('a-assets');
scene.appendChild(assets);

const svg = (s: string) => 'data:image/svg+xml,' + encodeURIComponent(s);
(document.querySelector('link') as HTMLLinkElement).href = svg(svg_cat);
assets.append(C('img', { // Cat texture
	'id': 'tex_c',
	'src': svg(svg_cat),
}));

assets.append(C('img', { // Pillow texture
	'id': 'tex_p',
	'src': svg(svg_pillow),
}));

assets.append(C('img', { // Box face texture
	'id': 'tex_f',
	'src': svg(svg_box),
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
