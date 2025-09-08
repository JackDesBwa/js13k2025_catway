import { C } from '../app/utils.js'
import {
	OrientedPosition,
	dir2name,
	allDirs,
	cubeColors,
	FACE_KILL,
} from "../app/rules.ts"

import { Sigma } from 'sigma';
import { Graph } from 'graphology';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import shortestPath from 'graphology-shortest-path';

export function level_graph(lvl) {
	const graph = new Graph();
	const addNode = (n, p) => {
		graph.addNode(n, {
			...p,
			'label': n,
			'x': Number(n.split(' ')[0]) + Math.random()/10,
			'y': Number(n.split(' ')[1]) + Math.random()/10,
			'size': 10,
		});
	};
	const colors = {
		'0': '#0a0',
		'1': '#ccc',
		'2': '#00a',
		'3': '#a00',
	}
	for (const p0 of Object.keys(lvl.cubes)) {
		for (const dir0 of allDirs) {
			lvl.forEachMove(new OrientedPosition({ p: p0, d: dir0 }), (dest, move) => {
				const a = p0 + ' ' + dir2name(dir0),
				      b = dest.p + ' ' + dir2name(dest.d);
				const c = (p, d) => {
					if (p == lvl.cat.p && d == lvl.cat.d) return '#0a0';
					if (p == lvl.pillow.p && d == lvl.pillow.d) return '#a00';
					if (lvl.die(new OrientedPosition({ p, d }))) return cubeColors[FACE_KILL];
					return '#ccc';
				};
				if (!graph.hasNode(a)) addNode(a, { color: c(p0, dir0) });
				if (!graph.hasNode(b)) addNode(b, { color: c(dest.p, dest.d) });

				graph.addDirectedEdge(a, b, {
					type: 'arrow',
					color: colors[move],
					size: 5,
				});
			});
		}
	}
	const settings = forceAtlas2.inferSettings(graph);
	const layout = new FA2Layout(graph, { settings: { ...settings,
		adjustSizes: true,
	}});
	layout.start();
	setTimeout(() => {
		layout.stop();
	}, 2000);

	return graph;
}

function getShortestPath(graph, source, target) {
  return shortestPath.dijkstra.bidirectional(graph, source, target) || [];
}

export function graph_show(graph, dest_p, dest_d) {
	const dest = dest_p + ' ' + dir2name(dest_d);
	let sigmaContainer = document.getElementById('sigma');
	if (!sigmaContainer) {
		sigmaContainer = C('div', { 'id': 'sigma' });
		const sigmaStyle = C('style');
		sigmaStyle.innerText = `
			#sigma:hover { transform: translateY(-5px) }
			#sigma {
				position: absolute;
				top: 0;
				width: 100vw;
				height: 100vh;
				background: #fff;
				z-index: 10001;
				transition: transform 600ms;
				transform: translate(0, calc(5px - 100%));
			}
		`;
		document.head.append(sigmaStyle);
		document.body.append(sigmaContainer);
	}
	sigmaContainer.sigma?.kill();
	sigmaContainer.innerText = '';

	const sigma = sigmaContainer.sigma = new Sigma(graph, sigmaContainer, {
		renderEdgeLabels: true,
		edgeReducer: (_edge, data) => {
			if (data.highlighted) {
				return {
					...data,
					color: '#ffcc00',
					zIndex: 10001
				};
			}
			return data;
		}
	});
	sigma.on('enterNode', ({node}) => {
		const path = getShortestPath(graph, node, dest);

		for (let i = 0; i < path.length - 1; i++) {
			const source = path[i];
			const target = path[i + 1];

			const edge1 = graph.edge(source, target);
			if (edge1) graph.setEdgeAttribute(edge1, 'highlighted', true);
			const edge2 = graph.edge(target, source);
			if (edge2) graph.setEdgeAttribute(edge2, 'highlighted', true);
			graph.setNodeAttribute(source, 'highlighted', true);
		}

		sigma.refresh();
	});

	sigma.on('leaveNode', () => {
		graph.forEachNode(n => graph.removeNodeAttribute(n, 'highlighted'));
		graph.forEachEdge(e => graph.removeEdgeAttribute(e, 'highlighted'));
		sigma.refresh();
	});
}
