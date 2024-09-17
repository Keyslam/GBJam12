import { Context } from "../context";
import { Component } from "./component";

export class Entity {
	public parent: Entity | undefined;
	public children: Entity[];

	public context: Context;

	private components: Component[];
	private componentLookup: Record<string, Component>;

	public isDestroyed = false;

	constructor(context: Context, parent: Entity | undefined) {
		this.context = context;

		this.parent = parent;
		this.children = [];

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

	public addChild(entityBuilder: (entity: Entity) => void): Entity {
		const entity = new Entity(this.context, this);
		entityBuilder(entity);

		this.children.push(entity);

		return entity;
	}

	public removeChild(child: Entity): void {
		this.children = this.children.filter((x) => x !== child);
	}

	public preUpdate(dt: number): void {
		for (const component of this.components) {
			component.preUpdate(dt);
		}

		for (const child of this.children) {
			child.preUpdate(dt);
		}

		const deadChildren = this.children.filter((x) => x.isDestroyed);
		for (const deadChild of deadChildren) {
			this.removeChild(deadChild);
		}
	}

	public update(dt: number): void {
		for (const component of this.components) {
			component.update(dt);
		}

		for (const child of this.children) {
			child.update(dt);
		}

		const deadChildren = this.children.filter((x) => x.isDestroyed);
		for (const deadChild of deadChildren) {
			this.removeChild(deadChild);
		}
	}

	public postUpdate(dt: number): void {
		for (const component of this.components) {
			component.postUpdate(dt);
		}

		for (const child of this.children) {
			child.postUpdate(dt);
		}

		const deadChildren = this.children.filter((x) => x.isDestroyed);
		for (const deadChild of deadChildren) {
			this.removeChild(deadChild);
		}
	}

	public draw(): void {
		for (const component of this.components) {
			component.draw();
		}

		for (const child of this.children) {
			child.draw();
		}
	}

	public destroy(): void {
		this.isDestroyed = true;
	}

	public finalizeDestroy(): void {
		for (const component of this.components) {
			component.onDestroy();
		}

		for (const child of this.children) {
			child.finalizeDestroy();
		}
	}
}
