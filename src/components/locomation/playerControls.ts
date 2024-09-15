import { Component } from "../../core/component";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { Sprite } from "../graphics/sprite";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";

export class PlayerControls extends Component {
	private velocity = this.inject(Velocity);
	private sprite = this.inject(Sprite);
	private animatedSprite = this.inject(AnimatedSprite);
	private actor = this.inject(Actor);

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;

	public update(dt: number): void {
		const isOnGround = this.actor.isOnGround();
		const horizontalAxis = this.getHorizontalAxis();

		if (this.shouldDecelerate(horizontalAxis, isOnGround)) {
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

		// Animations

		if (horizontalAxis !== 0 && isOnGround) {
			this.animatedSprite.play("run");
		}

		if (horizontalAxis === 0 && isOnGround) {
			this.animatedSprite.play("idle");
		}

		if (!isOnGround && this.velocity.y < 0) {
			this.animatedSprite.play("jump");
		}

		if (!isOnGround && this.velocity.y >= 0) {
			this.animatedSprite.play("fall");
		}
	}

	private getHorizontalAxis(): number {
		return (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);
	}

	private shouldDecelerate(horizontalAxis: number, isOnGround: boolean): boolean {
		if (isOnGround === false) {
			return false;
		}

		if (horizontalAxis === 0) {
			return true;
		}

		if (Math.sign(horizontalAxis) !== Math.sign(this.velocity.x)) {
			return true;
		}

		return false;
	}
}
