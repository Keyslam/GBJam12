import { Builder } from "../../core/builder";
import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { LevelLoader } from "../levels/levelLoader";
import { Sprite } from "../rendering/sprite";
import { SpriteRenderer } from "../rendering/spriteRendering";

class Title extends Component {
	private input = this.scene.findComponent(Input);
	private levelLoader: LevelLoader;

	private track = love.audio.newSource("assets/music/is_this_a_title_theme_alt.ogg", "stream");

	constructor(entity: Entity, levelLoader: LevelLoader) {
		super(entity);

		this.levelLoader = levelLoader;
		this.track.setLooping(true);
		this.track.setVolume(0.7);
		this.track.play();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		if (this.input.buttonAState.isPressed || this.input.buttonBState.isPressed || this.input.buttonStartState.isPressed) {
			this.track.stop();
			this.levelLoader.load("Entry");
		}
	}
}

export class TitleBuilder extends Builder<{ levelLoader: LevelLoader }> {
	private image = love.graphics.newImage("assets/title.png");

	public build(entity: Entity, props: { levelLoader: LevelLoader }): void {
		entity.addComponent(Position, new Position(entity, 0, 0));
		entity.addComponent(
			SpriteRenderer,
			new SpriteRenderer(
				entity,
				new Sprite(this.image, {
					x: 0,
					y: 0,
					width: 160,
					height: 144,
					originX: 0,
					originY: 0,
				}),
			),
		);
		entity.addComponent(Title, new Title(entity, props.levelLoader));
	}
}
