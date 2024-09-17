import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Animation } from "./animation";
import { Sprite } from "./sprite";

export class AnimatedSprite extends Component {
	private sprite = this.inject(Sprite);

	private animations: Record<string, Animation>;
	public activeAnimationName: string;

	private currentFrame: number;
	private currentDuration: number;

	public didLoop: boolean;

	constructor(entity: Entity, animations: Record<string, Animation>, activeAnimationName: string) {
		super(entity);

		this.animations = animations;
		this.activeAnimationName = activeAnimationName;

		this.currentFrame = 0;
		this.currentDuration = 0;

		this.didLoop = false;
	}

	public update(dt: number): void {
		const activeAnimation = this.animations[this.activeAnimationName];

		this.didLoop = false;
		this.currentDuration += dt;

		while (this.currentDuration >= activeAnimation.frameDuration) {
			this.currentDuration -= activeAnimation.frameDuration;

			this.currentFrame = (this.currentFrame + 1) % activeAnimation.frames.length;

			this.sprite.viewport = activeAnimation.frames[this.currentFrame];
			this.sprite.rebuildQuad();

			this.didLoop = this.currentFrame === 0;
		}
	}

	public play(animationName: string): void {
		if (animationName === this.activeAnimationName) {
			return;
		}

		this.activeAnimationName = animationName;
		this.currentFrame = 0;
		this.currentDuration = 0;

		const activeAnimation = this.animations[this.activeAnimationName];
		this.sprite.viewport = activeAnimation.frames[this.currentFrame];
		this.sprite.rebuildQuad();
	}
}
