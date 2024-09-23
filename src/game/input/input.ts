import { GamepadButton } from "love.joystick";
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

	private joystick = love.joystick.getJoysticks()[0];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.joystick !== undefined) {
			this.updateButtonStateFromJoystick(this.buttonAState, "a");
			this.updateButtonStateFromJoystick(this.buttonBState, "b");
			this.updateButtonStateFromJoystick(this.buttonUpState, "dpup");
			this.updateButtonStateFromJoystick(this.buttonDownState, "dpdown");
			this.updateButtonStateFromJoystick(this.buttonLeftState, "dpleft");
			this.updateButtonStateFromJoystick(this.buttonRightState, "dpright");
			this.updateButtonStateFromJoystick(this.buttonSelectState, "guide");
			this.updateButtonStateFromJoystick(this.buttonStartState, "start");
		} else {
			this.updateButtonStateFromKeyboard(this.buttonAState, "z");
			this.updateButtonStateFromKeyboard(this.buttonBState, "x");
			this.updateButtonStateFromKeyboard(this.buttonUpState, "up");
			this.updateButtonStateFromKeyboard(this.buttonDownState, "down");
			this.updateButtonStateFromKeyboard(this.buttonLeftState, "left");
			this.updateButtonStateFromKeyboard(this.buttonRightState, "right");
			this.updateButtonStateFromKeyboard(this.buttonSelectState, "rshift");
			this.updateButtonStateFromKeyboard(this.buttonStartState, "return");
		}
	}

	private updateButtonStateFromKeyboard(buttonState: ButtonState, key: KeyConstant) {
		const isDown = love.keyboard.isDown(key);
		const wasDown = buttonState.isDown;

		buttonState.isDown = isDown;
		buttonState.isPressed = !wasDown && isDown;
		buttonState.isReleased = wasDown && !isDown;
	}

	private updateButtonStateFromJoystick(buttonState: ButtonState, button: GamepadButton) {
		const isDown = this.joystick.isGamepadDown(button);
		const wasDown = buttonState.isDown;

		buttonState.isDown = isDown;
		buttonState.isPressed = !wasDown && isDown;
		buttonState.isReleased = wasDown && !isDown;
	}
}
