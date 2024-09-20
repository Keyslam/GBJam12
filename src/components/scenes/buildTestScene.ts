import { Entity } from "../../core/entity";
import { buildEnemyGhost } from "../entity/enemyGhost";
import { buildTile } from "../entity/tile";
import { Camera } from "../locomation/camera";
import { Position } from "../position";

export function buildTestScreen(entity: Entity) {
	const camera = entity
		.addChild((entity) => {
			entity.addComponent(Position, new Position(entity, 0, 0));
			entity.addComponent(Camera, new Camera(entity));
		})
		.getComponent(Camera)!;

	// const body = entity.addChild((entity) => buildPlayerBody(entity, 24, 24));

	const body = entity.addChild((entity) => buildEnemyGhost(entity, 24, 24, false));

	camera.target = body;

	for (let x = 0; x < 10; x++) {
		entity.addChild((entity) => buildTile(entity, x, 6));
	}

	for (let x = 10; x < 15; x++) {
		entity.addChild((entity) => buildTile(entity, x, 11));
	}

	for (let x = 15; x < 20; x++) {
		entity.addChild((entity) => buildTile(entity, x, 17));
	}

	entity.addChild((entity) => buildTile(entity, 6, 9));
}
