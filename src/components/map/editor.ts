import { Component } from "../../core/component";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { createAnimation } from "../graphics/animation";
import { Sprite, Viewport } from "../graphics/sprite";
import { PlayerBodyControls } from "../locomation/playerBodyControls";
import { Actor } from "../physics/actor";
import { Mass } from "../physics/mass";
import { Solid } from "../physics/solid";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";
import { Tilerule } from "./tilerule";

export class Editor extends Component {
	private tilesSprite = love.graphics.newImage("assets/tiles.png");
	private tileViewports: Viewport[] = [
		{ x: 36, y: 36, width: 12, height: 12 },
		{ x: 36, y: 24, width: 12, height: 12 },
		{ x: 24, y: 36, width: 12, height: 12 },
		{ x: 24, y: 24, width: 12, height: 12 },
		{ x: 36, y: 0, width: 12, height: 12 },
		{ x: 36, y: 12, width: 12, height: 12 },
		{ x: 24, y: 0, width: 12, height: 12 },
		{ x: 24, y: 12, width: 12, height: 12 },
		{ x: 0, y: 36, width: 12, height: 12 },
		{ x: 0, y: 24, width: 12, height: 12 },
		{ x: 12, y: 36, width: 12, height: 12 },
		{ x: 12, y: 24, width: 12, height: 12 },
		{ x: 0, y: 0, width: 12, height: 12 },
		{ x: 0, y: 12, width: 12, height: 12 },
		{ x: 12, y: 0, width: 12, height: 12 },
		{ x: 12, y: 12, width: 12, height: 12 },
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.context.input.leftButtonClicked) {
			const gridX = this.context.input.getMouseGridX();
			const gridY = this.context.input.getMouseGridY();

			if (love.keyboard.isDown("lctrl")) {
				this.parent?.addChild((entity) => {
					entity.addComponent(Position, new Position(entity, 24, 24));
					entity.addComponent(Velocity, new Velocity(entity, 0, 0));
					entity.addComponent(Mass, new Mass(entity));
					entity.addComponent(Actor, new Actor(entity, { top: 10, left: 9, bottom: 12, right: 9 }));
					entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/spoopyboy.png"), { x: 0, y: 0, width: 48, height: 48 }));
					entity.addComponent(
						AnimatedSprite,
						new AnimatedSprite(
							entity,
							{
								idle: createAnimation(0, 10, 48, 48, 0.2),
								run: createAnimation(1, 4, 48, 48, 0.1),
								jump: createAnimation(3, 3, 48, 48, 0.1),
								fall: createAnimation(4, 3, 48, 48, 0.1),
								inanimate: createAnimation(5, 1, 48, 48, 0.1),
								zombie_walk: createAnimation(6, 4, 48, 48, 0.15),
								die: createAnimation(7, 5, 48, 48, 0.1),
								possess: createAnimation(8, 2, 48, 48, 0.1),
							},
							"idle",
						),
					);
					entity.addComponent(PlayerBodyControls, new PlayerBodyControls(entity));
				});
			} else {
				this.parent?.addChild((entity) => {
					entity.addComponent(Position, new Position(entity, gridX * 12 + 6, gridY * 12 + 6));
					entity.addComponent(Sprite, new Sprite(entity, this.tilesSprite, { x: 36, y: 36, width: 12, height: 12 }));
					entity.addComponent(Tilerule, new Tilerule(entity, this.tileViewports));
					entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
				});
			}
		}
	}

	public override draw(): void {
		love.graphics.push("all");
		love.graphics.setColor(1, 1, 1, 1);

		const gridX = this.context.input.getMouseGridX();
		const gridY = this.context.input.getMouseGridY();

		love.graphics.rectangle("line", gridX * 12 + 0.5, gridY * 12 + 0.5, 12 - 1, 12 - 1);
		love.graphics.pop();
	}
}
