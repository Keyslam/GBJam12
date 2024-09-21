import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { EnemyGhostControls } from "../locomotion/enemyGhostControls";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Body } from "../physics/body";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface EnemyGhostProps {
	x: number;
	y: number;
	flipped: boolean;
	playerBody: PlayerBodyControls;
}

export class EnemyGhostBuilder extends Builder<EnemyGhostProps> {
	private image = love.graphics.newImage("assets/evilghost.png");

	private animations: Record<string, Animation> = {
		idle: this.createAnimation(0, 6, 0.1),
		move: this.createAnimation(1, 6, 0.1),
	};

	public build(entity: Entity, props: EnemyGhostProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(Velocity, new Velocity(entity));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, undefined, props.flipped));
		entity.addComponent(
			Body,
			new Body(entity, {
				top: -10,
				bottom: 10,
				left: -7,
				right: 7,
			}),
		);
		entity.addComponent(AnimatedSprite, new AnimatedSprite(entity, this.animations, "idle"));
		entity.addComponent(EnemyGhostControls, new EnemyGhostControls(entity, props.playerBody));
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
