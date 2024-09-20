declare interface LdtkEntity {
	x: number;
	y: number;
	id: string;
	width: number;
	height: number;
	visible: boolean;
	props: Record<string, unknown>;
}

declare interface LdtkLayer {
	x: number;
	y: number;
	width: number;
	height: number;
	gridSize: number;
	tiles: {
		a: number;
		f: number;
		px: number;
		py: number;
		t: number;
	}[];
	intGrid: number[] | undefined;
	id: string;
	draw: () => void;
}

declare interface LdtkLevel {
	id: string;
	worldX: number;
	worldY: number;
	width: number;
	height: number;
	props: Record<string, unknown[]>;
}

declare namespace ldtk {
	/** @noSelf **/
	export let onEntity: (entity: LdtkEntity) => void;
	/** @noSelf **/
	export let onLayer: (layer: LdtkLayer) => void;
	/** @noSelf **/
	export let onLevelLoaded: (level: LdtkLevel) => void;
	/** @noSelf **/
	export let onLevelCreated: (level: LdtkLevel) => void;

	export function load(path: string): void;
	export function level(name: string): void;
	export function next(): void;
	export function reload(): void;
}
