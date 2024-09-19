import { Component } from "../../core/component";
import { buildPlayerBody } from "../entity/playerBody";
import { buildTile } from "../entity/tile";
import { Viewport } from "../graphics/sprite";

export class Editor extends Component {
	private tilesSprite = love.graphics.newImage("assets/tiles.png");
	private tileViewports: Viewport[] = [
		{ x: 36, y: 36, width: 12, height: 12 },
		{ x: 36, y: 24, width: 12, height: 12 },
		{ x: 24, y: 36, width: 12, height: 12 },
		{ x: 24, y: 24, width: 12, height: 12 },
		{ x: 36, y: 0, width: 12, height: 12 },
		{ x: 36, y: 12, width: 12, height: 12 },
		{ x: 24, y: 0, width: 12, height: 12 },
		{ x: 24, y: 12, width: 12, height: 12 },
		{ x: 0, y: 36, width: 12, height: 12 },
		{ x: 0, y: 24, width: 12, height: 12 },
		{ x: 12, y: 36, width: 12, height: 12 },
		{ x: 12, y: 24, width: 12, height: 12 },
		{ x: 0, y: 0, width: 12, height: 12 },
		{ x: 0, y: 12, width: 12, height: 12 },
		{ x: 12, y: 0, width: 12, height: 12 },
		{ x: 12, y: 12, width: 12, height: 12 },
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.context.input.leftButtonClicked) {
			const gridX = this.context.input.getMouseGridX();
			const gridY = this.context.input.getMouseGridY();

			if (love.keyboard.isDown("lctrl")) {
				this.parent?.addChild((entity) => buildPlayerBody(entity, 24, 24));
			} else {
				this.parent?.addChild((entity) => buildTile(entity, gridX, gridY));
			}
		}
	}

	public override draw(): void {
		love.graphics.push("all");
		love.graphics.setColor(1, 1, 1, 1);

		const gridX = this.context.input.getMouseGridX();
		const gridY = this.context.input.getMouseGridY();

		love.graphics.rectangle("line", gridX * 12 + 0.5, gridY * 12 + 0.5, 12 - 1, 12 - 1);
		love.graphics.pop();
	}
}
