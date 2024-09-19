import { Entity } from "../../core/entity";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite } from "../graphics/sprite";
import { PlayerBodyControls } from "../locomation/playerBodyControls";
import { Actor } from "../physics/actor";
import { Mass } from "../physics/mass";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";

export function buildPlayerBody(entity: Entity, x: number, y: number) {
	entity.addComponent(Position, new Position(entity, x, y));
	entity.addComponent(Velocity, new Velocity(entity, 0, 0));
	entity.addComponent(Mass, new Mass(entity));
	entity.addComponent(Actor, new Actor(entity, { top: 10, left: 8, bottom: 12, right: 8 }));
	entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/spoopyboy.png"), undefined, undefined, { x: 0, y: 0, width: 48, height: 48 }));
	entity.addComponent(
		AnimatedSprite,
		new AnimatedSprite(
			entity,
			{
				idle: createAnimation(0, 10, 48, 48, 0.2, 25, 24),
				run: createAnimation(1, 4, 48, 48, 0.1, 25, 24),
				jump: createAnimation(3, 3, 48, 48, 0.1, 25, 24),
				fall: createAnimation(4, 3, 48, 48, 0.1, 25, 24),
				inanimate: createAnimation(5, 1, 48, 48, 0.1, 25, 24),
				zombie_walk: createAnimation(6, 4, 48, 48, 0.15, 25, 24),
				die: createAnimation(7, 5, 48, 48, 0.1, 25, 24),
				possess: createAnimation(8, 2, 48, 48, 0.1, 25, 24),
				zombie_fall: createAnimation(9, 3, 48, 48, 0.1, 25, 24),
				zombie_trip: createAnimation(10, 2, 48, 48, 0.1, 25, 24),
				zombie_getup: createAnimation(11, 2, 48, 48, 0.1, 25, 24),
				zombie_tripped: createAnimation(12, 1, 48, 48, 1, 25, 24),
			},
			"idle",
		),
	);
	entity.addComponent(PlayerBodyControls, new PlayerBodyControls(entity));
}
