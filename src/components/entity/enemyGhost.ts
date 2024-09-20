import { Entity } from "../../core/entity";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite } from "../graphics/sprite";
import { EnemyGhostControls } from "../locomation/enemyGhostControls";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";

export function buildEnemyGhost(entity: Entity, x: number, y: number, flipped: boolean) {
	entity.addComponent(Position, new Position(entity, x, y));
	entity.addComponent(Velocity, new Velocity(entity, 0, 0));
	entity.addComponent(Actor, new Actor(entity, { top: 11, left: 8, bottom: 10, right: 8 }));
	const sprite = entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/evilGhost.png"), undefined, undefined, { x: 0, y: 48, width: 48, height: 48 }, flipped));
	sprite.flipX = true;
	entity.addComponent(
		AnimatedSprite,
		new AnimatedSprite(
			entity,
			{
				idle: createAnimation(0, 6, 48, 48, 0.1),
			},
			"idle",
		),
	);
	entity.addComponent(EnemyGhostControls, new EnemyGhostControls(entity));
}
