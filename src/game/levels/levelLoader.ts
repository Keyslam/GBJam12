import { Source } from "love.audio";
import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Scheduler } from "../../core/scheduler";
import { BlockBuilder } from "../builders/blockBuilder";
import { CameraBuilder } from "../builders/cameraBuilder";
import { ControlBuilder } from "../builders/controlBuilder";
import { DeathBuilder } from "../builders/deathBuilder";
import { DoorBuilder } from "../builders/doorBuilder";
import { EnemyGhostBuilder } from "../builders/enemyGhostBuilder";
import { FinishBuilder } from "../builders/finishBuilder";
import { FireworkBuilder } from "../builders/fireworkBuilder";
import { InputBuilder } from "../builders/inputBuilder";
import { KissthechefBuilder } from "../builders/kissthechefBuilder";
import { PlayerBuilder } from "../builders/playerBuilder";
import { PostProcessBuilder } from "../builders/postProcessBuilder";
import { SchedulerBuilder } from "../builders/schedulerBuilder";
import { SignalStoreBuilder } from "../builders/signalStoreBuilder";
import { SpikesBuilder } from "../builders/spikesBuilder";
import { SplashBuilder } from "../builders/splashBuilder";
import { SwitchBuilder } from "../builders/switchBuilder";
import { TilemapBuilder } from "../builders/tilemapBuilder";
import { TitleBuilder } from "../builders/titleBuilder";
import { TrapdoorBuilder } from "../builders/trapdoorBuilder";
import { Position } from "../common/position";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { Tile, Tilemap } from "../physics/tilemap";
import { Camera } from "../rendering/camera";
import { PostProcess } from "../rendering/postProcess";
import { SignalStore } from "../signals/signalStore";

export class LevelLoader extends Component {
	private signalStore!: SignalStore;
	private tilemap!: Tilemap;

	private playerBuilder = new PlayerBuilder();
	private enemyGhostBuilder = new EnemyGhostBuilder();
	private trapdoorBuilder = new TrapdoorBuilder();
	private switchBuilder = new SwitchBuilder();
	private spikeBuilder = new SpikesBuilder();
	private doorBuilder = new DoorBuilder();
	private blockBuilder = new BlockBuilder();
	private splashBuilder = new SplashBuilder();

	private layers: LdtkLayer[] = [];
	private entities: LdtkEntity[] = [];

	private track: Source | undefined;
	private playingTrack: string = "";

	constructor(entity: Entity) {
		super(entity);

		ldtk.onLevelLoaded = (level) => this.onLevelLoaded(level);
		ldtk.onEntity = (entity) => this.onEntity(entity);
		ldtk.onLayer = (layer) => this.onLayer(layer);
		ldtk.onLevelCreated = (layer) => this.onLevelCreated(layer);

		ldtk.load("assets/maps/test.ldtk");
	}

	private name: string = "";
	private previousName: string = "";
	private willLoad = false;
	private loadedOnce = false;

	public load(name: string) {
		if (this.loading) {
			return;
		}

		if (this.name !== "death") {
			this.previousName = this.name;
		}
		this.name = name;
		this.willLoad = true;
	}

	public willReload = false;
	public reload() {
		this.load(this.name);
	}

	public handleReload() {
		if (this.willReload) {
			this.willReload = false;
			for (const entity of this.scene.entities) {
				if (entity === this.entity) {
					continue;
				}

				entity.destroy();
			}
			this.scene.removeDeadEntities();

			this.layers = [];
			this.entities = [];

			this.load("Level_0");
		}
	}
	public loading = false;

