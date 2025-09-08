import { defineConfig } from 'vite';
import pluginExternal from 'vite-plugin-external';
import pluginAnalyzer from 'vite-bundle-analyzer';
import pluginLevels from './vite-plugin-levels.ts';
import path from 'path';
import fs from 'fs';

const conf = defineConfig({
	plugins: [
		pluginExternal({
			externals: {
				three: 'THREE'
			},
		}),
		pluginLevels(),
	],
});

const useAnalyzer = 'VITE_ANALYZE' in process.env;
console.log('Using VITE_ANALYZE:', useAnalyzer);
if (useAnalyzer) conf.plugins.push(pluginAnalyzer({ 'open': true }));

// Example command to create certificates:
//     mkcert -key-file key.pem -cert-file cert.pem localhost
const pem = ['key', 'cert'].map(s => path.resolve(__dirname, s + '.pem'));
const useHttps = pem.reduce((acc, file) => acc && fs.existsSync(file), true);
console.log('Using HTTPS:', useHttps);
if (useHttps) {
	Object.assign(conf, defineConfig({
		server: {
			https: {
				key: pem[0],
				cert: pem[1],
			},
		}
	}));
}

export default conf;
