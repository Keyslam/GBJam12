import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Body } from "../physics/body";
import { Tilemap } from "../physics/tilemap";

export class EnemyGhostControls extends Component {
	private tilemap = this.scene.findComponent(Tilemap);

	private position = this.inject(Position);
	private body = this.inject(Body);

	private targetX: number;
	private targetY: number;

	constructor(entity: Entity, targetX: number, targetY: number) {
		super(entity);

		this.targetX = targetX;
		this.targetY = targetY;
	}

	public override update(dt: number): void {
		if (!love.keyboard.isDown("space")) {
			return;
		}

		const path = this.tilemap.findPath(this.position.x, this.position.y, this.targetX, this.targetY, this.body.boundingBox);

		if (path !== undefined && path.length > 1) {
			let dx = path[1].x * 6 - this.position.x;
			let dy = path[1].y * 6 - this.position.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			dx /= dist;
			dy /= dist;

			this.position.x += dx * 30 * dt;
			this.position.y += dy * 30 * dt;
		}
	}
}
