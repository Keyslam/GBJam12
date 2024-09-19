class Subscription<T> {
	private event: Event<T>;
	private callback: (payload: T) => void;

	constructor(event: Event<T>, callback: (payload: T) => void) {
		this.event = event;
		this.callback = callback;
	}

	public unsubscribe(): void {
		this.event.unsubscribe(this);
	}

	public emit(payload: T): void {
		this.callback(payload);
	}
}

export class Event<T> {
	private subscriptions: Subscription<T>[];

	constructor() {
		this.subscriptions = [];
	}

	public subscribe(callback: (payload: T) => void) {
		const subscription = new Subscription<T>(this, callback);
		this.subscriptions.push(subscription);
	}

	public unsubscribe(subscription: Subscription<T>) {
		this.subscriptions = this.subscriptions.filter((x) => x !== subscription);
	}

	public emit(payload: T): void {
		const subscriptions = [...this.subscriptions];
		for (const subscription of subscriptions) {
			subscription.emit(payload);
		}
	}
}
