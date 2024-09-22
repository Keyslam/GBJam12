import { Builder } from "./builder";
import { Component } from "./component";
import { Entity } from "./entity";

export class Scene {
	public entities: Entity[];

	constructor() {
		this.entities = [];
	}

	public addEntity<TProps>(entityBuilder: Builder<TProps>, props: TProps): Entity {
		const entity = new Entity(this);
		entityBuilder.build(entity, props);

		this.entities.push(entity);

		return entity;
	}

	public removeEntity(child: Entity): void {
		this.entities = this.entities.filter((x) => x !== child);
	}

	public update(dt: number): void {
		for (const entity of this.entities) {
			entity.update(dt);
		}

		this.removeDeadEntities();
	}

	public postUpdate(dt: number): void {
		for (const entity of this.entities) {
			entity.postUpdate(dt);
		}

		this.removeDeadEntities();
	}

	public draw(): void {
		for (const entity of this.entities) {
			entity.draw();
		}
	}

	public drawScreen(): void {
		for (const entity of this.entities) {
			entity.drawScreen();
		}
	}

	public destroy(): void {
		for (const entity of this.entities) {
			entity.destroy();
		}

		this.removeDeadEntities();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public findChildByComponent<T extends Component>(componentClass: new (...args: any[]) => T): Entity {
		for (const entity of this.entities) {
			if (entity.tryGetComponent(componentClass) !== undefined) {
				return entity;
			}
		}

		throw new Error("Component not found in scene");
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public tryFindChildByComponent<T extends Component>(componentClass: new (...args: any[]) => T): Entity | undefined {
		for (const entity of this.entities) {
			if (entity.tryGetComponent(componentClass) !== undefined) {
				return entity;
			}
		}

		return undefined;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public findComponent<T extends Component>(componentClass: new (...args: any[]) => T): T {
		for (const entity of this.entities) {
			const component = entity.tryGetComponent(componentClass);
			if (component !== undefined) {
				return component;
			}
		}

		throw new Error("Component not found in scene");
	}

	public removeDeadEntities(): void {
		const destroyedEntities = [];
		for (const entity of this.entities) {
			if (entity.isDestroyed) {
				destroyedEntities.push(entity);
			}
		}

		for (const entity of destroyedEntities) {
			this.removeEntity(entity);
		}
	}
}
