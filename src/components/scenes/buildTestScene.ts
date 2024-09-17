import { Entity } from "../../core/entity";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite } from "../graphics/sprite";
import { PlayerGhostControls } from "../locomation/playerGhostControls";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";

export function buildTestScreen(entity: Entity) {
	entity.addChild((entity) => {
		entity.addComponent(Position, new Position(entity, 24, 24));
		entity.addComponent(Velocity, new Velocity(entity, 0, 0));
		entity.addComponent(Actor, new Actor(entity, { top: 6, left: 5, bottom: 15, right: 11 }));
		entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/ghostie.png"), { x: 0, y: 48, width: 48, height: 48 }));
		entity.addComponent(
			AnimatedSprite,
			new AnimatedSprite(
				entity,
				{
					spawn: createAnimation(0, 14, 48, 48, 0.1),
					idle: createAnimation(1, 4, 48, 48, 0.2),
				},
				"idle",
			),
		);
		entity.addComponent(PlayerGhostControls, new PlayerGhostControls(entity));
	});
}
