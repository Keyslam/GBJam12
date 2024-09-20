import { Component } from "../../core/component";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { Body } from "../physics/body";
import { BoundingBox } from "../physics/boundingBox";
import { Tilemap } from "../physics/tilemap";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

export class PlayerBodyControls extends Component {
	private input = this.scene.findComponent(Input);
	private tilemap = this.scene.findComponent(Tilemap);

	private position = this.inject(Position);
	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);
	private velocity = this.inject(Velocity);
	private body = this.inject(Body);

	private feetSensor: BoundingBox = {
		top: this.body.boundingBox.bottom,
		bottom: this.body.boundingBox.bottom + 1,
		left: this.body.boundingBox.left,
		right: this.body.boundingBox.right,
	};

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;
	private jumpForce = 250;

	public override update(dt: number): void {
		const horizontalInput = (this.input.buttonLeftState.isDown ? -1 : 0) + (this.input.buttonRightState.isDown ? 1 : 0);

		const isOnGround = !this.tilemap.query(this.feetSensor, this.position.x, this.position.y);

		if (horizontalInput === 0) {
			const sign = Math.sign(this.velocity.x);
			if (sign > 0) {
				this.velocity.x = Math.max(0, this.velocity.x - this.decelerationForce * dt);
			} else {
				this.velocity.x = Math.min(0, this.velocity.x + this.decelerationForce * dt);
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

		if (this.input.buttonAState.isPressed && isOnGround) {
			this.velocity.y = -this.jumpForce;
		}

		// Animations

		if (isOnGround) {
			if (horizontalInput !== 0) {
				this.animatedSprite.play("run");
			} else {
				this.animatedSprite.play("idle");
			}
		} else {
			if (this.velocity.y < 0) {
				this.animatedSprite.play("jump");
			} else {
				this.animatedSprite.play("fall");
			}
		}
	}
}
