import { Component } from "./component";
import { Scene } from "./scene";

export class Entity {
	private _scene: Scene;
	/* prettier-ignore */ public get scene() { return this._scene; }

	private components: Component[];
	private componentLookup: Record<string, Component>;

	private _isDestroyed;
	/* prettier-ignore */ public get isDestroyed() { return this._isDestroyed; }
	/* prettier-ignore */ private set isDestroyed(isDestroyed: boolean) { this._isDestroyed = isDestroyed; }

	constructor(scene: Scene) {
		this._scene = scene;
		this._isDestroyed = false;

		this.componentLookup = {};
		this.components = [];
	}

	// TODO: There's probably a better way to do this typing such that constructor arguments are passed automatically.
	// For now, just pass the type of the component and a manual instance of the component
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public addComponent<T extends Component>(componentClass: new (...args: any[]) => T, component: T): T {
		const id = componentClass.name;

		this.components.push(component);
		this.componentLookup[id] = component;

		return component;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public getComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		const id = componentClass.name;

		const component = this.componentLookup[id];
		if (component === undefined) {
			throw new Error("Component does not exist on entity");
		}

		return component as unknown as T;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public tryGetComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		const id = componentClass.name;

		const component = this.componentLookup[id];

		return component as unknown as T;
	}

	public update(dt: number): void {
		for (const component of this.components) {
			component.update(dt);
		}
	}

	public postUpdate(dt: number): void {
		for (const component of this.components) {
			component.postUpdate(dt);
		}
	}

	public draw(): void {
		for (const component of this.components) {
			component.draw();
		}
	}

	public drawScreen(): void {
		for (const component of this.components) {
			component.drawScreen();
		}
	}

	public destroy(): void {
		this.isDestroyed = true;

		for (const component of this.components) {
			component.onDestroy();
		}
	}
}
