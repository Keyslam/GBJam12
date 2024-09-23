import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface FireworkProps {
	x: number;
	y: number;
}

export class FireworkBuilder extends Builder<FireworkProps> {
	private image = love.graphics.newImage("assets/ghostie.png");

	public build(entity: Entity, props: FireworkProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(
			AnimatedSprite,
			new AnimatedSprite(
				entity,
				{
					play: this.createAnimation(2, 12, 0.1, "loop"),
				},
				"play",
			),
		);
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 24,
			originY: 24,
			cellWidth: 48,
			cellHeight: 48,
			flipped: true,
		});
	}
}
