import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { EnemyGhostBuilder } from "../builders/enemyGhostBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { SwitchBuilder } from "../builders/switchBuilder";
import { TrapdoorBuilder } from "../builders/trapdoorBuilder";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Tile, Tilemap } from "../physics/tilemap";
import { Camera } from "../rendering/camera";
import { SignalStore } from "../signals/signalStore";

export class LevelLoader extends Component {
	private signalStore = this.scene.findComponent(SignalStore);

	private tilemap: Tilemap;

	private playerBuilder = new PlayerBuilder();
	private enemyGhostBuilder = new EnemyGhostBuilder();
	private trapdoorBuilder = new TrapdoorBuilder();
	private switchBuilder = new SwitchBuilder();

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

		const width = math.ceil(level.width / 12);
		const height = math.ceil(level.height / 12);

		const tiles: Tile[] = [];

		for (const entity of this.entities) {
			if (entity.id === "Player") {
				continue;
			}

			let bb: { x: number; y: number; w: number; h: number } | undefined = undefined;
			const kxo = 0;
			let kyo = 0;

			if (entity.id === "EnemyGhost") {
				this.scene.addEntity(this.enemyGhostBuilder, {
					x: entity.x,
					y: entity.y,
					flipped: false,
					playerBody: playerBody,
				});
			}

			if (entity.id === "Switch") {
				const signalId = entity.props["Id"];
				this.signalStore.registerSignal(signalId);

				this.scene.addEntity(this.switchBuilder, {
					x: entity.x,
					y: entity.y,
					signalId: signalId,
				});
			}

			if (entity.id === "Trapdoor_Left" || entity.id === "Trapdoor_Right") {
				const signalId = entity.props["Id"];
				this.signalStore.registerSignal(signalId);

				this.scene.addEntity(this.trapdoorBuilder, {
					x: entity.x,
					y: entity.y,
					signalId: signalId,
					key: entity.x / 12 + (entity.y / 12 + 1) * width,
					flipped: entity.id === "Trapdoor_Right",
				});

				bb = { x: 0, y: 0, w: 12, h: 5 };
				kyo = 1;
			}

			if (bb) {
				const x = entity.x / 12;
				const y = entity.y / 12;

				const key = x + kxo + (y + kyo) * width;
				tiles[key] = {
					boundingBox: { left: bb.x, top: bb.y, right: bb.x + bb.w, bottom: bb.y + bb.h },
					state: "solid",
				};
			}
		}

		for (const layer of this.layers) {
			if (layer.id === "Props") {
				for (const tile of layer.tiles) {
					const id = tile.t;

					let bb: { x: number; y: number; w: number; h: number } | undefined = undefined;

					{
						// Book shelf
						if (id === 186 || id === 187) {
							bb = { x: 0, y: 9, w: 12, h: 3 };
						}
					}

					{
						// One-way platform
						if (id === 16) {
							bb = { x: 0, y: 0, w: 12, h: 5 };
						}
					}

					{
						// Furnace
						if (id === 210) {
							bb = { x: 10, y: 4, w: 2, h: 3 };
						}

						if (id === 211 || id === 212 || id === 213 || id === 214) {
							bb = { x: 0, y: 4, w: 12, h: 3 };
						}

						if (id === 215) {
							bb = { x: 0, y: 4, w: 2, h: 3 };
						}
					}

					if (bb) {
						const x = tile.px[0] / 12;
						const y = tile.px[1] / 12;

						const key = x + y * width;
						tiles[key] = {
							boundingBox: { left: bb.x, top: bb.y, right: bb.x + bb.w, bottom: bb.y + bb.h },
							state: "one-way",
						};
					}
				}
			} else {
				for (const tile of layer.tiles) {
					const x = tile.px[0] / 12;
					const y = tile.px[1] / 12;

					const key = x + y * width;
					tiles[key] = {
						boundingBox: { left: 0, top: 0, right: 12, bottom: 12 },
						state: "solid",
					};
				}
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
