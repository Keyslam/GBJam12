import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Body } from "../physics/body";
import { Mass } from "../physics/mass";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface PlayerProps {
	x: number;
	y: number;
}

export class PlayerBuilder extends Builder<PlayerProps> {
	private image = love.graphics.newImage("assets/spoopyboy.png");

	private animations: Record<string, Animation> = {
		idle: this.createAnimation(0, 10, 0.2),
		run: this.createAnimation(1, 4, 0.1),
		jump: this.createAnimation(3, 3, 0.1),
		fall: this.createAnimation(4, 3, 0.1),

		inanimate: this.createAnimation(5, 1, 1),
		die: this.createAnimation(7, 5, 0.1),
		possess: this.createAnimation(8, 2, 0.1),

		possessed_walk: this.createAnimation(6, 4, 0.15),
		possessed_fall: this.createAnimation(9, 3, 0.1),
		possessed_trip: this.createAnimation(10, 2, 0.1, "freeze"),
		possessed_get_up: this.createAnimation(11, 2, 0.1),
	};

	public build(entity: Entity, props: PlayerProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(Velocity, new Velocity(entity));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(Mass, new Mass(entity));
		entity.addComponent(
			Body,
			new Body(entity, {
				top: -10,
				bottom: 12,
				left: -8,
				right: 8,
			}),
		);
		entity.addComponent(AnimatedSprite, new AnimatedSprite(entity, this.animations, "idle"));
		entity.addComponent(PlayerBodyControls, new PlayerBodyControls(entity));
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 25,
			originY: 24,
			cellWidth: 48,
			cellHeight: 48,
			flipped: false,
		});
	}
}
