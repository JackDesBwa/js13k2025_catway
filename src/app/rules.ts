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

export function pos2vec3(pos: Position) {
	return new THREE.Vector3(...pos.split(' ').map(Number));
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

	face(q0: OrientedPosition) {
		return this.cubes[q0.p][q0.d];
	}

	forEachFace(p0: Position, fct: (type: FaceType, dir: Direction, vec: any) => boolean|undefined, includeEmpties=false): void {
		for (const dir of allDirs) {
			const vec = dir2vec3(dir);
			const type = this.face(new OrientedPosition({ p: p0, d: dir }));
			if (!includeEmpties && type == FACE_EMPTY) continue;
			if (fct(type, dir, vec)) return;
		}
	}
}
