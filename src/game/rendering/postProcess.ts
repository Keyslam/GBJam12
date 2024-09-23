import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
import { Input } from "../input/input";

export class PostProcess extends Component {
	private input = this.scene.findComponent(Input);
	private scheduler = this.scene.findComponent(Scheduler);

	private shader = love.graphics.newShader("assets/shader.glsl");
	private palettes = [love.graphics.newImage("assets/gbpals.png"), love.graphics.newImage("assets/gbpals_1.png"), love.graphics.newImage("assets/gbpals_2.png"), love.graphics.newImage("assets/gbpals_3.png")];
	private palettesImageData = love.image.newImageData("assets/gbpals.png");

	public paletteIndex = 0;
	public paletteOffset = 3;

	private backgroundColors: { r: number; g: number; b: number }[] = [];

	constructor(entity: Entity) {
		super(entity);

		for (let i = 0; i < 8; i++) {
			const pixel = this.palettesImageData.getPixel(0, i * 16 + 8);
			this.backgroundColors[i] = {
				r: pixel[0],
				g: pixel[1],
				b: pixel[2],
			};
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override postUpdate(dt: number): void {
		this.shader.send("palettes", this.palettes[this.paletteOffset]);
		if (this.input.buttonSelectState.isPressed) {
			this.nextPalette();
		}
	}

	public attach(): void {
		love.graphics.push("all");
		const backgroundColor = this.backgroundColors[this.paletteIndex];
		love.graphics.clear(backgroundColor.r, backgroundColor.g, backgroundColor.b);
		love.graphics.setShader(this.shader);
		this.shader.send("pal", this.paletteIndex);
	}

	public detach(): void {
		love.graphics.pop();
	}

	public nextPalette(): void {
		this.paletteIndex = (this.paletteIndex + 1) % 8;
	}

	public async fadeOut(): Promise<void> {
		for (let i = 0; i < 4; i++) {
			this.paletteOffset = i;
			await this.scheduler.waitForSeconds(0.1);
		}
	}

	public async fadeIn(): Promise<void> {
		for (let i = 3; i >= 0; i--) {
			this.paletteOffset = i;
			await this.scheduler.waitForSeconds(0.1);
		}
	}
}
