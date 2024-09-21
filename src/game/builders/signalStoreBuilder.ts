import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { SignalStore } from "../signals/signalStore";

export class SignalStoreBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(SignalStore, new SignalStore(entity));
	}
}
