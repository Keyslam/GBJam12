import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface ControlProps {
	x: number;
	y: number;
	kind: number;
}

export class ControlBuilder extends Builder<ControlProps> {
	private image = love.graphics.newImage("assets/controls.png");

	private moveSprite = new Sprite(this.image, {
		x: 0,
		y: 0,
		width: 128,
		height: 25,
		originX: 0,
		originY: 0,
	});

	private jumpSprite = new Sprite(this.image, {
		x: 0,
		y: 25,
		width: 128,
		height: 25,
		originX: 0,
		originY: 0,
	});

	private shiftSprite = new Sprite(this.image, {
		x: 0,
		y: 50,
		width: 128,
		height: 25,
		originX: 0,
		originY: 0,
	});

	public build(entity: Entity, props: ControlProps): void {
		const sprite: Sprite = ((props.kind === 1 && this.moveSprite) || (props.kind === 2 && this.jumpSprite) || (props.kind === 3 && this.shiftSprite)) as Sprite;

		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, sprite));
	}
}
