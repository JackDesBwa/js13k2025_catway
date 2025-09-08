declare var THREE: any;
type Position = `${number} ${number} ${number}`;
type Direction = 0 | 1 | 2 | 3 | 4 | 5;
type FaceType = 'p' | 'x' | '-';

export class OrientedPosition {
	p: Position;
	d: Direction;
	constructor(q: {p: Position, d: Direction}) {
		this.p = q.p;
		this.d = q.d;
	}
	equals(o: OrientedPosition): boolean {
		return this.p == o.p && this.d == o.d;
	}
}

export const DIR_XP: Direction = 0,
             DIR_YP: Direction = 1,
             DIR_ZP: Direction = 2,
             DIR_XM: Direction = 3,
             DIR_YM: Direction = 4,
             DIR_ZM: Direction = 5,
             allDirs: Direction[] = [DIR_XP, DIR_YP, DIR_ZP, DIR_XM, DIR_YM, DIR_ZM];

export const FACE_PLATFORM: FaceType = 'p',
             FACE_KILL: FaceType = 'x',
             FACE_EMPTY: FaceType = '-';

export const cubeColors = {
	[FACE_PLATFORM]: '#6a0',
	[FACE_KILL]: '#60a',
};

export function dir2vec3(dir: Direction) {
	const coords = [
		[1,0,0], [0,1,0], [0,0,1],
		[-1,0,0], [0,-1,0], [0,0,-1]
	];
	return new THREE.Vector3(...coords[dir]);
}

export function dir2name(dir: Direction): string {
	return ['XP', 'YP', 'ZP', 'XM', 'YM', 'ZM'][dir];
}

export function dirInv(dir: Direction): Direction {
	return ((dir + 3) % 6) as Direction;
}

export function dirAligned(dir0: Direction, dir: Direction): boolean {
	return dir == dir0 || dir == dirInv(dir0);
}

export function pos2vec3(pos: Position) {
	return new THREE.Vector3(...pos.split(' ').map(Number));
}

function o(p:Position, d:Direction) {
	return new OrientedPosition({ p, d })
}

export class Level {
	cat: OrientedPosition;
	pillow: OrientedPosition;
	size: [number, number, number];
	cubes: Record<Position, FaceType[]>;

	constructor(w: any) {
		this.cat = new OrientedPosition(w.cat);
		this.pillow = new OrientedPosition(w.pillow);
		this.cubes = w.cubes;

		this.size = Object.keys(w.cubes || {}).reduce((m, k) => {
			const c = k.split(' ').map(Number);
			return [
				Math.max(m[0], c[0]),
				Math.max(m[1], c[1]),
				Math.max(m[2], c[2]),
			]
		}, [0, 0, 0]);
	}

	vec3_inworld(v: {x: number, y: number, z:number}): boolean {
		const s = this.size;
		return v.x >= 0 && v.y >= 0 && v.z >= 0 &&
			v.x <= s[0] && v.y <= s[1] && v.z <= s[2];
	}

	next(p0: Position, dir: Direction, n=1): Position|undefined {
		const pos = pos2vec3(p0);
		const d = dir2vec3(dir).multiplyScalar(n);
		pos.add(d);
		if (this.vec3_inworld(pos))
			return `${pos.x} ${pos.y} ${pos.z}`;
	}

	face(q0: OrientedPosition) {
		return this.cubes[q0.p][q0.d];
	}

	isValidFace(q0: OrientedPosition, start=false): boolean {
		const w = this;
		if (!(q0.p in w.cubes)) return false;
		if ((w.next(q0.p, q0.d) as Position) in w.cubes) return false;
		if (w.face(q0) == FACE_EMPTY) return false;
		if (start && w.face(q0) != FACE_PLATFORM) return false;
		return true;
	}

	die(q0: OrientedPosition): boolean {
		return !this.isValidFace(q0, true);
	}

	forEachFace(p0: Position, fct: (type: FaceType, dir: Direction, vec: any) => boolean|undefined, includeEmpties=false): void {
		for (const dir of allDirs) {
			const vec = dir2vec3(dir);
			const type = this.face(new OrientedPosition({ p: p0, d: dir }));
			if (!includeEmpties && type == FACE_EMPTY) continue;
			if (fct(type, dir, vec)) return;
		}
	}

	forEachPositions(p0: Position, dir: Direction, fct: (pname: Position) => boolean|undefined): Position|undefined {
		const pos = pos2vec3(p0);
		const d = dir2vec3(dir);
		pos.add(d);
		while (this.vec3_inworld(pos)) {
			const pname = `${pos.x} ${pos.y} ${pos.z}` as Position;
			if (fct(pname)) return pname;
			pos.add(d);
		}
	}

	forEachMove(q0: OrientedPosition, fct: (dest: OrientedPosition, move_index: string) => boolean|undefined) {
		const w = this;
		const moves = [w.move_orbit, w.move_walk, w.move_jump, w.move_sidejump];
		for (const dir of allDirs) {
			for (const i in moves) {
				const dest = moves[i].bind(w)(q0, dir);
				if (dest) fct(dest, i);
			}
		}
	}

	move_orbit(q0: OrientedPosition, dir: Direction): OrientedPosition|undefined {
		const w = this;
		if (!w.isValidFace(q0, true)) return;
		if (dirAligned(q0.d, dir)) return;
		const q = o(q0.p, dir);
		if (!w.isValidFace(q)) return;
		return q;
	}

	move_walk(q0: OrientedPosition, dir: Direction): OrientedPosition|undefined {
		const w = this;
		if (!w.isValidFace(q0, true)) return;
		const nextcube = w.next(q0.p, dir);
		if (!nextcube) return;
		const q = o(nextcube, q0.d);
		if (!w.isValidFace(q)) return;
		return q;
	}

	move_jump(q0: OrientedPosition, dir: Direction): OrientedPosition|undefined {
		const w = this;
		if (!w.isValidFace(q0, true)) return;
		if (dir != q0.d) return;

		let ret: OrientedPosition|undefined = undefined;
		w.forEachPositions(q0.p, dir, pname => {
			if (pname in w.cubes) {
				if (w.cubes[pname][dirInv(dir)] != FACE_EMPTY) {
					ret = o(pname, dirInv(dir));
					return true;
				} else if (w.cubes[pname][dir] != FACE_EMPTY) {
					if (import.meta.env.DEV) console.error("Back face reachable!", pname, dir);
					return true;
				}
			}
		});
		return ret;
	}

	move_sidejump(q0: OrientedPosition, dir: Direction): OrientedPosition|undefined {
		const w = this;
		if (!w.isValidFace(q0, true)) return;
		if (dirAligned(q0.d, dir)) return;

		const catcube = w.next(q0.p, q0.d);
		let ret: OrientedPosition|undefined = undefined;
		if (catcube) w.forEachPositions(catcube, dir, pname => {
			if (pname in w.cubes) {
				if (w.cubes[pname][dirInv(dir)] != FACE_EMPTY) {
					ret = o(pname, dirInv(dir));
					return true;
				} else if (w.cubes[pname][dir] != FACE_EMPTY) {
					if (import.meta.env.DEV) console.error("Back face reachable!", pname, dir);
					return true;
				}
			}
		});
		return ret;
	}
}
