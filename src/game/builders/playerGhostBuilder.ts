import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { PlayerGhostControls } from "../locomotion/playerGhostControls";
import { Body } from "../physics/body";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface PlayerGhostProps {
	x: number;
	y: number;
	flipped: boolean;
}

export class PlayerGhostBuilder extends Builder<PlayerGhostProps> {
	private image = love.graphics.newImage("assets/ghostie.png");

	private animations: Record<string, Animation> = {
		idle: this.createAnimation(1, 4, 0.2),
		possess: this.createAnimation(2, 11, 0.1),
	};

	public build(entity: Entity, props: PlayerGhostProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(Velocity, new Velocity(entity));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, undefined, props.flipped));
		entity.addComponent(
			Body,
			new Body(entity, {
				top: -10,
				bottom: 11,
				left: -8,
				right: 8,
			}),
		);
		entity.addComponent(AnimatedSprite, new AnimatedSprite(entity, this.animations, "idle"));
		entity.addComponent(PlayerGhostControls, new PlayerGhostControls(entity));
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 27,
			originY: 28,
			cellWidth: 48,
			cellHeight: 48,
			flipped: false,
		});
	}
}
