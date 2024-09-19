import { Context } from "../context";
import { Entity } from "./entity";

export abstract class Component {
	public entity: Entity;

	public constructor(entity: Entity) {
		this.entity = entity;
	}

	public onDestroy(): void {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public preUpdate(dt: number): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(dt: number): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postUpdate(dt: number): void {}

	public preDraw(): void {}
	public draw(): void {}
	public postDraw(): void {}

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

	protected get parent(): Entity | undefined {
		return this.entity.parent;
	}
}
