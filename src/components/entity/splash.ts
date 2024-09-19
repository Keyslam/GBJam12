import { Entity } from "../../core/entity";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite } from "../graphics/sprite";
import { SplashControls } from "../locomation/splashControls";
import { Position } from "../position";

export function buildSplash(entity: Entity) {
	const splashImage = love.graphics.newImage("assets/splash.png");

	entity.addComponent(Position, new Position(entity, 0, 0));
	entity.addComponent(Sprite, new Sprite(entity, splashImage));
	entity.addComponent(
		AnimatedSprite,
		new AnimatedSprite(
			entity,
			{
				"1": createAnimation(0, 9, 160, 144, 0.1, 0, 0),
				"2": createAnimation(1, 6, 160, 144, 0.08, 0, 0),
				"3": createAnimation(2, 2, 160, 144, 0.1, 0, 0),
				"4": createAnimation(3, 4, 160, 144, 0.06, 0, 0),
				"5": createAnimation(4, 1, 160, 144, 1, 0, 0),
			},
			"1",
		),
	);
	entity.addComponent(SplashControls, new SplashControls(entity));
}
