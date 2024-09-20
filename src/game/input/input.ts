import { KeyConstant } from "love.keyboard";
import { Component } from "../../core/component";

export interface ButtonState {
	isDown: boolean;
	isPressed: boolean;
	isReleased: boolean;
}

export class Input extends Component {
	public buttonAState = { isDown: false, isPressed: false, isReleased: false };
	public buttonBState = { isDown: false, isPressed: false, isReleased: false };
	public buttonUpState = { isDown: false, isPressed: false, isReleased: false };
	public buttonDownState = { isDown: false, isPressed: false, isReleased: false };
	public buttonLeftState = { isDown: false, isPressed: false, isReleased: false };
	public buttonRightState = { isDown: false, isPressed: false, isReleased: false };
	public buttonSelectState = { isDown: false, isPressed: false, isReleased: false };
	public buttonStartState = { isDown: false, isPressed: false, isReleased: false };

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		this.updateButtonState(this.buttonAState, "z");
		this.updateButtonState(this.buttonBState, "x");
		this.updateButtonState(this.buttonUpState, "up");
		this.updateButtonState(this.buttonDownState, "down");
		this.updateButtonState(this.buttonLeftState, "left");
		this.updateButtonState(this.buttonRightState, "right");
		this.updateButtonState(this.buttonSelectState, "rshift");
		this.updateButtonState(this.buttonStartState, "return");
	}

	private updateButtonState(buttonState: ButtonState, key: KeyConstant) {
		const isDown = love.keyboard.isDown(key);
		const wasDown = buttonState.isDown;

		buttonState.isDown = isDown;
		buttonState.isPressed = !wasDown && isDown;
		buttonState.isReleased = wasDown && !isDown;
	}
}
