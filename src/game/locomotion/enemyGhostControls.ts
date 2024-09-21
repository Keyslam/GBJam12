import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Body } from "../physics/body";
import { Tilemap } from "../physics/tilemap";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { PlayerBodyControls } from "./playerBodyControls";

export class EnemyGhostControls extends Component {
	private tilemap = this.scene.findComponent(Tilemap);

	private position = this.inject(Position);
	private body = this.inject(Body);
	private spriteRenderer = this.inject(SpriteRenderer);

	private possessDistance = 25;
	private playerBody: PlayerBodyControls;

	constructor(entity: Entity, playerBody: PlayerBodyControls) {
		super(entity);

		this.playerBody = playerBody;
	}

	public override update(dt: number): void {
		if (this.playerBody.state !== "inanimate") {
			return;
		}

		const playerPosition = this.playerBody.entity.getComponent(Position);

		const dx = playerPosition.x - this.position.x;
		const dy = playerPosition.y - this.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance > this.possessDistance) {
			const path = this.tilemap.findPath(this.position.x, this.position.y, playerPosition.x, playerPosition.y, this.body.boundingBox);

			if (path !== undefined && path.length > 1) {
				let dx = path[1].x * 6 - this.position.x;
				let dy = path[1].y * 6 - this.position.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				dx /= dist;
				dy /= dist;

				this.position.x += dx * 30 * dt;
				this.position.y += dy * 30 * dt;

				if (dx > 0) {
					this.spriteRenderer.isFlipped = false;
				}

				if (dx < 0) {
					this.spriteRenderer.isFlipped = true;
				}
			}
		} else {
			this.playerBody.possess();
			this.entity.destroy();
		}
	}
}
