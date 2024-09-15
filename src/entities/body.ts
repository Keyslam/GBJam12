import { Context } from "context";
import { Hitbox } from "core/hitbox";

export type BodyKind = "actor" | "solid";

export abstract class Body {
	protected context: Context;

	public x: number;
	public y: number;

	public remainderX: number;
	public remainderY: number;

	public hitbox: Hitbox;

	public kind: BodyKind;

	constructor(context: Context, x: number, y: number, hitbox: Hitbox, kind: BodyKind) {
		this.context = context;

		this.x = x;
		this.y = y;

		this.remainderX = 0;
		this.remainderY = 0;

		this.hitbox = hitbox;

		this.kind = kind;
	}

	public abstract moveX(amount: number): void;
	public abstract moveY(amount: number): void;

	public doesOverlap(hitbox: Hitbox): boolean {
		return this.hitbox.overlapsWith(hitbox);
	}

	public doesOverlapWith(other: Body): boolean {
		return this.doesOverlap(other.hitbox);
	}

	public draw() {
		love.graphics.push("all");

		love.graphics.setColor(1, 0, 0, 0.5);
		love.graphics.points(this.x + 0.5, this.y + 0.5);

		this.hitbox.draw(this.x, this.y);

		love.graphics.pop();
	}
}
