import { Image, Quad } from "love.graphics";

export interface Viewport {
	x: number;
	y: number;
	width: number;
	height: number;
	originX: number | undefined;
	originY: number | undefined;
}

export class Sprite {
	private image: Image;
	private quad: Quad | undefined;
	private isFlipped: boolean;
	private originX: number;
	private originY: number;

	constructor(image: Image, viewport: Viewport | undefined, isFlipped: boolean = false) {
		this.image = image;
		this.quad = viewport ? love.graphics.newQuad(viewport.x, viewport.y, viewport.width, viewport.height, image) : undefined;
		this.isFlipped = isFlipped;
		this.originX = viewport?.originX ?? (viewport?.width ? viewport.width / 2 : image.getWidth() / 2);
		this.originY = viewport?.originY ?? (viewport?.height ? viewport.height / 2 : image.getHeight() / 2);
	}

	public draw(x: number, y: number, flipX: boolean) {
		const sx = flipX === this.isFlipped ? 1 : -1;

		if (this.quad === undefined) {
			love.graphics.draw(this.image, x, y, 0, sx, 1, this.originX, this.originY);
		} else {
			love.graphics.draw(this.image, this.quad, x, y, 0, sx, 1, this.originX, this.originY);
		}
	}
}
