import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite } from "../graphics/sprite";
import { Camera } from "../locomation/camera";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";
import { buildPlayerGhost } from "./playerGhost";

class PlayerGhostSpawnScript extends Component {
	private position = this.inject(Position);
	private sprite = this.inject(Sprite);

	private time = 0;

	public override update(dt: number): void {
		this.time += dt;

		if (this.time >= 1.0) {
			this.entity.destroy();

			if (this.sprite.isFlipped) {
				const ghost = this.parent?.addChild((e) => buildPlayerGhost(e, this.position.x - 27, this.position.y + 28, true));
				this.parent!.findChild(Camera)!.getComponent(Camera).target = ghost;
			} else {
				const ghost = this.parent?.addChild((e) => buildPlayerGhost(e, this.position.x + 27, this.position.y + 28, false));
				this.parent!.findChild(Camera)!.getComponent(Camera).target = ghost;
			}
		}
	}
}

export function buildPlayerGhostSpawn(entity: Entity, x: number, y: number, flipped: boolean) {
	entity.addComponent(Position, new Position(entity, x, y));
	entity.addComponent(Velocity, new Velocity(entity, 0, 0));
	entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/ghostie.png"), undefined, undefined, { x: 0, y: 48, width: 48, height: 48 }, flipped));
	entity.addComponent(
		AnimatedSprite,
		new AnimatedSprite(
			entity,
			{
				spawn: createAnimation(0, 14, 48, 48, 0.1, 0, 0),
			},
			"spawn",
		),
	);
	entity.addComponent(PlayerGhostSpawnScript, new PlayerGhostSpawnScript(entity));
}
