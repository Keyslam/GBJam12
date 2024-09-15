import { Tilerule } from "./tilerule";

export class Tilemap {
	private tiles: Tilerule[][];

	constructor() {
		this.tiles = [];
	}

	public addTile(tile: Tilerule, x: number, y: number): void {
		if (x % 12 !== 0) {
			throw new Error("x must be grid aligned");
		}

		if (y % 12 !== 0) {
			throw new Error("y must be grid aligned");
		}

		const column = this.tiles[x] ?? [];
		this.tiles[x] = column;

		this.tiles[x][y] = tile;

		this.evaluate(x, y);
		this.evaluate(x - 1, y);
		this.evaluate(x + 1, y);
		this.evaluate(x, y - 1);
		this.evaluate(x, y + 1);
	}

	public getTile(x: number, y: number): Tilerule | undefined {
		const column = this.tiles[x];
		if (column === undefined) {
			return undefined;
		}

		return column[y];
	}

	public evaluate(x: number, y: number): void {
		const tile = this.getTile(x, y);
		if (tile === undefined) {
			return;
		}

		const top = this.getTile(x, y - 1);
		const left = this.getTile(x - 1, y);
		const bottom = this.getTile(x, y + 1);
		const right = this.getTile(x + 1, y);

		tile.evaluate(top, left, bottom, right);
	}
}
