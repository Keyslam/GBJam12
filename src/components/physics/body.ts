import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { DebugFlags } from "../../debugFlags";
import { Position } from "../position";
import { BoundingBox } from "./boundingBox";

export abstract class Body extends Component {
	protected position = this.inject(Position);

	public boundingBox: BoundingBox;
	public remainderX: number;
	public remainderY: number;
	public kind: "actor" | "solid";

	constructor(entity: Entity, kind: "actor" | "solid", boundingBox: BoundingBox) {
		super(entity);

		this.kind = kind;
		this.boundingBox = boundingBox;
		this.remainderX = 0;
		this.remainderY = 0;

		this.context.bodyRegistry.registerBody(this);
	}

	public move(x: number, y: number): { x: boolean; y: boolean } {
		const xSuccess = this.moveX(x);
		const ySuccess = this.moveY(y);

		return { x: xSuccess, y: ySuccess };
	}

	public override draw(): void {
		if (!DebugFlags.drawColliders) {
			return;
		}

		love.graphics.push("all");
		love.graphics.setColor(0, 0, 1, 1);
		love.graphics.rectangle("line", this.left + 0.5, this.top + 0.5, this.width - 1, this.height - 1);
		love.graphics.pop();
	}

	public isOnGround(): boolean {
		return (
			this.context.bodyRegistry.query(
				{
					top: this.bottom,
					left: this.left,
					bottom: this.bottom + 1,
					right: this.right,
				},
				this,
			).length > 0
		);
	}

	public abstract moveX(amount: number): boolean;
	public abstract moveY(amount: number): boolean;

	public get top(): number {
		return this.position.y - this.boundingBox.top;
	}

	public get left(): number {
		return this.position.x - this.boundingBox.left;
	}

	public get bottom(): number {
		return this.position.y + this.boundingBox.bottom;
	}

	public get right(): number {
		return this.position.x + this.boundingBox.right;
	}

	public get width(): number {
		return this.right - this.left;
	}

	public get height(): number {
		return this.bottom - this.top;
	}
}
