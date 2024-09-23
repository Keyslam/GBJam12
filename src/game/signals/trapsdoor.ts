import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Tilemap } from "../physics/tilemap";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { SignalStore } from "./signalStore";

export class Trapdoor extends Component {
	private tilemap = this.scene.findComponent(Tilemap);
	private signalStore = this.scene.findComponent(SignalStore);

	private spriteRenderer = this.inject(SpriteRenderer);

	private closedSprite: Sprite;
	private openSprite: Sprite;
	private signalId: number;
	private key: number;
	private invert: boolean;

	constructor(entity: Entity, closedSprite: Sprite, openSprite: Sprite, signalId: number, key: number, invert: boolean = false) {
		super(entity);

		this.closedSprite = closedSprite;
		this.openSprite = openSprite;
		this.signalId = signalId;
		this.key = key;
		this.invert = invert;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		const open = this.signalStore.isSignalSet(this.signalId) !== this.invert;
		this.spriteRenderer.sprite = open ? this.openSprite : this.closedSprite;
		this.tilemap.getTile(this.key).state = open ? "open" : "solid";
	}
}
