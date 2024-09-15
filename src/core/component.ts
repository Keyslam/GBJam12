import { Context } from "../context";
import { Entity } from "./entity";

export abstract class Component {
	private entity: Entity;

	public constructor(entity: Entity) {
		this.entity = entity;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(dt: number): void {}
	public draw(): void {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected inject<T extends Component>(componentClass: new (...args: any[]) => T): T {
		return this.entity.getComponent(componentClass);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected tryInject<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
		return this.entity.tryGetComponent(componentClass);
	}

	protected get context(): Context {
		return this.entity.context;
	}
}
