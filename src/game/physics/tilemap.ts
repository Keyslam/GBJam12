import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { BoundingBox } from "./boundingBox";

export interface Tile {
	boundingBox: BoundingBox;
	state: "solid" | "one-way" | "open";
}

export class Tilemap extends Component {
	private tileSize: number = 12;

	private width: number = 0;
	private height: number = 0;
	private tiles: Tile[] = [];

	private checkedPoints: Record<number, number> = {};

	constructor(entity: Entity) {
		super(entity);
	}

	public override draw() {
		const draw = false;
		if (draw) {
			love.graphics.push("all");

			for (const key in this.checkedPoints) {
				const point = this.keyToCoord(tonumber(key)!);
				const status = this.checkedPoints[key];

				if (status === 1) {
					love.graphics.setColor(0, 1, 0, 1);
				} else if (status === 2) {
					love.graphics.setColor(0, 0, 1, 1);
				} else {
					love.graphics.setColor(1, 0, 0, 1);
				}

				love.graphics.points(point.x, point.y);
			}

			love.graphics.pop();

			if (love.keyboard.isDown("p")) {
				this.checkedPoints = {};
			}
		}

		const drawColliders = false;
		if (drawColliders) {
			love.graphics.push("all");
			love.graphics.setColor(1, 0, 0, 0.5);

			const max = this.coordToKey(this.width, this.height);
			for (let k = 0; k < max; k++) {
				const tile = this.tiles[k];
				if (tile === undefined) {
					continue;
				}

				const coords = this.keyToCoord(tonumber(k)!);
				coords.x *= 12;
				coords.y *= 12;

				const x = coords.x + tile.boundingBox.left;
				const y = coords.y + tile.boundingBox.top;
				const width = coords.x + tile.boundingBox.right - x;
				const height = coords.y + tile.boundingBox.bottom - y;

				love.graphics.rectangle("line", x + 0.5, y + 0.5, width - 1, height - 1);
			}

			love.graphics.pop();
		}
	}

	public load(width: number, height: number, tiles: Tile[]): void {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
	}

	public getTile(key: number): Tile {
		return this.tiles[key];
	}

	// public isSolid(x: number, y: number): boolean {
	// 	const tileX = Math.floor(x / this.tileSize);
	// 	const tileY = Math.floor(y / this.tileSize);

	// 	if (tileX < 0 || tileY < 0 || tileX >= this.width || tileY >= this.height) {
	// 		return true;
	// 	}

	// 	const key = tileX + tileY * this.width;
	// 	return this.tiles[key]?.state === "solid";
	// }

	public query(boundingBox: BoundingBox, offsetX: number, offsetY: number, ignoreOneWay: boolean = false): boolean {
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
				const key = this.coordToKey(tileX, tileY);
				const tile = this.tiles[key];

				if (tile === undefined) {
					continue;
				}

				if (tile.state === "open") {
					continue;
				}

				if (tile.state === "one-way" && ignoreOneWay) {
					continue;
				}

				const tileTop = tileY * this.tileSize + tile.boundingBox.top - 1;
				if (tile.state === "one-way") {
					if (newBottom - 1 > tileTop) {
						continue;
					}
				}

				const tileLeft = tileX * this.tileSize + tile.boundingBox.left - 1;
				const tileBottom = tileTop + tile.boundingBox.bottom + 1;
				const tileRight = tileLeft + tile.boundingBox.right + 1;

				if (newLeft < tileRight && newRight > tileLeft && newTop < tileBottom && newBottom > tileTop) {
					return false;
				}
			}
		}

		return true;
	}

	public findPath(startX: number, startY: number, goalX: number, goalY: number, boundingBox: BoundingBox): { x: number; y: number }[] | undefined {
		const path = luastar.find(
			this.width * 2,
			this.height * 2,
			{ x: Math.round(startX / 6), y: Math.round(startY / 6) },
			{ x: Math.round(goalX / 6), y: Math.round(goalY / 6) },
			(x: number, y: number) => {
				const open = this.query(boundingBox, x * 6, y * 6, true);
				const key = this.coordToKey(x * 6, y * 6);

				this.checkedPoints[key] = open ? 1 : 0;

				return open;
			},
			false,
			false,
		);

		if (path === false) {
			return undefined;
		}

		for (const point of path) {
			const key = this.coordToKey(point.x * 6, point.y * 6);
			this.checkedPoints[key] = 2;
		}

		return path;
	}

	private coordToKey(x: number, y: number): number {
		return x + y * this.width;
	}

	private keyToCoord(key: number): { x: number; y: number } {
		const y = Math.floor(key / this.width);
		const x = key - y * this.width;
		return { x, y };
	}
}
