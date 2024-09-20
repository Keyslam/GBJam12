import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { BoundingBox } from "./boundingBox";

export class Tilemap extends Component {
	private tileSize: number = 12;

	private width: number = 0;
	private height: number = 0;
	private tiles: boolean[] = [];

	constructor(entity: Entity) {
		super(entity);
	}

	public load(width: number, height: number, tiles: boolean[]): void {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
	}

	public isSolid(x: number, y: number): boolean {
		const tileX = Math.floor(x / this.tileSize);
		const tileY = Math.floor(y / this.tileSize);

		if (tileX < 0 || tileY < 0 || tileX >= this.width || tileY >= this.height) {
			return true;
		}

		const key = tileX + tileY * this.width;
		return this.tiles[key];
	}

	public query(boundingBox: BoundingBox, offsetX: number, offsetY: number): boolean {
		const newTop = offsetY + boundingBox.top;
		const newLeft = offsetX + boundingBox.left;
		const newBottom = offsetY + boundingBox.bottom - 1;
		const newRight = offsetX + boundingBox.right - 1;

		const startTileX = Math.floor(newLeft / this.tileSize);
		const endTileX = Math.floor(newRight / this.tileSize);
		const startTileY = Math.floor(newTop / this.tileSize);
		const endTileY = Math.floor(newBottom / this.tileSize);

		for (let tileY = startTileY; tileY <= endTileY; tileY++) {
			for (let tileX = startTileX; tileX <= endTileX; tileX++) {
				const tilePixelX = tileX * this.tileSize;
				const tilePixelY = tileY * this.tileSize;

				if (this.isSolid(tilePixelX, tilePixelY)) {
					return false;
				}
			}
		}

		return true;
	}
}
