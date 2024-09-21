import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Input } from "../input/input";

export class PostProcess extends Component {
	private input = this.scene.findComponent(Input);

	private shader = love.graphics.newShader("assets/shader.glsl");
	private palettes = love.graphics.newImage("assets/gbpals.png");
	private palettesImageData = love.image.newImageData("assets/gbpals.png");

	private paletteIndex = 0;

	private backgroundColors: { r: number; g: number; b: number }[] = [];

	constructor(entity: Entity) {
		super(entity);

		this.shader.send("palettes", this.palettes);

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
	public override update(dt: number): void {
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

	public detatch(): void {
		love.graphics.pop();
	}

	public nextPalette(): void {
		this.paletteIndex = (this.paletteIndex + 1) % 8;
	}
}
