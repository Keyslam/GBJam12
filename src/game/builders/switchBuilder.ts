import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { Switch } from "../signals/switch";

export interface SwitchProps {
	x: number;
	y: number;
	signalId: number;
}

export class SwitchBuilder extends Builder<SwitchProps> {
	private image = love.graphics.newImage("assets/tiles.png");

	private left = new Sprite(this.image, {
		x: 0,
		y: 71,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	private middle = new Sprite(this.image, {
		x: 12,
		y: 71,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	private right = new Sprite(this.image, {
		x: 24,
		y: 71,
		width: 12,
		height: 12,
		originX: 0,
		originY: 0,
	});

	public build(entity: Entity, props: SwitchProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(
			AnimatedSprite,
			new AnimatedSprite(
				entity,
				{
					initial: { frames: [{ sprite: this.left, duration: 0.1 }], playback: "freeze" },
					toggle_on: {
						frames: [
							{ sprite: this.middle, duration: 0.1 },
							{ sprite: this.right, duration: 0.1 },
						],
						playback: "freeze",
					},
					toggle_off: {
						frames: [
							{ sprite: this.middle, duration: 0.1 },
							{ sprite: this.left, duration: 0.1 },
						],
						playback: "freeze",
					},
				},
				"initial",
			),
		);
		entity.addComponent(Switch, new Switch(entity, props.signalId));
	}
}
