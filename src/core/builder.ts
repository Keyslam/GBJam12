import { Entity } from "./entity";

export abstract class Builder<TProps> {
	public abstract build(entity: Entity, props: TProps): void;
}
