import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const tipsDir = path.resolve(process.cwd(), 'src/data/')
const tip_regex = /^tips_.*\.json$/;

export function tips_files() {
	return fs
		.readdirSync(tipsDir)
		.filter(file => tip_regex.test(file))
		.sort()
		.map(file => path.join(tipsDir, file));
}

export function tips_json() {
	const tips = tips_files().map(file => {
		const content = fs.readFileSync(file, 'utf-8')
		const n = Number(path.basename(file).replace('tips_', '').replace('.json', ''));
		try {
			return { [n]: JSON.parse(content) };
		} catch (err) {
			console.warn(`Failed to parse ${file}: ${err}`);
			return null;
		}
	});
	const ret = {};
	tips.filter(Boolean).forEach(o => Object.assign(ret, o));
	return ret;
}

export default function virtualTips(): Plugin {
	const virtualModuleId = 'tips.json'
	const resolvedId = '\0' + virtualModuleId

	return {
		name: 'vite-plugin-virtual-tips',

		resolveId(id) {
			if (id === virtualModuleId) return resolvedId
		},

		load(id) {
			if (id === resolvedId) {
				tips_files().forEach(file => this.addWatchFile(file));
				return JSON.stringify(tips_json());
			}
		}
	}
}
