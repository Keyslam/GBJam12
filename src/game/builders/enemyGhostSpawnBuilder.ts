import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { EnemyGhostSpawnController } from "../locomotion/enemyGhostSpawnController";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface EnemyGhostSpawnProps {
	x: number;
	y: number;
	flipped: boolean;
	playerBody: PlayerBodyControls;
}

export class EnemyGhostSpawnBuilder extends Builder<EnemyGhostSpawnProps> {
	private image = love.graphics.newImage("assets/evilghost.png");

	private animations: Record<string, Animation> = {
		spawn: this.createAnimation(2, 13, 0.1),
	};

	public build(entity: Entity, props: EnemyGhostSpawnProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, undefined, props.flipped));
		entity.addComponent(AnimatedSprite, new AnimatedSprite(entity, this.animations, "spawn"));
		entity.addComponent(EnemyGhostSpawnController, new EnemyGhostSpawnController(entity, props.playerBody));
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 0,
			originY: 19,
			cellWidth: 48,
			cellHeight: 48,
			flipped: true,
		});
	}
}
