import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
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
	private scheduler = this.scene.findComponent(Scheduler);

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

	private possessedAccelerationForce = 400;
	private possessedMaxSpeed = 15;
	private lastHeight = 0;

	private state: "controlled" | "inanimate" | "possessed" | "tripped" | "get_up" = "controlled";

	constructor(entity: Entity) {
		super(entity);

		this.body.onCollision.subscribe((payload) => this.onCollision(payload));
	}

	public override update(dt: number): void {
		if (this.state === "controlled") {
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

			if (this.input.buttonBState.isPressed && isOnGround) {
				this.velocity.x = 0;
				this.velocity.y = 0;

				this.state = "inanimate";
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

		if (this.state === "inanimate") {
			this.animatedSprite.play("inanimate");

			this.scene
				.findComponent(Scheduler)
				.waitForSeconds(1)
				.then(() => {
					this.state = "possessed";
					this.lastHeight = this.position.y;
				});
		}

		if (this.state === "possessed") {
			const horizontalInput = this.spriteRenderer.isFlipped ? -1 : 1;
			const isOnGround = !this.tilemap.query(this.feetSensor, this.position.x, this.position.y);

			if (horizontalInput > 0) {
				this.velocity.x = Math.min(this.possessedMaxSpeed, this.velocity.x + this.possessedAccelerationForce * dt);
				this.spriteRenderer.isFlipped = false;
			}

			if (horizontalInput < 0) {
				this.velocity.x = Math.max(-this.possessedMaxSpeed, this.velocity.x - this.possessedAccelerationForce * dt);
				this.spriteRenderer.isFlipped = true;
			}

			if (isOnGround) {
				this.animatedSprite.play("possessed_walk");
			} else {
				this.animatedSprite.play("possessed_fall");
			}
		}

		if (this.state === "tripped") {
			this.animatedSprite.play("possessed_trip");
		}

		if (this.state === "get_up") {
			this.animatedSprite.play("possessed_get_up");
		}
	}

	private onCollision(payload: { x: number; y: number }): void {
		if (this.state === "possessed") {
			if (payload.x !== 0) {
				this.spriteRenderer.isFlipped = !this.spriteRenderer.isFlipped;
			}

			if (payload.y !== 0) {
				const distanceFallen = this.position.y - this.lastHeight;
				if (distanceFallen > 6) {
					this.state = "tripped";
					this.velocity.x = 0;

					this.scheduler.waitForSeconds(1).then(() => {
						this.state = "get_up";

						this.scheduler.waitForSeconds(0.2).then(() => {
							this.state = "possessed";
						});
					});
				}
			}

			if (payload.y > 0) {
				this.lastHeight = this.position.y;
			}
		}
	}
}
