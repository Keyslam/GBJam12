import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { Trapdoor } from "../signals/trapsdoor";

export interface TrapdoorProps {
	x: number;
	y: number;
	signalId: number;
	key: number;
	flipped: boolean;
}

export class TrapdoorBuilder extends Builder<TrapdoorProps> {
	private image = love.graphics.newImage("assets/tiles.png");

	private closedSpriteLeft = new Sprite(this.image, {
		x: 60,
		y: 12,
		width: 12,
		height: 24,
		originX: 0,
		originY: 0,
	});

	private openSpriteLeft = new Sprite(this.image, {
		x: 60,
		y: 36,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	private closedSpriteRight = new Sprite(this.image, {
		x: 72,
		y: 12,
		width: 12,
		height: 24,
		originX: 12,
		originY: 0,
	});

	private openSpriteRight = new Sprite(this.image, {
		x: 72,
		y: 36,
		width: 12,
		height: 12,
		originX: 12,
		originY: 0,
	});

	public build(entity: Entity, props: TrapdoorProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(Trapdoor, new Trapdoor(entity, props.flipped ? this.closedSpriteRight : this.closedSpriteLeft, props.flipped ? this.openSpriteRight : this.openSpriteLeft, props.signalId, props.key));
	}
}
