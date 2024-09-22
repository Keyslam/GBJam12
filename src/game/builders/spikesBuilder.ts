import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Spikes } from "../behaviours/spikes";
import { Position } from "../common/position";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface SpikesProps {
	x: number;
	y: number;
}

export class SpikesBuilder extends Builder<SpikesProps> {
	private image = love.graphics.newImage("assets/tiles.png");

	private sprite = new Sprite(this.image, {
		x: 36,
		y: 72,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	public build(entity: Entity, props: SpikesProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, this.sprite));
		entity.addComponent(Spikes, new Spikes(entity));
	}
}
