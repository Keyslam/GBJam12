import { Context } from "../context";
import { Entity } from "./entity";

export abstract class Component {
	private _entity: Entity;
	/* prettier-ignore */ public get entity() { return this._entity; }

	public constructor(entity: Entity) {
		this._entity = entity;
	}

	public onDestroy(): void {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(dt: number): void {}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postUpdate(dt: number): void {}

	public draw(): void {}
	public drawScreen(): void {}

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
