import { Context } from "context";
import { Hitbox } from "core/hitbox";
import { Entity } from "./entity";
import { Solid } from "./solid";

export class Tile extends Entity {
	private solid: Solid;

	constructor(context: Context) {
		super(context);

		this.solid = new Solid(context, 0, 120, new Hitbox(0, 0, 100, 16));
	}

	public update(dt: number): void {}
	public draw(): void {
		love.graphics.rectangle("fill", 0 - 50, 120 - 8, 100, 16);
		this.solid.draw();
	}
}
