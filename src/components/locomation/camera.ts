import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../position";

export class Camera extends Component {
	private position = this.inject(Position);

	public target: Entity | undefined;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override postUpdate(dt: number): void {
		const targetPosition = this.target?.getComponent(Position);
		this.position.x = targetPosition?.x ?? this.position.x;
		this.position.y = targetPosition?.y ?? this.position.y;
	}

	public override preDraw(): void {
		love.graphics.translate(-this.position.x + 80, -this.position.y + 72);
	}

	public override postDraw(): void {
		love.graphics.translate(this.position.x - 80, this.position.y - 72);
	}
}
