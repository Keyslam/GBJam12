import { Context } from "../context";
import { Component } from "./component";

export class Entity {
	public context: Context;

	private components: Record<string, Component> = {};
	private dead = false;

	constructor(context: Context) {
		this.context = context;
	}

	// TODO: There's probably a better way to do this typing such that constructor arguments are passed automatically.
	// For now, just pass the type of the component and a manual instance of the component
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public addComponent<T extends Component>(componentClass: new (...args: any[]) => T, component: T): T {
		const id = componentClass.name;

		this.components[id] = component;

		return component;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		const id = componentClass.name;

		const component = this.components[id];
		if (component === undefined) {
			throw new Error("Component does not exist on entity");
		}

		return component as unknown as T;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public tryGetComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		const id = componentClass.name;

		const component = this.components[id];

		return component as unknown as T;
	}

	public update(dt: number): void {
		for (const componentKey in this.components) {
			const component = this.components[componentKey];
			component.update(dt);
		}
	}

	public draw(): void {
		for (const componentKey in this.components) {
			const component = this.components[componentKey];
			component.draw();
		}
	}

	public destroy(): void {
		this.dead = true;
	}

	public get isDead(): boolean {
		return this.dead;
	}
}
