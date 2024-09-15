import { Context } from "context";
import { AnimatedSprite } from "../components/graphics/animatedSprite";
import { Animation } from "../components/graphics/animation";
import { Sprite, Viewport } from "../components/graphics/sprite";
import { PlayerControls } from "../components/locomation/playerControls";
import { Actor } from "../components/physics/actor";
import { Mass } from "../components/physics/mass";
import { Solid } from "../components/physics/solid";
import { Velocity } from "../components/physics/velocity";
import { Position } from "../components/position";
import { Runner } from "./runner";

const createAnimation = (row: number, frameCount: number, rowWidth: number, rowHeight: number, duration: number): Animation => {
	let x = 0;
	const y = row * rowHeight;

	const frames: Viewport[] = [];
	for (let i = 0; i < frameCount; i++) {
		const frame: Viewport = {
			x: x,
			y: y,
			width: rowWidth,
			height: rowHeight,
		};

		frames.push(frame);

		x += rowWidth;
	}

	return {
		frames: frames,
		frameDuration: duration,
	};
};

export class Game implements Runner {
	public run(): void {
		io.stdout.setvbuf("no");

		const [width, height] = love.window.getDesktopDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144)) - 2;

		love.window.setMode(scaleFactor * 160, scaleFactor * 144, {
			resizable: true,
		});

		love.graphics.setDefaultFilter("nearest", "nearest");

		const context = new Context();

		context.spawnEntity((entity) => {
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
			entity.addComponent(PlayerControls, new PlayerControls(entity));
		});

		for (let i = 0; i < 10; i++) {
			context.spawnEntity((entity) => {
				entity.addComponent(Position, new Position(entity, i * 12 + 6, 50));
				entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
				entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/tiles.png"), { x: 24, y: 0, width: 12, height: 12 }));
			});
		}

		for (let i = 5; i < 15; i++) {
			context.spawnEntity((entity) => {
				entity.addComponent(Position, new Position(entity, i * 12 + 6, 130));
				entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
				entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/tiles.png"), { x: 24, y: 0, width: 12, height: 12 }));
			});
		}

		love.update = (dt) => {
			context.update(dt);
		};

		love.draw = () => {
			context.draw();
		};
	}
}