	public async handleLoad(): Promise<void> {
		if (this.loading) {
			return;
		}

		if (this.willLoad) {
			this.loading = true;
			this.willLoad = false;

			if (this.loadedOnce) {
				const postProcess = this.scene.findComponent(PostProcess);
				await postProcess.fadeOut();
			}

			const paletteIndex = this.scene.tryFindChildByComponent(PostProcess)?.getComponent(PostProcess)?.paletteIndex || 0;

			for (const entity of this.scene.entities) {
				if (entity === this.entity) {
					continue;
				}

				entity.destroy();
			}
			this.scene.removeDeadEntities();

			this.layers = [];
			this.entities = [];

			this.scene.addEntity(new SchedulerBuilder(), undefined);
			this.scene.addEntity(new InputBuilder(), undefined);
			this.scene.addEntity(new SignalStoreBuilder(), undefined);
			this.scene.addEntity(new TilemapBuilder(), undefined);
			this.scene.addEntity(new PostProcessBuilder(), undefined).getComponent(PostProcess);
			this.scene.addEntity(new CameraBuilder(), {
				x: 80,
				y: 72,
			});

			this.signalStore = this.scene.findComponent(SignalStore);
			this.tilemap = this.scene.findComponent(Tilemap);

			let doFade = true;

			if (this.name === "splash") {
				this.scene.addEntity(this.splashBuilder, undefined);

				const camera = this.scene.findComponent(Camera);
				camera.offsetX = 80;
				camera.offsetY = 72;

				const scheduler = this.scene.findComponent(Scheduler);

				scheduler.waitForSeconds(0.4).then(() => {
					love.audio.newSource("assets/sfx/wave_hurt_1.wav", "stream").play();
				});

				scheduler.waitForSeconds(1.25).then(() => {
					love.audio.newSource("assets/sfx/wave_collect_1.wav", "stream").play();
				});

				scheduler.waitForSeconds(2.9).then(() => {
					love.audio.newSource("assets/sfx/noise_lightning_1.wav", "stream").play();
				});

				scheduler.waitForSeconds(3).then(() => {
					this.load("title");
				});

				doFade = false;
			} else if (this.name === "title") {
				this.scene.addEntity(new TitleBuilder(), { levelLoader: this });

				const camera = this.scene.findComponent(Camera);
				camera.offsetX = 80;
				camera.offsetY = 72;
			} else if (this.name === "death") {
				this.scene.addEntity(new DeathBuilder(), { levelLoader: this, name: this.previousName });

				const camera = this.scene.findComponent(Camera);
				camera.offsetX = 80;
				camera.offsetY = 72;
			} else if (this.name === "finish") {
				this.scene.addEntity(new FinishBuilder(), undefined);

				const camera = this.scene.findComponent(Camera);
				camera.offsetX = 80;
				camera.offsetY = 72;

				this.track?.stop();
				const t = love.audio.newSource("assets/music/spooky_month_alt.ogg", "stream");
				t.setVolume(0.7);
				t.setLooping(true);
				t.play();
			} else {
				ldtk.level(this.name);
			}

			this.scene.update(0);

			if (doFade) {
				const postProcess = this.scene.findComponent(PostProcess);
				postProcess.paletteIndex = paletteIndex;
				await postProcess.fadeIn();
			} else {
				const postProcess = this.scene.findComponent(PostProcess);
				postProcess.paletteOffset = 0;
			}

			this.loadedOnce = true;
			this.loading = false;
		}
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
				levelLoader: this,
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
					flipped: entity.props["Flipped"],
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

			if (entity.id === "Block") {
				const signalId = entity.props["Id"];
				this.signalStore.registerSignal(signalId);

				this.scene.addEntity(this.blockBuilder, {
					x: entity.x,
					y: entity.y,
					signalId: signalId,
					key: entity.x / 12 + (entity.y / 12) * width,
					invert: entity.props["Invert"],
				});

				bb = { x: 0, y: 0, w: 12, h: 12 };
			}

			if (entity.id === "Spikes") {
				this.scene.addEntity(this.spikeBuilder, {
					x: entity.x,
					y: entity.y,
				});
			}

			if (entity.id === "Door") {
				this.scene.addEntity(this.doorBuilder, {
					x: entity.x,
					y: entity.y,
					level: entity.props["Level"],
					levelLoader: this,
					visible: entity.props["Visible"],
				});
			}

			if (entity.id === "Control") {
				this.scene.addEntity(new ControlBuilder(), {
					x: entity.x,
					y: entity.y,
					kind: entity.props["Kind"],
				});
			}

			if (entity.id === "KissTheChef") {
				this.scene.addEntity(new KissthechefBuilder(), {
					x: entity.x,
					y: entity.y,
				});
			}

			if (entity.id === "Firework") {
				this.scene.addEntity(new FireworkBuilder(), {
					x: entity.x,
					y: entity.y,
				});
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
			camera.position.x = player.getComponent(Position).x;
			camera.position.y = player.getComponent(Position).y;
			camera.doLerp = false;
		}

		const track = level.props["track"] as string;
		if (track !== this.playingTrack) {
			this.track?.stop();

			this.track = love.audio.newSource("assets/music/" + track + ".ogg", "stream");
			this.track.setLooping(true);
			this.track.play();
			// this.track.setVolume(0.0);
			this.track.setVolume(0.7);
			this.playingTrack = track;
		}
	}
}
