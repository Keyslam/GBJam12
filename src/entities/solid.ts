import { Context } from "context";
import { Hitbox } from "core/hitbox";
import { Actor } from "./actor";
import { Body } from "./body";

export class Solid extends Body {
	private ridingActors: Actor[] = [];

	constructor(context: Context, x: number, y: number, hitbox: Hitbox) {
		super(context, x, y, hitbox, "actor");

		this.context.registerSolid(this);
	}

	public moveX(amount: number): void {
		this.remainderX += amount;
		const moveX = Math.round(this.remainderX);

		if (moveX !== 0) {
			this.remainderX -= moveX;
			this.x += moveX;

			// Carry riding actors
			for (const actor of this.ridingActors) {
				actor.moveX(moveX);
			}

			// Push any actors in the way
			for (const actor of this.context.getAllActors()) {
				if (this.overlapCheck(actor)) {
					const distance = moveX > 0 ? this.x + this.hitbox.width - actor.x : actor.x + actor.hitbox.width - this.x;
					actor.moveX(distance, true);
				}
			}
		}
	}

	public moveY(amount: number): void {
		this.remainderY += amount;
		const moveY = Math.round(this.remainderY);

		if (moveY !== 0) {
			this.remainderY -= moveY;
			this.y += moveY;

			// Carry riding actors
			for (const actor of this.ridingActors) {
				actor.moveY(moveY);
			}

			// Push any actors in the way
			for (const actor of this.context.getAllActors()) {
				if (this.overlapCheck(actor)) {
					const distance = moveY > 0 ? this.y + this.hitbox.height - actor.y : actor.y + actor.hitbox.height - this.y;
					actor.moveX(distance, true);
				}
			}
		}
	}

	private overlapCheck(actor: Actor): boolean {
		return this.doesOverlapWith(actor);
	}
}
