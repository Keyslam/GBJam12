import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Sprite, Viewport } from "../graphics/sprite";
import { Position } from "../position";

export class Tilerule extends Component {
	private position = this.inject(Position);
	private sprite = this.inject(Sprite);

	private viewports: Viewport[];

	constructor(entity: Entity, viewports: Viewport[]) {
		super(entity);

		this.viewports = viewports;

		this.context.tilemap.addTile(this, this.position.x, this.position.y);
	}

	public evaluate(top: Tilerule | undefined, left: Tilerule | undefined, bottom: Tilerule | undefined, right: Tilerule | undefined): void {
		const mask = (top ? 1 : 0) + (left ? 2 : 0) + (bottom ? 4 : 0) + (right ? 8 : 0);
		const viewport = this.viewports[mask];

		this.sprite.viewport = viewport;
		this.sprite.rebuildQuad();
	}
}
