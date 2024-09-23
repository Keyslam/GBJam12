import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Animation, Frame } from "../rendering/animation";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export class SplashBuilder extends Builder<undefined> {
	private image = love.graphics.newImage("assets/splash.png");

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		const frames: Frame[] = [];

		for (let x = 0; x < 9; x++) {
			frames.push({
				sprite: new Sprite(this.image, {
					x: x * 160,
					y: 0 * 144,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
				duration: 0.1,
			});
		}

		for (let x = 0; x < 6; x++) {
			frames.push({
				sprite: new Sprite(this.image, {
					x: x * 160,
					y: 1 * 144,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
				duration: 0.08,
			});
		}

		for (let x = 0; x < 2; x++) {
			frames.push({
				sprite: new Sprite(this.image, {
					x: x * 160,
					y: 2 * 144,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
				duration: 0.1,
			});
		}

		for (let x = 0; x < 4; x++) {
			frames.push({
				sprite: new Sprite(this.image, {
					x: x * 160,
					y: 3 * 144,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
				duration: 0.06,
			});
		}

		frames.push({
			sprite: new Sprite(this.image, {
				x: 0 * 160,
				y: 4 * 144,
				width: 160,
				height: 144,
				originX: 0,
				originY: 0,
			}),
			duration: 0.1,
		});

		const animation: Animation = {
			frames: frames,
			playback: "freeze",
		};

		entity.addComponent(Position, new Position(entity, 0, 0));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(
			AnimatedSprite,
			new AnimatedSprite(
				entity,
				{
					play: animation,
				},
				"play",
			),
		);
	}
}
