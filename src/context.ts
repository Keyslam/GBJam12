import { Scene } from "./core/scene";
import { LevelLoaderBuilder } from "./game/builders/levelLoaderBuilder";
import { LevelLoader } from "./game/levels/levelLoader";
import { Camera } from "./game/rendering/camera";
import { PostProcess } from "./game/rendering/postProcess";

export class Context {
	private canvas = love.graphics.newCanvas(160, 144);

	private scene: Scene;

	private levelLoader: LevelLoader;

	constructor() {
		this.scene = new Scene();

		this.scene.addEntity(new LevelLoaderBuilder(), undefined);
		this.levelLoader = this.scene.findComponent(LevelLoader);

		this.levelLoader.load("Level_0");
	}

	public update(dt: number): void {
		this.scene.update(dt);
		this.scene.postUpdate(dt);

		this.levelLoader.handleReload();
	}

	public draw(): void {
		const postProcess = this.scene.findComponent(PostProcess);
		const camera = this.scene.findComponent(Camera);

		love.graphics.setCanvas(this.canvas);

		camera.attach();
		postProcess.attach();

		love.graphics.setColor(1, 1, 1, 1);

		this.scene.draw();
		postProcess.detatch();
		camera.detach();

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
