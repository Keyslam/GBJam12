import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { buildPlayerGhostSpawn } from "../entity/playerGhostSpawn";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { Sprite } from "../graphics/sprite";
import { Actor } from "../physics/actor";
import { Velocity } from "../physics/velocity";
import { Position } from "../position";

export class PlayerBodyControls extends Component {
	private position = this.inject(Position);
	private velocity = this.inject(Velocity);
	private sprite = this.inject(Sprite);
	private animatedSprite = this.inject(AnimatedSprite);
	private actor = this.inject(Actor);

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;

	public controlState: "controlled" | "inanimate" | "haunted" = "controlled";

	public hauntedState: "walking" | "tripped" | "getup" = "walking";

	private inanimateTime = 0;

	constructor(entity: Entity) {
		super(entity);

		this.actor.onCollision.subscribe((payload) => this.onCollision(payload));
	}

	public update(dt: number): void {
		if (this.controlState === "controlled") {
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

			if (love.keyboard.isDown("z") && isOnGround) {
				this.velocity.y = -250;
			}

			if (love.keyboard.isDown("x") && isOnGround) {
				this.controlState = "inanimate";
				this.velocity.x = 0;
				this.velocity.y = 0;

				if (this.sprite.isFlipped) {
					this.parent?.addChild((e) => buildPlayerGhostSpawn(e, this.position.x, this.position.y - 34, true));
				} else {
					this.parent?.addChild((e) => buildPlayerGhostSpawn(e, this.position.x, this.position.y - 34, false));
				}
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

		if (this.controlState === "inanimate") {
			this.animatedSprite.play("inanimate");

			this.inanimateTime += dt;

			if (this.inanimateTime >= 2) {
				this.controlState = "haunted";
				this.hauntedState = "walking";
			}
		}

		if (this.controlState === "haunted") {
			if (this.hauntedState === "walking") {
				const isOnGround = this.actor.isOnGround();

				if (isOnGround) {
					this.animatedSprite.play("zombie_walk");

					this.velocity.x = Math.min(this.maxSpeed / 4, this.velocity.x + this.accelerationForce * dt);
					this.sprite.isFlipped = false;
				} else {
					this.animatedSprite.play("zombie_fall");
				}
			} else if (this.hauntedState === "tripped") {
				if (this.animatedSprite.didLoop && this.animatedSprite.activeAnimationName === "zombie_tripped") {
					this.hauntedState = "getup";
				}

				if (this.animatedSprite.didLoop && this.animatedSprite.activeAnimationName === "zombie_trip") {
					this.animatedSprite.play("zombie_tripped");
				}
			} else if (this.hauntedState === "getup") {
				this.animatedSprite.play("zombie_getup");
				if (this.animatedSprite.didLoop) {
					this.hauntedState = "walking";
				}
			}
		}
	}

	public onCollision(payload: { normalX: number; normalY: number }): void {
		if (this.controlState === "haunted") {
			if (payload.normalY === 1 && this.velocity.y > 80 && this.hauntedState === "walking") {
				this.hauntedState = "tripped";
				this.velocity.x = 0;
				this.animatedSprite.play("zombie_trip");
			}
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
