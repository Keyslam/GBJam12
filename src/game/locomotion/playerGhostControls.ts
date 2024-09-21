import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Camera } from "../rendering/camera";
import { SpriteRenderer } from "../rendering/spriteRendering";
import { PlayerBodyControls } from "./playerBodyControls";

export class PlayerGhostControls extends Component {
	private input = this.scene.findComponent(Input);
	private camera = this.scene.findComponent(Camera);

	private position = this.inject(Position);
	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);
	private velocity = this.inject(Velocity);

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;

	private state: "controlled" | "possessing" = "controlled";

	private possessDistance = 20;
	private playerBody: PlayerBodyControls;

	constructor(entity: Entity, playerBody: PlayerBodyControls) {
		super(entity);

		this.playerBody = playerBody;
	}

	public override update(dt: number): void {
		if (this.state === "controlled") {
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

			const playerPosition = this.playerBody.entity.getComponent(Position);

			const dx = this.position.x - playerPosition.x;
			const dy = this.position.y - playerPosition.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance <= this.possessDistance) {
				const success = this.playerBody.tryReclaim();

				if (success) {
					this.velocity.x = 0;
					this.velocity.y = 0;

					this.state = "possessing";

					this.camera.target = this.playerBody.entity;
				}
			}

			this.animatedSprite.play("idle");
		}

		if (this.state === "possessing") {
			this.animatedSprite.play("possess");

			// if (this.animatedSprite.didFinish) {
			this.entity.destroy();
			// }
		}
	}
}
