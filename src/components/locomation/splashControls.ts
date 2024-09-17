import { Component } from "../../core/component";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { buildTestScreen } from "../scenes/buildTestScene";

export class SplashControls extends Component {
	private animatedSprite = this.inject(AnimatedSprite);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override postUpdate(dt: number): void {
		if (this.animatedSprite.didLoop) {
			if (this.animatedSprite.activeAnimationName === "1") {
				this.animatedSprite.play("2");
			} else if (this.animatedSprite.activeAnimationName === "2") {
				this.animatedSprite.play("3");
			} else if (this.animatedSprite.activeAnimationName === "3") {
				this.animatedSprite.play("4");
			} else if (this.animatedSprite.activeAnimationName === "4") {
				this.animatedSprite.play("5");
			} else if (this.animatedSprite.activeAnimationName === "5") {
				this.entity.destroy();
				this.context.rootEntity.addChild(buildTestScreen);
			}
		}
	}
}
