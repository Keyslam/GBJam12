import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
import { EnemyGhostBuilder } from "../builders/enemyGhostBuilder";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { PlayerBodyControls } from "./playerBodyControls";

export class EnemyGhostSpawnController extends Component {
	private scheduler = this.scene.findComponent(Scheduler);

	private position = this.inject(Position);
	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);

	constructor(entity: Entity, playerBody: PlayerBodyControls) {
		super(entity);

		this.scheduler.waitForSeconds(5 * 0.1).then(() => {
			const x = this.position.x + 24 * (this.spriteRenderer.isFlipped ? 1 : -1);

			this.scene.addEntity(new EnemyGhostBuilder(), {
				x: x,
				y: this.position.y + 2,
				flipped: this.spriteRenderer.isFlipped,
				playerBody: playerBody,
			});
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.animatedSprite.didFinish) {
			this.entity.destroy();
		}
	}
}
