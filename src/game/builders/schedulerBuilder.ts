import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";

export class SchedulerBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(Scheduler, new Scheduler(entity));
	}
}
