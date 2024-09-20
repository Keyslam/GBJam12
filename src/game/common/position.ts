import { Component } from "../../core/component";
import { Entity } from "../../core/entity";

export class Position extends Component {
	public x: number;
	public y: number;

	constructor(entity: Entity, x: number, y: number) {
		super(entity);

		this.x = x;
		this.y = y;
	}
}
