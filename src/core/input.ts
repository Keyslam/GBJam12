import { Context } from "../context";

export class Input {
	private context: Context;

	public mouseX: number;
	public mouseY: number;

	public leftButtonClicked: boolean;

	constructor(context: Context) {
		this.context = context;

		this.mouseX = 0;
		this.mouseY = 0;

		this.leftButtonClicked = false;
	}

	public update(): void {
		const [mx, my] = love.mouse.getPosition();
		const mousePosition = this.context.viewportToWorld(mx, my);

		this.mouseX = mousePosition.x;
		this.mouseY = mousePosition.y;
	}

	public postUpdate(): void {
		this.leftButtonClicked = false;
	}

	public mousepressed(button: number) {
		if (button === 1) {
			this.leftButtonClicked = true;
		}
	}

	public getMouseGridX(): number {
		return Math.floor(this.mouseX / 12);
	}

	public getMouseGridY(): number {
		return Math.floor(this.mouseY / 12);
	}
}
