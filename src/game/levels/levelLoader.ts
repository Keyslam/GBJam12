import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { EnemyGhostBuilder } from "../builders/enemyGhostBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Tilemap } from "../physics/tilemap";
import { Camera } from "../rendering/camera";

export class LevelLoader extends Component {
	private tilemap: Tilemap;

	private playerBuilder = new PlayerBuilder();
	private enemyGhostBuilder = new EnemyGhostBuilder();

	private layers: LdtkLayer[] = [];
	private entities: LdtkEntity[] = [];

	constructor(entity: Entity) {
		super(entity);

		ldtk.onLevelLoaded = (level) => this.onLevelLoaded(level);
		ldtk.onEntity = (entity) => this.onEntity(entity);
		ldtk.onLayer = (layer) => this.onLayer(layer);
		ldtk.onLevelCreated = (layer) => this.onLevelCreated(layer);

		ldtk.load("assets/maps/test.ldtk");

		this.tilemap = this.scene.findComponent(Tilemap);
	}

	public load(name: string) {
		ldtk.level(name);
	}

	public override draw() {
		for (const layer of this.layers.sort((x) => x.order)) {
			layer.draw();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private onLevelLoaded(level: LdtkLevel): void {}

	private onEntity(entity: LdtkEntity): void {
		this.entities.push(entity);
	}

	private onLayer(layer: LdtkLayer): void {
		this.layers.push(layer);
	}

	private onLevelCreated(level: LdtkLevel): void {
		const player = this.entities.find((x) => x.id === "Player")!;
		const playerBody = this.scene
			.addEntity(this.playerBuilder, {
				x: player.x,
				y: player.y,
			})
			.getComponent(PlayerBodyControls);

		for (const entity of this.entities) {
			if (entity.id === "Player") {
				continue;
			}

			if (entity.id === "EnemyGhost") {
				this.scene.addEntity(this.enemyGhostBuilder, {
					x: entity.x,
					y: entity.y,
					flipped: false,
					playerBody: playerBody,
				});
			}
		}

		const width = math.ceil(level.width / 12);
		const height = math.ceil(level.height / 12);

		const tiles: boolean[] = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const key = x + y * width;
				tiles[key] = false;
			}
		}

		for (const layer of this.layers) {
			if (layer.id === "Decor") {
				continue;
			}

			for (const tile of layer.tiles) {
				const x = tile.px[0] / 12;
				const y = tile.px[1] / 12;

				const key = x + y * width;
				tiles[key] = true;
			}
		}

		this.tilemap.load(width, height, tiles);

		{
			const player = this.scene.findChildByComponent(PlayerBodyControls);
			const camera = this.scene.findComponent(Camera);

			camera.target = player;
		}
	}
}
