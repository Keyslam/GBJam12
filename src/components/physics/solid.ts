import { Entity } from "../../core/entity";
import { Body } from "./body";
import { BoundingBox } from "./boundingBox";

export class Solid extends Body {
	constructor(entity: Entity, boundingBox: BoundingBox) {
		super(entity, "solid", boundingBox);
	}

	// TODO
	public moveX(amount: number): boolean {
		this.position.x += amount;
		return true;
	}

	// TODO
	public moveY(amount: number): boolean {
		this.position.y += amount;
		return true;
	}
}
