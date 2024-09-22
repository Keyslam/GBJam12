import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";

export class Camera extends Component {
	private position = this.inject(Position);

	private offsetX = 80;
	private offsetY = 72 + 12;

	private _target: Entity | undefined;
	/* prettier-ignore */ public get target() { return this._target; }
	/* prettier-ignore */ public set target(target: Entity | undefined) { this._target = target; }

	public doLerp = false;

	public override postUpdate(dt: number): void {
		const targetPosition = this._target?.getComponent(Position);

		if (targetPosition) {
			if (this.doLerp) {
				this.position.x = this.lerp(this.position.x, targetPosition.x, dt * 20);
				this.position.y = this.lerp(this.position.y, targetPosition.y, dt * 20);
			} else {
				this.position.x = targetPosition.x;
				this.position.y = targetPosition.y;
			}
		}

		this.doLerp = false;
	}

	public attach(): void {
		love.graphics.push("all");
		love.graphics.translate(Math.floor(-this.position.x + this.offsetX), Math.floor(-this.position.y + this.offsetY));
	}

	public detach(): void {
		love.graphics.pop();
	}

	private lerp(a: number, b: number, alpha: number): number {
		return a + alpha * (b - a);
	}
}
