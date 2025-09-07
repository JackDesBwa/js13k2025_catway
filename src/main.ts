import './style.css'
import logo from '/catway.svg'

const img = document.createElement('img');
Object.assign(img, {
	width: 960,
	height: 960,
	src: logo,
});
document.body.append(img);
