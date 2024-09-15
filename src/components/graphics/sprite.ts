import { Component } from "core/component";
import { Image, Quad } from "love.graphics";
import { Entity } from "../../core/entity";
import { Position } from "../position";

export interface Viewport {
	x: number;
	y: number;
	width: number;
	height: number;
}

export class Sprite extends Component {
	private position = this.inject(Position);

	public image: Image;
	public viewport: Viewport | undefined;
	public quad: Quad | undefined;
	public isFlipped: boolean;

	constructor(entity: Entity, image: Image, viewport: Viewport | undefined = undefined, isFlipped: boolean = false) {
		super(entity);

		this.image = image;
		this.viewport = viewport;
		this.isFlipped = isFlipped;

		this.rebuildQuad();
	}

	public override draw(): void {
		const sx = this.isFlipped ? -1 : 1;

		if (this.quad === undefined) {
			const ox = this.image.getWidth() / 2;
			const oy = this.image.getHeight() / 2;

			love.graphics.draw(this.image, this.position.x, this.position.y, 0, sx, 1, ox, oy);
		} else {
			const ox = this.quad.getViewport()[2] / 2;
			const oy = this.quad.getViewport()[3] / 2;

			love.graphics.draw(this.image, this.quad, this.position.x, this.position.y, 0, sx, 1, ox, oy);
		}
	}

	public rebuildQuad(): void {
		if (this.viewport === undefined) {
			this.quad = undefined;
			return;
		}

		this.quad = love.graphics.newQuad(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height, this.image);
	}
}
