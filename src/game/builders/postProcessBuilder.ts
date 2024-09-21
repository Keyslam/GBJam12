import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { PostProcess } from "../rendering/postProcess";

export class PostProcessBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(PostProcess, new PostProcess(entity));
	}
}
