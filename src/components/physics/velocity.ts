import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../position";
import { Actor } from "./actor";
import { Body } from "./body";

export class Velocity extends Component {
	private position = this.inject(Position);

	public x: number;
	public y: number;

	constructor(entity: Entity, x: number = 0, y: number = 0) {
		super(entity);

		this.x = x;
		this.y = y;
	}

	public override update(dt: number): void {
		const body = this.getBody();

		if (body !== undefined) {
			const success = body.move(this.x * dt, this.y * dt);

			if (!success.x) {
				this.x = 0;
			}

			if (!success.y) {
				this.y = 0;
			}
		} else {
			this.position.x += this.x * dt;
			this.position.y += this.y * dt;
		}
	}

	private getBody(): Body | undefined {
		const actor = this.tryInject(Actor);
		if (actor !== undefined) {
			return actor;
		}

		return undefined;

		// TODO: Return Solid or Deco
	}
}
