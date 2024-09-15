import { Context } from "context";
import { Hitbox } from "core/hitbox";
import { Body } from "./body";

export class Actor extends Body {
	private onCollision: (normalX: number, normalY: number) => void;
	private squish: () => void;

	constructor(context: Context, x: number, y: number, hitbox: Hitbox, onCollision: (normalX: number, normalY: number) => void, squish: () => void) {
		super(context, x, y, hitbox, "actor");

		this.onCollision = onCollision;
		this.squish = squish;

		this.context.registerActor(this);
	}

	public moveX(amount: number, force: boolean = false): void {
		this.remainderX += amount;
		let move = Math.round(this.remainderX);

		if (move !== 0) {
			this.remainderX -= move;
			const sign = Math.sign(move);

			while (move !== 0) {
				const goalX = this.x + sign;
				if (!this.collideAt(goalX, this.y)) {
					this.x += sign;
					move -= sign;
				} else {
					if (force) {
						this.squish();
					} else {
						this.onCollision(sign, 0);
					}
					break;
				}
			}
		}
	}

	public moveY(amount: number, force: boolean = false): void {
		this.remainderY += amount;
		let move = Math.round(this.remainderY);

		if (move !== 0) {
			this.remainderY -= move;
			const sign = Math.sign(move);

			while (move !== 0) {
				const goalY = this.y + sign;
				if (!this.collideAt(this.x, goalY)) {
					this.y += sign;
					move -= sign;
				} else {
					if (force) {
						this.squish();
					} else {
						this.onCollision(0, sign);
					}
					break;
				}
			}
		}
	}

	private collideAt(x: number, y: number): boolean {
		return false;
		return this.context.getAllSolids().some((solid) => solid.doesOverlap(new Hitbox(x, y, this.width, this.height)));
	}
}
