import { Entity } from "../../core/entity";
import { Sprite, Viewport } from "../graphics/sprite";
import { Tilerule } from "../map/tilerule";
import { Solid } from "../physics/solid";
import { Position } from "../position";

export function buildTile(entity: Entity, gridX: number, gridY: number) {
	const tilesSprite = love.graphics.newImage("assets/tiles.png");
	const tileViewports: Viewport[] = [
		{ x: 36, y: 36, width: 12, height: 12 },
		{ x: 36, y: 24, width: 12, height: 12 },
		{ x: 24, y: 36, width: 12, height: 12 },
		{ x: 24, y: 24, width: 12, height: 12 },
		{ x: 36, y: 0, width: 12, height: 12 },
		{ x: 36, y: 12, width: 12, height: 12 },
		{ x: 24, y: 0, width: 12, height: 12 },
		{ x: 24, y: 12, width: 12, height: 12 },
		{ x: 0, y: 36, width: 12, height: 12 },
		{ x: 0, y: 24, width: 12, height: 12 },
		{ x: 12, y: 36, width: 12, height: 12 },
		{ x: 12, y: 24, width: 12, height: 12 },
		{ x: 0, y: 0, width: 12, height: 12 },
		{ x: 0, y: 12, width: 12, height: 12 },
		{ x: 12, y: 0, width: 12, height: 12 },
		{ x: 12, y: 12, width: 12, height: 12 },
	];

	entity.addComponent(Position, new Position(entity, gridX * 12 + 6, gridY * 12 + 6));
	entity.addComponent(Sprite, new Sprite(entity, tilesSprite, undefined, undefined, { x: 36, y: 36, width: 12, height: 12 }));
	entity.addComponent(Tilerule, new Tilerule(entity, tileViewports));
	entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
}
