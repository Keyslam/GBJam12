import { Component } from "../../core/component";
import { Position } from "../common/position";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Body } from "../physics/body";
import { Velocity } from "../physics/velocity";

export class Spikes extends Component {
	private playerBody = this.scene.findComponent(PlayerBodyControls);

	private position = this.inject(Position);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		const top = this.position.y + 4;
		const left = this.position.x + 4;
		const bottom = top + 8;
		const right = left + 4;

		const playerPosition = this.playerBody.entity.getComponent(Position);
		const playerActor = this.playerBody.entity.getComponent(Body);
		const playerTop = playerPosition.y + playerActor.boundingBox.top;
		const playerLeft = playerPosition.x + playerActor.boundingBox.left;
		const playerBottom = playerPosition.y + playerActor.boundingBox.bottom;
		const playerRight = playerPosition.x + playerActor.boundingBox.right;

		if (left < playerRight && right > playerLeft && top < playerBottom && bottom > playerTop) {
			const playerVelocity = this.playerBody.entity.getComponent(Velocity);
			if (playerVelocity.y >= 0) {
				this.playerBody.die();
			}
		}
	}
}
