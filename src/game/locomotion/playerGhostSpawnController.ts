import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
import { PlayerGhostBuilder } from "../builders/playerGhostBuilder";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Camera } from "../rendering/camera";
import { SpriteRenderer } from "../rendering/spriteRendering";

export class PlayerGhostSpawnController extends Component {
	private scheduler = this.scene.findComponent(Scheduler);
	private camera = this.scene.findComponent(Camera);

	private position = this.inject(Position);
	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);

	constructor(entity: Entity) {
		super(entity);

		this.scheduler.waitForSeconds(10 * 0.1).then(() => {
			const x = this.position.x + 27 * (this.spriteRenderer.isFlipped ? -1 : 1);

			const playerGhost = this.scene.addEntity(new PlayerGhostBuilder(), {
				x: x,
				y: this.position.y + 1,
				flipped: this.spriteRenderer.isFlipped,
			});
			this.camera.target = playerGhost;
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.animatedSprite.didFinish) {
			this.entity.destroy();
		}
	}
}
