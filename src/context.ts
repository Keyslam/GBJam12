export class Context {
	private canvas = love.graphics.newCanvas(160, 144);

	private layer: LdtkLayer | undefined;

	constructor() {
		ldtk.onLevelLoaded = (level) => {
			print(level.id);
		};

		ldtk.onLayer = (layer) => {
			print(layer.id);
			this.layer = layer;
		};

		ldtk.load("assets/maps/test.ldtk");
		ldtk.level("Level_0");
	}

	public update(dt: number): void {}

	public draw(): void {
		love.graphics.setCanvas(this.canvas);

		const [r, g, b, a] = love.math.colorFromBytes(17, 3, 17, 255);
		love.graphics.clear(r, g, b, a);

		love.graphics.setColor(1, 1, 1, 1);
		// this.rootEntity.preDraw();
		// this.rootEntity.draw();
		// this.rootEntity.postDraw();

		this.layer?.draw();

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
