import { Scene } from "./core/scene";
import { Scheduler } from "./core/scheduler";
import { LevelLoaderBuilder } from "./game/builders/levelLoaderBuilder";
import { LevelLoader } from "./game/levels/levelLoader";
import { PlayerBodyControls } from "./game/locomotion/playerBodyControls";
import { Camera } from "./game/rendering/camera";
import { PostProcess } from "./game/rendering/postProcess";
import { SpriteRenderer } from "./game/rendering/spriteRendering";

export class Context {
	private canvas = love.graphics.newCanvas(160, 144);

	private scene: Scene;

	private levelLoader: LevelLoader;

	constructor() {
		this.scene = new Scene();

		this.scene.addEntity(new LevelLoaderBuilder(), undefined);
		this.levelLoader = this.scene.findComponent(LevelLoader);

		// this.levelLoader.load("Exit");
		this.levelLoader.load("Mousetrap");
	}

	public update(dt: number): void {
		if (this.levelLoader.loading) {
			this.scene.findChildByComponent(LevelLoader).update(dt);
			this.scene.findChildByComponent(Scheduler).update(dt);
			this.scene.findChildByComponent(PostProcess).postUpdate(dt);
		} else {
			this.scene.update(dt);
			this.scene.postUpdate(dt);
		}

		this.levelLoader.handleReload();
		6;
		this.levelLoader.handleLoad();
	}

	public draw(): void {
		const postProcess = this.scene.findComponent(PostProcess);
		const camera = this.scene.findComponent(Camera);

		love.graphics.setCanvas(this.canvas);

		camera.attach();
		postProcess.attach();

		love.graphics.setColor(1, 1, 1, 1);

		this.scene.draw();

		const player = this.scene.tryFindChildByComponent(PlayerBodyControls);
		if (player) {
			player.getComponent(SpriteRenderer).draw();
		}

		postProcess.detach();
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
