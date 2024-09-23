import { Component } from "../../core/component";
import { Velocity } from "./velocity";

export class Mass extends Component {
	private velocity = this.inject(Velocity);

	public gravity = 800;

	public override update(dt: number): void {
		this.velocity.y = Math.min(200, this.velocity.y + this.gravity * dt);
	}
}
