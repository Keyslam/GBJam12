import { Builder } from "../../core/builder";
import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { createAnimation } from "../rendering/animation";
import { SpriteRenderer } from "../rendering/spriteRendering";

export interface KissthechefProps {
	x: number;
	y: number;
}

class KissTheChef extends Component {
	private animatedSprite = this.inject(AnimatedSprite);

	constructor(entity: Entity) {
		super(entity);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public update(dt: number): void {
		if (this.animatedSprite.didFinish) {
			const n = this.animatedSprite.activeAnimationName;
			if (n === "1") {
				this.animatedSprite.play("2");
			}
			if (n === "2") {
				this.animatedSprite.play("3");
			}
			if (n === "3") {
				this.animatedSprite.play("4");
			}
			if (n === "4") {
				this.animatedSprite.play("5");
			}
			if (n === "5") {
				this.animatedSprite.play("6");
			}
			if (n === "6") {
				this.animatedSprite.play("7");
			}
			if (n === "7") {
				this.animatedSprite.play("8");
			}
			if (n === "8") {
				this.animatedSprite.play("1");
			}
		}
	}
}

export class KissthechefBuilder extends Builder<KissthechefProps> {
	private image = love.graphics.newImage("assets/kissthechef.png");

	public build(entity: Entity, props: KissthechefProps): void {
		entity.addComponent(Position, new Position(entity, props.x, props.y));
		entity.addComponent(SpriteRenderer, new SpriteRenderer(entity));
		entity.addComponent(
			AnimatedSprite,
			new AnimatedSprite(
				entity,
				{
					"1": this.createAnimation(0, 1, 5),
					"2": this.createAnimation(1, 1, 0.1),
					"3": this.createAnimation(2, 1, 0.06),
					"4": this.createAnimation(3, 1, 0.2),
					"5": this.createAnimation(4, 3, 0.1),
					"6": this.createAnimation(5, 1, 0.06),
					"7": this.createAnimation(6, 1, 3),
					"8": this.createAnimation(7, 2, 0.06),
				},
				"1",
			),
		);
		entity.addComponent(KissTheChef, new KissTheChef(entity));
	}

	private createAnimation(row: number, frameCount: number, duration: number, playback: "loop" | "freeze" = "loop") {
		return createAnimation(this.image, {
			row: row,
			frameCount: frameCount,
			duration: duration,
			playback: playback,
			originX: 0,
			originY: 0,
			cellWidth: 24,
			cellHeight: 24,
			flipped: false,
		});
	}
}
