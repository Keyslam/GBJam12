import { Context } from "context";
import { Hitbox } from "core/hitbox";
import { Actor } from "./actor";
import { Entity } from "./entity";

export class Player extends Entity {
	private image = love.graphics.newImage("assets/spoopyboy.png");
	private quad = love.graphics.newQuad(0, 0, 48, 48, this.image);

	private body: Actor;

	private vx = 0;
	private vy = 0;

	private facing: "left" | "right" = "right";

	constructor(context: Context) {
		super(context);

		this.body = new Actor(context, 24, 24, new Hitbox(0, 0, 18, 22), this.onCollision.bind(this), this.squish.bind(this));
	}

	private onCollision(normalX: number, normalY: number): void {
		if (normalY === 1) {
			this.vy = 0;
		}
	}

	private squish(): void {}

	public update(dt: number): void {
		const gravity = 200;
		const acceleration = 500;
		const maxWalkingSpeed = 100;
		const friction = 100;

		this.vy = this.vy + gravity * dt;

		const horizontalInput = (love.keyboard.isDown("left") ? -1 : 0) + (love.keyboard.isDown("right") ? 1 : 0);

		if (horizontalInput > 0) {
			if (this.vx < 0) {
				const ratio = 1 / (1 + dt * friction);
				this.vx *= ratio;
			}

			this.vx = Math.min(maxWalkingSpeed, this.vx + acceleration * dt);
			this.facing = "right";
		} else if (horizontalInput < 0) {
			if (this.vx > 0) {
				const ratio = 1 / (1 + dt * friction);
				this.vx *= ratio;
			}

			this.vx = Math.max(-maxWalkingSpeed, this.vx - acceleration * dt);
			this.facing = "left";
		} else {
			const ratio = 1 / (1 + dt * friction);
			this.vx *= ratio;
		}

		this.body.moveX(this.vx * dt);
		this.body.moveY(this.vy * dt);
	}

	public draw(): void {
		const sx = this.facing === "right" ? 1 : -1;

		love.graphics.setColor(1, 1, 1, 1);
		love.graphics.draw(this.image, this.quad, this.body.x, this.body.y, 0, sx, 1, 24, 24);

		this.body.draw();
	}
}
