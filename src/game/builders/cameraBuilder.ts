import { Builder } from "../../core/builder";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Camera } from "../rendering/camera";

export interface CameraProps {
	x: number;
	y: number;
}

export class CameraBuilder extends Builder<CameraProps> {
	public build(entity: Entity, props: CameraProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(Camera, new Camera(entity));
	}
}
