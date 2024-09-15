import { Component } from "../../core/component";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";
import { Sprite } from "../sprite";

export class PlayerControls extends Component {
	private velocity = this.inject(Velocity);
	private sprite = this.inject(Sprite);
	private actor = this.inject(Actor);

	private accelerationForce = 600;
	private maxSpeed = 100;
	private decelerationForce = 600;

	public update(dt: number): void {
		const horizontalAxis = this.getHorizontalAxis();

		if (this.shouldDecelerate(horizontalAxis)) {
			const sign = Math.sign(this.velocity.x);
			if (sign > 0) {
				this.velocity.x = Math.max(0, this.velocity.x - this.decelerationForce * dt);
			} else {
				this.velocity.x = Math.min(0, this.velocity.x + this.decelerationForce * dt);
			}
		}

		if (horizontalAxis > 0) {
			this.velocity.x = Math.min(this.maxSpeed, this.velocity.x + this.accelerationForce * dt);
			this.sprite.isFlipped = false;
		} else if (horizontalAxis < 0) {
			this.velocity.x = Math.max(-this.maxSpeed, this.velocity.x - this.accelerationForce * dt);
			this.sprite.isFlipped = true;
		}

		if (love.keyboard.isDown("z") && this.actor.isOnGround()) {
			this.velocity.y = -250;
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}

	private shouldDecelerate(horizontalAxis: number): boolean {
		if (horizontalAxis === 0) {
			return true;
		}

		if (Math.sign(horizontalAxis) !== Math.sign(this.velocity.x)) {
			return true;
		}

		return false;
	}
}
