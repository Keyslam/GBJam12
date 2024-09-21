import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { PlayerGhostSpawnController } from "../locomotion/playerGhostSpawnController";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface PlayerGhostSpawnProps {
	x: number;
	y: number;
	flipped: boolean;
}

export class PlayerGhostSpawnBuiler extends Builder<PlayerGhostSpawnProps> {
	private image = love.graphics.newImage("assets/ghostie.png");

	private animations: Record<string, Animation> = {
		spawn: this.createAnimation(0, 15, 0.1),
	};

	public build(entity: Entity, props: PlayerGhostSpawnProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity, undefined, props.flipped));
		entity.addComponent(AnimatedSprite, new AnimatedSprite(entity, this.animations, "spawn"));
		entity.addComponent(PlayerGhostSpawnController, new PlayerGhostSpawnController(entity));
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 0,
			originY: 28,
			cellWidth: 48,
			cellHeight: 48,
			flipped: false,
		});
	}
}
