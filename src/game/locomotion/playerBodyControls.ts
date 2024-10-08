import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
import { EnemyGhostSpawnBuilder } from "../builders/enemyGhostSpawnBuilder";
import { PlayerGhostSpawnBuiler } from "../builders/playerGhostSpawnBuilder";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { LevelLoader } from "../levels/levelLoader";
import { Body } from "../physics/body";
import { BoundingBox } from "../physics/boundingBox";
import { Mass } from "../physics/mass";
import { Tilemap } from "../physics/tilemap";
import { Velocity } from "../physics/velocity";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { Camera } from "../rendering/camera";
import { SpriteRenderer } from "../rendering/spriteRendering";

type PlayerStates = "controlled" | "inanimate" | "possessing" | "possessed" | "tripped" | "get_up" | "dead";

export class PlayerBodyControls extends Component {
	private input = this.scene.findComponent(Input);
	private tilemap = this.scene.findComponent(Tilemap);
	private scheduler = this.scene.findComponent(Scheduler);
	private camera = this.scene.findComponent(Camera);

	private position = this.inject(Position);
	private spriteRenderer = this.inject(SpriteRenderer);
	private animatedSprite = this.inject(AnimatedSprite);
	private velocity = this.inject(Velocity);
	private body = this.inject(Body);
	private mass = this.inject(Mass);

	private feetSensor: BoundingBox = {
		top: this.body.boundingBox.bottom,
		bottom: this.body.boundingBox.bottom + 1,
		left: this.body.boundingBox.left,
		right: this.body.boundingBox.right,
	};

	private expellSelfRightSensor: BoundingBox = {
		top: this.body.boundingBox.top + 1,
		bottom: this.body.boundingBox.bottom,
		left: this.body.boundingBox.right,
		right: this.body.boundingBox.right + 11 + 16,
	};

	private expellSelfLeftSensor: BoundingBox = {
		top: this.body.boundingBox.top + 1,
		bottom: this.body.boundingBox.bottom,
		left: this.body.boundingBox.left - 11 - 16,
		right: this.body.boundingBox.left,
	};

	private expellEnemyRightSensor: BoundingBox = {
		top: this.body.boundingBox.top + 1,
		bottom: this.body.boundingBox.bottom,
		left: this.body.boundingBox.right,
		right: this.body.boundingBox.right + 11 + 13,
	};

	private expellEnemyLeftSensor: BoundingBox = {
		top: this.body.boundingBox.top + 1,
		bottom: this.body.boundingBox.bottom,
		left: this.body.boundingBox.left - 11 - 13,
		right: this.body.boundingBox.left,
	};

	private accelerationForce = 600;
	private maxSpeed = 70;
	private decelerationForce = 600;
	private jumpForce = 170;

	private possessedAccelerationForce = 400;
	private possessedMaxSpeed = 15;
	private lastHeight = 0;

	private isHighJumping = false;

	private _state: PlayerStates = "controlled";
	/* prettier-ignore */ public get state() { return this._state; }
	/* prettier-ignore */ private set state(state: PlayerStates) { this._state = state; }

	private levelLoader: LevelLoader;

	private walkSound = love.audio.newSource("assets/sfx/noise_walk.wav", "stream");
	private deathSound = love.audio.newSource("assets/sfx/noise_death.wav", "stream");
	private possessSound = love.audio.newSource("assets/sfx/wave_posses_1.wav", "stream");
	private reclaimSound = love.audio.newSource("assets/sfx/wave_reclaim.wav", "stream");
	private exitBodySound = love.audio.newSource("assets/sfx/noise_rise.wav", "stream");

	constructor(entity: Entity, levelLoader: LevelLoader) {
		super(entity);

		this.body.onCollision.subscribe((payload) => this.onCollision(payload));
		this.levelLoader = levelLoader;

		this.walkSound.setLooping(true);
		this.deathSound.setLooping(false);
	}

