import { AnimatedSprite } from "./components/graphics/animatedSprite";
import { Animation } from "./components/graphics/animation";
import { Sprite, Viewport } from "./components/graphics/sprite";
import { PlayerControls } from "./components/locomation/playerControls";
import { Tilemap } from "./components/map/tilemap";
import { Tilerule } from "./components/map/tilerule";
import { Actor } from "./components/physics/actor";
import { BodyRegistry } from "./components/physics/bodyRegistry";
import { Mass } from "./components/physics/mass";
import { Solid } from "./components/physics/solid";
import { Velocity } from "./components/physics/velocity";
import { Position } from "./components/position";
import { Entity } from "./core/entity";

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

export class Context {
	private entities: Entity[] = [];

	private canvas = love.graphics.newCanvas(160, 144);

	public bodyRegistry = new BodyRegistry();
	public tilemap = new Tilemap();

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

	public spawnEntity(builder: (entity: Entity) => void): Entity {
		const entity = new Entity(this);
		this.entities.push(entity);

		builder(entity);

		return entity;
	}

	public update(dt: number): void {
		for (const entity of this.entities) {
			entity.update(dt);
		}

		this.entities = this.entities.filter((e) => !e.isDead);
	}

	public draw(): void {
		love.graphics.setCanvas(this.canvas);
		const [r, g, b, a] = love.math.colorFromBytes(17, 3, 17, 255);
		love.graphics.clear(r, g, b, a);

		love.graphics.setColor(1, 1, 1, 1);
		for (const entity of this.entities) {
			entity.draw();
		}

		{
			love.graphics.push("all");
			love.graphics.setColor(1, 1, 1, 1);
			const [x, y] = love.mouse.getPosition();
			const worldPosition = this.viewportToWorld(x, y);
			const gridPosition = { x: Math.floor(worldPosition.x / 12), y: Math.floor(worldPosition.y / 12) };
			love.graphics.rectangle("line", gridPosition.x * 12 + 0.5, gridPosition.y * 12 + 0.5, 12 - 1, 12 - 1);
			love.graphics.pop();
		}

		love.graphics.setCanvas();

		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}

	public mousepressed(x: number, y: number): void {
		const worldPosition = this.viewportToWorld(x, y);
		const gridPosition = { x: Math.floor(worldPosition.x / 12), y: Math.floor(worldPosition.y / 12) };

		if (love.keyboard.isDown("lctrl")) {
			this.spawnEntity((entity) => {
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
		} else {
			this.spawnEntity((entity) => {
				entity.addComponent(Position, new Position(entity, gridPosition.x * 12 + 6, gridPosition.y * 12 + 6));
				entity.addComponent(Sprite, new Sprite(entity, this.tilesSprite, { x: 36, y: 36, width: 12, height: 12 }));
				entity.addComponent(Tilerule, new Tilerule(entity, this.tileViewports));
				entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
			});
		}
	}

	private viewportToWorld(x: number, y: number): { x: number; y: number } {
		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		return {
			x: Math.floor(x / scaleFactor) - offsetX,
			y: Math.floor(y / scaleFactor) - offsetY,
		};
	}
}
