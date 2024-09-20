import { Component } from "../../core/component";
import { Entity } from "../../core/entity";

export class Velocity extends Component {
	public x: number;
	public y: number;

	constructor(entity: Entity, x: number = 0, y: number = 0) {
		super(entity);

		this.x = x;
		this.y = y;
	}
}
