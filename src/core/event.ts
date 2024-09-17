class Subscription {
	private event: Event;
	private callback: () => void;

	constructor(event: Event, callback: () => void) {
		this.event = event;
		this.callback = callback;
	}

	public unsubscribe(): void {
		this.event.unsubscribe(this);
	}

	public emit(): void {
		this.callback();
	}
}

export class Event {
	private subscriptions: Subscription[];

	constructor() {
		this.subscriptions = [];
	}

	public subscribe(callback: () => void) {
		const subscription = new Subscription(this, callback);
		this.subscriptions.push(subscription);
	}

	public unsubscribe(subscription: Subscription) {
		this.subscriptions = this.subscriptions.filter((x) => x !== subscription);
	}

	public emit(): void {
		const subscriptions = [...this.subscriptions];
		for (const subscription of subscriptions) {
			subscription.emit();
		}
	}
}
