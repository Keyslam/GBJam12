import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Input } from "../input/input";

export class InputBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(Input, new Input(entity));
	}
}
