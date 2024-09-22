import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { LevelLoader } from "../levels/levelLoader";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Body } from "../physics/body";

export class Door extends Component {
	private playerBody = this.scene.findComponent(PlayerBodyControls);

	private position = this.inject(Position);

	private level: string;
	private levelLoader: LevelLoader;

	constructor(entity: Entity, level: string, levelLoader: LevelLoader) {
		super(entity);

		this.level = level;
		this.levelLoader = levelLoader;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		const top = this.position.y + 0;
		const left = this.position.x + 0;
		const bottom = top + 24;
		const right = left + 24;

		const playerPosition = this.playerBody.entity.getComponent(Position);
		const playerActor = this.playerBody.entity.getComponent(Body);
		const playerTop = playerPosition.y + playerActor.boundingBox.top;
		const playerLeft = playerPosition.x + playerActor.boundingBox.left;
		const playerBottom = playerPosition.y + playerActor.boundingBox.bottom;
		const playerRight = playerPosition.x + playerActor.boundingBox.right;

		if (left < playerRight && right > playerLeft && top < playerBottom && bottom > playerTop) {
			this.levelLoader.load(this.level);
		}
	}
}
