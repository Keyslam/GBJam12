import { BodyRegistry } from "./components/physics/bodyRegistry";
import { Entity } from "./core/entity";

export class Context {
	private entities: Entity[] = [];

	private canvas = love.graphics.newCanvas(160, 144);

	public bodyRegistry = new BodyRegistry();

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

		love.graphics.setCanvas();

		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}
}
