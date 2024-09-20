import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Tilemap } from "../physics/tilemap";

export class TilemapBuilder extends Builder<undefined> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public build(entity: Entity, props: undefined): void {
		entity.addComponent(Tilemap, new Tilemap(entity));
	}
}
