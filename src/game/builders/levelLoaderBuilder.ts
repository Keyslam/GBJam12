import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { LevelLoader } from "../levels/levelLoader";

export class LevelLoaderBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(LevelLoader, new LevelLoader(entity));
	}
}
