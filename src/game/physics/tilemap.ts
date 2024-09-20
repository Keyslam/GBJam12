import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { BoundingBox } from "./boundingBox";

export class Tilemap extends Component {
	private tileSize: number = 12;

	private width: number = 0;
	private height: number = 0;
	private tiles: boolean[] = [];

	private checkedPoints: Record<number, number> = {};

	constructor(entity: Entity) {
		super(entity);
	}

	public override draw() {
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

	public findPath(startX: number, startY: number, goalX: number, goalY: number, boundingBox: BoundingBox): { x: number; y: number }[] | undefined {
		const path = luastar.find(
			this.width * 2,
			this.height * 2,
			{ x: Math.round(startX / 6), y: Math.round(startY / 6) },
			{ x: Math.round(goalX / 6), y: Math.round(goalY / 6) },
			(x: number, y: number) => {
				const open = this.query(boundingBox, x * 6, y * 6);
				const key = this.coordToKey(x * 6, y * 6);

				this.checkedPoints[key] = open ? 1 : 0;

				return open;
			},
			true,
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
		return x + y * 1e7;
	}

	private keyToCoord(key: number): { x: number; y: number } {
		const y = Math.floor(key / 1e7);
		const x = key - y * 1e7;
		return { x, y };
	}
}