	public override update(dt: number): void {
		this.body.ignoreOneWay = false;

		if (this.state === "controlled") {
			const horizontalInput = (this.input.buttonLeftState.isDown ? -1 : 0) + (this.input.buttonRightState.isDown ? 1 : 0);

			const isOnGround = !this.tilemap.query(this.feetSensor, this.position.x, this.position.y, this.velocity.y < 0);

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

			// if (horizontalInput !== 0 && isOnGround) {
			// 	this.walkSound.play();
			// } else {
			// 	this.walkSound.pause();
			// }

			if (this.input.buttonAState.isPressed && isOnGround) {
				this.velocity.y = -this.jumpForce;
				this.isHighJumping = true;

				const jumpSound = love.audio.newSource("assets/sfx/square_jump.wav", "stream");
				jumpSound.play();
			}

			if (this.isHighJumping) {
				if (this.input.buttonAState.isReleased) {
					this.isHighJumping = false;
				}

				if (this.velocity.y > 0) {
					this.isHighJumping = false;
				}
			}

			if (this.isHighJumping) {
				this.mass.gravity = 500;
			} else {
				this.mass.gravity = 1000;
			}

			if (this.input.buttonBState.isPressed && isOnGround) {
				const canExpell = (!this.spriteRenderer.isFlipped && this.tilemap.query(this.expellSelfRightSensor, this.position.x, this.position.y)) || (this.spriteRenderer.isFlipped && this.tilemap.query(this.expellSelfLeftSensor, this.position.x, this.position.y));
				if (canExpell) {
					this.velocity.x = 0;
					this.velocity.y = 0;

					this.state = "inanimate";

					this.exitBodySound.play();

					this.scene.addEntity(new PlayerGhostSpawnBuiler(), {
						x: this.position.x,
						y: this.position.y,
						flipped: this.spriteRenderer.isFlipped,
						playerBody: this,
					});
				}
			}

			if (this.input.buttonDownState.isDown) {
				this.body.ignoreOneWay = true;
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

		if (this.state === "possessing") {
			this.animatedSprite.play("possess");
		}

		if (this.state === "dead") {
			this.animatedSprite.play("die");
			this.camera.doLerp = true;
		}

		if (this.input.buttonStartState.isPressed) {
			this.levelLoader.reload();
		}
	}

	public tryReclaim(): boolean {
		if (this.state === "dead") {
			return false;
		}

		const wasPossessed = this.state === "possessed" || this.state === "possessing" || this.state === "get_up" || this.state === "tripped";

		if (wasPossessed) {
			if (this.spriteRenderer.isFlipped) {
				if (!this.tilemap.query(this.expellEnemyRightSensor, this.position.x, this.position.y)) {
					return false;
				}
			} else {
				if (!this.tilemap.query(this.expellEnemyLeftSensor, this.position.x, this.position.y)) {
					return false;
				}
			}
		}

		this.reclaimSound.play();

		this.state = "possessing";
		this.velocity.x = 0;
		this.velocity.y = 0;

		this.scheduler.waitForSeconds(0.6).then(() => {
			this.state = "controlled";
			this.velocity.x = 0;
			this.velocity.y = 0;
		});

		if (wasPossessed) {
			this.scene.addEntity(new EnemyGhostSpawnBuilder(), {
				x: this.position.x,
				y: this.position.y,
				flipped: this.spriteRenderer.isFlipped,
				playerBody: this,
			});
		}

		return true;
	}

	public die(): void {
		if (this.state !== "dead") {
			this.deathSound.play();
		}

		this.state = "dead";
		this.velocity.x = 0;

		this.camera.target = this.entity;
		this.camera.doLerp = true;

		this.scheduler.waitForSeconds(1).then(() => this.levelLoader.load("death"));
	}

	public possess(): void {
		if (this.state === "dead") {
			return;
		}

		if (this.state !== "possessing") {
			this.possessSound.play();
		}

		this.state = "possessing";
		this.velocity.x = 0;
		this.velocity.y = 0;

		this.scheduler.waitForSeconds(0.6).then(() => {
			this.state = "possessed";
			this.lastHeight = this.position.y;
		});
	}

	private onCollision(payload: { x: number; y: number }): void {
		if (this.state === "possessed") {
			if (payload.x !== 0) {
				this.spriteRenderer.isFlipped = !this.spriteRenderer.isFlipped;
			}

			if (payload.y !== 0) {
				const distanceFallen = this.position.y - this.lastHeight;
				if (distanceFallen > 12) {
					this.state = "tripped";
					this.velocity.x = 0;

					this.scheduler.waitForSeconds(1).then(() => {
						if (this.state === "controlled") {
							return;
						}

						this.state = "get_up";

						this.scheduler.waitForSeconds(0.2).then(() => {
							if (this.state === "controlled") {
								return;
							}

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
