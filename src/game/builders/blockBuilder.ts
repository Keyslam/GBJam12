import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { Trapdoor } from "../signals/trapsdoor";

export interface BlockProps {
	x: number;
	y: number;
	signalId: number;
	key: number;
	invert: boolean;
}

export class BlockBuilder extends Builder<BlockProps> {
	private image = love.graphics.newImage("assets/tiles.png");

	private closedSprite = new Sprite(this.image, {
		x: 60,
		y: 0,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	private openSprite = new Sprite(this.image, {
		x: 72,
		y: 0,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	public build(entity: Entity, props: BlockProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(Trapdoor, new Trapdoor(entity, this.closedSprite, this.openSprite, props.signalId, props.key, !props.invert));
	}
}
