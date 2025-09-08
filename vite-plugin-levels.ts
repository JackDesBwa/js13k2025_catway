import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

const levelsDir = path.resolve(process.cwd(), 'src/data/')
const level_regex = /^level_.*\.json$/;

export function levels_files() {
	return fs
		.readdirSync(levelsDir)
		.filter(file => level_regex.test(file))
		.sort()
		.map(file => path.join(levelsDir, file));
}

export function levels_json() {
	const levels = levels_files().map(file => {
		const content = fs.readFileSync(file, 'utf-8')
		try {
			return JSON.parse(content)
		} catch (err) {
			console.warn(`Failed to parse ${file}: ${err}`)
			return null
		}
	});
	return levels.filter(Boolean);
}

export default function virtualLevels(): Plugin {
	const virtualModuleId = 'levels.json'
	const resolvedId = '\0' + virtualModuleId

	return {
		name: 'vite-plugin-virtual-levels',

		resolveId(id) {
			if (id === virtualModuleId) return resolvedId
		},

		load(id) {
			if (id === resolvedId) {
				levels_files().forEach(file => this.addWatchFile(file));
				return JSON.stringify(levels_json());
			}
		}
	}
}
