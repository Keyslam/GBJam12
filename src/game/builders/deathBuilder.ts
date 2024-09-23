import { Builder } from "../../core/builder";
import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { LevelLoader } from "../levels/levelLoader";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

class Death extends Component {
	private input = this.scene.findComponent(Input);
	private levelLoader: LevelLoader;
	private name: string;

	constructor(entity: Entity, levelLoader: LevelLoader, name: string) {
		super(entity);

		this.levelLoader = levelLoader;
		this.name = name;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.input.buttonAState.isPressed) {
			this.levelLoader.load(this.name);
		}

		if (this.input.buttonBState.isPressed) {
			love.event.quit();
		}
	}
}

export class DeathBuilder extends Builder<{ levelLoader: LevelLoader; name: string }> {
	private image = love.graphics.newImage("assets/gameover.png");

	public build(entity: Entity, props: { levelLoader: LevelLoader; name: string }): void {
		entity.addComponent(Position, new Position(entity, 0, 0));
		entity.addComponent(
			SpriteRenderer,
			new SpriteRenderer(
				entity,
				new Sprite(this.image, {
					x: 0,
					y: 0,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
			),
		);
		entity.addComponent(Death, new Death(entity, props.levelLoader, props.name));
	}
}
