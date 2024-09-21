import { Component } from "../../core/component";
import { Input } from "../input/input";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export class PlayerGhostControls extends Component {
	private input = this.scene.findComponent(Input);

	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);
	private velocity = this.inject(Velocity);

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;

	public override update(dt: number): void {
		const horizontalInput = (this.input.buttonLeftState.isDown ? -1 : 0) + (this.input.buttonRightState.isDown ? 1 : 0);
		const verticalInput = (this.input.buttonUpState.isDown ? -1 : 0) + (this.input.buttonDownState.isDown ? 1 : 0);

		if (horizontalInput === 0) {
			const sign = Math.sign(this.velocity.x);
			if (sign > 0) {
				this.velocity.x = Math.max(0, this.velocity.x - this.decelerationForce * dt);
			} else {
				this.velocity.x = Math.min(0, this.velocity.x + this.decelerationForce * dt);
			}
		}

		if (verticalInput === 0) {
			const sign = Math.sign(this.velocity.y);
			if (sign > 0) {
				this.velocity.y = Math.max(0, this.velocity.y - this.decelerationForce * dt);
			} else {
				this.velocity.y = Math.min(0, this.velocity.y + this.decelerationForce * dt);
			}
		}

		if (horizontalInput > 0) {
			this.velocity.x = Math.min(this.maxSpeed, this.velocity.x + this.accelerationForce * dt);
			this.spriteRenderer.isFlipped = false;
		}

		if (horizontalInput < 0) {
			this.velocity.x = Math.max(-this.maxSpeed, this.velocity.x - this.accelerationForce * dt);
			this.spriteRenderer.isFlipped = true;
		}

		if (verticalInput > 0) {
			this.velocity.y = Math.min(this.maxSpeed, this.velocity.y + this.accelerationForce * dt);
		}

		if (verticalInput < 0) {
			this.velocity.y = Math.max(-this.maxSpeed, this.velocity.y - this.accelerationForce * dt);
		}

		this.animatedSprite.play("idle");
	}
}
