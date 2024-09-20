import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Animation } from "./animation";
import { SpriteRenderer } from "./spriteRendering";

export class AnimatedSprite extends Component {
	private spriteRenderer = this.inject(SpriteRenderer);

	private animations: Record<string, Animation>;
	private activeAnimationName: string;

	private currentDuration: number;
	private currentFrameIndex: number;

	constructor(entity: Entity, animations: Record<string, Animation>, initalAnimationName: string) {
		super(entity);

		this.animations = animations;
		this.activeAnimationName = initalAnimationName;

		this.currentDuration = 0;
		this.currentFrameIndex = 0;
	}

	public override update(dt: number): void {
		this.currentDuration += dt;

		while (this.currentDuration >= this.activeFrame.duration) {
			this.currentDuration -= this.activeFrame.duration;
			this.currentFrameIndex++;

			if (this.currentFrameIndex >= this.activeAnimation.frames.length) {
				if (this.activeAnimation.playback === "freeze") {
					this.currentFrameIndex -= 1;
				}

				if (this.activeAnimation.playback === "loop") {
					this.currentFrameIndex = 0;
				}
			}
		}

		this.spriteRenderer.sprite = this.activeFrame.sprite;
	}

	public play(animationName: string) {
		if (animationName === this.activeAnimationName) {
			return;
		}

		this.activeAnimationName = animationName;

		this.currentDuration = 0;
		this.currentFrameIndex = 0;

		this.spriteRenderer.sprite = this.activeFrame.sprite;
	}

	private get activeAnimation() {
		return this.animations[this.activeAnimationName];
	}

	private get activeFrame() {
		return this.activeAnimation.frames[this.currentFrameIndex];
	}
}
