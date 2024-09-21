import { Scene } from "./core/scene";
import { CameraBuilder } from "./game/builders/cameraBuilder";
import { InputBuilder } from "./game/builders/inputBuilder";
import { LevelLoaderBuilder } from "./game/builders/levelLoaderBuilder";
import { SchedulerBuilder } from "./game/builders/schedulerBuilder";
import { TilemapBuilder } from "./game/builders/tilemapBuilder";
import { LevelLoader } from "./game/levels/levelLoader";
import { Camera } from "./game/rendering/camera";

export class Context {
	private canvas = love.graphics.newCanvas(160, 144);

	private scene: Scene;
	private camera: Camera;

	constructor() {
		this.scene = new Scene();

		this.scene.addEntity(new SchedulerBuilder(), undefined);
		this.scene.addEntity(new InputBuilder(), undefined);
		this.scene.addEntity(new TilemapBuilder(), undefined);
		this.scene.addEntity(new LevelLoaderBuilder(), undefined);
		this.camera = this.scene
			.addEntity(new CameraBuilder(), {
				x: 80,
				y: 72,
			})
			.getComponent(Camera);

		const levelLoader = this.scene.findComponent(LevelLoader);
		levelLoader.load("Level_0");
	}

	public update(dt: number): void {
		this.scene.update(dt);
		this.scene.postUpdate(dt);
	}

	public draw(): void {
		love.graphics.setCanvas(this.canvas);

		const [r, g, b, a] = love.math.colorFromBytes(17, 3, 17, 255);
		love.graphics.clear(r, g, b, a);

		love.graphics.setColor(1, 1, 1, 1);

		this.camera.attach();
		this.scene.draw();
		this.camera.detach();

		this.scene.drawScreen();

		love.graphics.setCanvas();

		const [width, height] = love.graphics.getDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144));

		const offsetX = (width - 160 * scaleFactor) / 2;
		const offsetY = (height - 144 * scaleFactor) / 2;

		love.graphics.draw(this.canvas, offsetX, offsetY, 0, scaleFactor, scaleFactor);
	}

	public mousepressed(x: number, y: number, button: number): void {
		// this.input.mousepressed(button);
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
