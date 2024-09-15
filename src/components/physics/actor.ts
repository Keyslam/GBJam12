import { Entity } from "../../core/entity";
import { Body } from "./body";
import { BoundingBox } from "./boundingBox";
import { Solid } from "./solid";

export class Actor extends Body {
	constructor(entity: Entity, boundingBox: BoundingBox) {
		super(entity, "actor", boundingBox);
	}

	public moveX(amount: number): boolean {
		this.remainderX += amount;
		let move = Math.round(this.remainderX);

		if (move !== 0) {
			this.remainderX -= move;
			const sign = Math.sign(move);

			while (move !== 0) {
				const canMove = this.canMove(sign, 0);
				if (canMove) {
					this.position.x += sign;
					move -= sign;
				} else {
					return false;
				}
			}
		}

		return true;
	}

	public moveY(amount: number): boolean {
		this.remainderY += amount;
		let move = Math.round(this.remainderY);

		if (move !== 0) {
			this.remainderY -= move;
			const sign = Math.sign(move);

			while (move !== 0) {
				const canMove = this.canMove(0, sign);
				if (canMove) {
					this.position.y += sign;
					move -= sign;
				} else {
					return false;
				}
			}
		}

		return true;
	}

	private canMove(offsetX: number, offsetY: number): boolean {
		const bodies = this.context.bodyRegistry.query(
			{
				top: this.top + offsetY,
				left: this.left + offsetX,
				bottom: this.bottom + offsetY,
				right: this.right + offsetX,
			},
			this,
		);

		return !bodies.some((body) => {
			return body instanceof Solid;
		});
	}
}
