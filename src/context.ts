import { Tilemap } from "./components/map/tilemap";
import { BodyRegistry } from "./components/physics/bodyRegistry";
import { buildSplashScreen } from "./components/scenes/splashScreen";
import { Entity } from "./core/entity";
import { Input } from "./core/input";

export class Context {
	public rootEntity: Entity;

	private canvas = love.graphics.newCanvas(160, 144);

	public bodyRegistry = new BodyRegistry();
	public tilemap = new Tilemap();
	public input = new Input(this);

	constructor() {
		this.rootEntity = new Entity(this, undefined);
		// this.rootEntity.addChild(buildTestScreen);
		// this.rootEntity.addChild((entity) => {
		// 	entity.addComponent(Editor, new Editor(entity));
		// });
		this.rootEntity.addChild(buildSplashScreen);
	}

	public update(dt: number): void {
		this.input.update();

		this.rootEntity.preUpdate(dt);
		this.rootEntity.update(dt);
		this.rootEntity.postUpdate(dt);

		this.input.postUpdate();
	}

	public draw(): void {
		love.graphics.setCanvas(this.canvas);

		const [r, g, b, a] = love.math.colorFromBytes(17, 3, 17, 255);
		love.graphics.clear(r, g, b, a);

		love.graphics.setColor(1, 1, 1, 1);
		this.rootEntity.draw();

		love.graphics.setCanvas();

		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}

	public mousepressed(x: number, y: number, button: number): void {
		this.input.mousepressed(button);
	}

	public viewportToWorld(x: number, y: number): { x: number; y: number } {
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
