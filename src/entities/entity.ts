import { Context } from "context";

export abstract class Entity {
	protected context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public isDead = false;

	public abstract update(dt: number): void;
	public abstract draw(): void;
}
