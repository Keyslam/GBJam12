import { Component } from "../../core/component";

export class SignalStore extends Component {
	private signals: Record<number, boolean> = {};

	public registerSignal(id: number): void {
		this.signals[id] = false;
	}

	public isSignalSet(id: number): boolean {
		return this.signals[id];
	}

	public setSignal(id: number, state: boolean): void {
		this.signals[id] = state;
	}

	public toggleSignal(id: number): void {
		this.signals[id] = !this.signals[id];
	}
}
