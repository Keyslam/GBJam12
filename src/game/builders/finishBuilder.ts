import { Builder } from "../../core/builder";
import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

class Finish extends Component {
	private input = this.scene.findComponent(Input);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.input.buttonAState.isPressed || this.input.buttonBState.isPressed || this.input.buttonStartState.isPressed) {
			love.event.quit();
		}
	}
}

export class FinishBuilder extends Builder<undefined> {
	private image = love.graphics.newImage("assets/win.png");

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
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
		entity.addComponent(Finish, new Finish(entity));
	}
}
