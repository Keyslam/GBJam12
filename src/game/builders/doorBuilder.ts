import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Door } from "../behaviours/door";
import { Position } from "../common/position";
import { LevelLoader } from "../levels/levelLoader";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface DoorProps {
	x: number;
	y: number;
	level: string;
	levelLoader: LevelLoader;
	visible: boolean;
}

export class DoorBuilder extends Builder<DoorProps> {
	private image = love.graphics.newImage("assets/tiles.png");

	private sprite = new Sprite(this.image, {
		x: 0,
		y: 156,
		width: 24,
		height: 24,
		originX: 0,
		originY: 0,
	});

	public build(entity: Entity, props: DoorProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		if (props.visible) {
			entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, this.sprite));
		}
		entity.addComponent(Door, new Door(entity, props.level, props.levelLoader));
	}
}
