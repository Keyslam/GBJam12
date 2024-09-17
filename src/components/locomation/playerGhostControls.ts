import { Component } from "../../core/component";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { Sprite } from "../graphics/sprite";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";

export class PlayerGhostControls extends Component {
	private velocity = this.inject(Velocity);
	private sprite = this.inject(Sprite);
	private animatedSprite = this.inject(AnimatedSprite);
	private actor = this.inject(Actor);

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;

	public update(dt: number): void {
		const horizontalAxis = this.getHorizontalAxis();
		const verticalAxis = this.getVerticalAxis();

		if (this.shouldDecelerate(horizontalAxis, this.velocity.x)) {
			const sign = Math.sign(this.velocity.x);
			if (sign > 0) {
				this.velocity.x = Math.max(0, this.velocity.x - this.decelerationForce * dt);
			} else {
				this.velocity.x = Math.min(0, this.velocity.x + this.decelerationForce * dt);
			}
		}

		if (this.shouldDecelerate(verticalAxis, this.velocity.y)) {
			const sign = Math.sign(this.velocity.y);
			if (sign > 0) {
				this.velocity.y = Math.max(0, this.velocity.y - this.decelerationForce * dt);
			} else {
				this.velocity.y = Math.min(0, this.velocity.y + this.decelerationForce * dt);
			}
		}

		if (horizontalAxis > 0) {
			this.velocity.x = Math.min(this.maxSpeed, this.velocity.x + this.accelerationForce * dt);
			this.sprite.isFlipped = false;
		} else if (horizontalAxis < 0) {
			this.velocity.x = Math.max(-this.maxSpeed, this.velocity.x - this.accelerationForce * dt);
			this.sprite.isFlipped = true;
		}

		if (verticalAxis > 0) {
			this.velocity.y = Math.min(this.maxSpeed, this.velocity.y + this.accelerationForce * dt);
		} else if (verticalAxis < 0) {
			this.velocity.y = Math.max(-this.maxSpeed, this.velocity.y - this.accelerationForce * dt);
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}

	private getVerticalAxis(): number {
		return (love.keyboard.isDown("up") ? -1 : 0) + (love.keyboard.isDown("down") ? 1 : 0);
	}

	private shouldDecelerate(axis: number, velocity: number): boolean {
		if (axis === 0) {
			return true;
		}

		if (Math.sign(axis) !== Math.sign(velocity)) {
			return true;
		}

		return false;
	}
}
