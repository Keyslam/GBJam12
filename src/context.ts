import { Actor } from "entities/actor";
import { Entity } from "entities/entity";
import { Solid } from "entities/solid";

export class Context {
	private entities: Entity[] = [];

	private actors: Actor[] = [];
	private solids: Solid[] = [];

	private canvas = love.graphics.newCanvas(160, 144);

	public add(entity: Entity): void {
		this.entities.push(entity);
	}

	public registerActor(actor: Actor): void {
		this.actors.push(actor);
	}

	public registerSolid(solid: Solid): void {
		this.solids.push(solid);
	}

	public getAllActors(): Actor[] {
		return this.actors;
	}

	public getAllSolids(): Solid[] {
		return this.solids;
	}

	public update(dt: number): void {
		for (const entity of this.entities) {
			entity.update(dt);
		}

		this.entities = this.entities.filter((e) => !e.isDead);
	}

	public draw(): void {
		love.graphics.setCanvas(this.canvas);
		love.graphics.clear(0, 0, 0, 0);

		love.graphics.setColor(1, 1, 1, 1);
		for (const entity of this.entities) {
			entity.draw();
		}

		love.graphics.setCanvas();

		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}
}
