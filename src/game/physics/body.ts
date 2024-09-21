import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Event } from "../../core/event";
import { Position } from "../common/position";
import { BoundingBox } from "./boundingBox";
import { Tilemap } from "./tilemap";
import { Velocity } from "./velocity";

export class Body extends Component {
	private tileMap = this.scene.findComponent(Tilemap);

	private position = this.inject(Position);
	private velocity = this.inject(Velocity);

	private remainderX = 0;
	private remainderY = 0;

	private _boundingBox: BoundingBox;
	/* prettier-ignore */ public get boundingBox() { return this._boundingBox; }
	/* prettier-ignore */ private set boundingBox(boundingBox: BoundingBox) { this._boundingBox = boundingBox; }

	public onCollision = new Event<{ x: number; y: number }>();

	constructor(entity: Entity, boundingBox: BoundingBox) {
		super(entity);

		this._boundingBox = boundingBox;
	}

	public override update(dt: number) {
		this.moveX(this.velocity.x * dt);
		this.moveY(this.velocity.y * dt);
	}

	public override draw() {
		const draw = false;
		if (draw) {
			love.graphics.push("all");
			love.graphics.setColor(1, 0, 0, 0.5);

			love.graphics.rectangle("fill", this.position.x - 0.5, this.position.y - 0.5, 2, 2);

			love.graphics.setColor(0, 0, 1, 0.5);

			const x = this.position.x + this.boundingBox.left;
			const y = this.position.y + this.boundingBox.top;
			const width = this.position.x + this.boundingBox.right - x;
			const height = this.position.y + this.boundingBox.bottom - y;

			love.graphics.rectangle("line", x + 0.5, y + 0.5, width - 1, height - 1);

			love.graphics.pop();
		}
	}

	private moveX(amount: number): void {
		this.remainderX += amount;

		let moveX = Math.round(this.remainderX);

		if (moveX !== 0) {
			this.remainderX -= moveX;
			const sign = Math.sign(moveX);

			while (moveX !== 0) {
				const targetX = this.position.x + sign;

				const canMove = this.tileMap.query(this.boundingBox, targetX, this.position.y);
				if (canMove) {
					this.position.x = targetX;
					moveX -= sign;
				} else {
					this.onCollision.emit({ x: sign, y: 0 });
					this.velocity.x = 0;
					return;
				}
			}
		}
	}

	private moveY(amount: number): void {
		this.remainderY += amount;

		let moveY = Math.round(this.remainderY);

		if (moveY !== 0) {
			this.remainderY -= moveY;
			const sign = Math.sign(moveY);

			while (moveY !== 0) {
				const targetY = this.position.y + sign;

				const canMove = this.tileMap.query(this.boundingBox, this.position.x, targetY);
				if (canMove) {
					this.position.y = targetY;
					moveY -= sign;
				} else {
					this.onCollision.emit({ x: 0, y: sign });
					this.velocity.y = 0;
					return;
				}
			}
		}
	}
}
