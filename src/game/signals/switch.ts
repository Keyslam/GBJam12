import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Input } from "../input/input";
import { PlayerBodyControls } from "../locomotion/playerBodyControls";
import { PlayerGhostControls } from "../locomotion/playerGhostControls";
import { AnimatedSprite } from "../rendering/animatedSprite";
import { SignalStore } from "./signalStore";

export class Switch extends Component {
	private input = this.scene.findComponent(Input);
	private signalStore = this.scene.findComponent(SignalStore);

	private position = this.inject(Position);
	private playerPosition = this.scene.findChildByComponent(PlayerBodyControls).getComponent(Position);

	private animatedSprite = this.inject(AnimatedSprite);

	private signalId: number;

	private active = false;

	private bodyWasNear = false;
	private ghostWasNear = false;

	private toggleSound = love.audio.newSource("assets/sfx/noise_lever_toggle_2.wav", "static");

	constructor(entity: Entity, signalId: number) {
		super(entity);

		this.signalId = signalId;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public override update(dt: number): void {
		{
			const dx = this.position.x + 6 - this.playerPosition.x;
			const dy = this.position.y + 6 - this.playerPosition.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance <= 10) {
				if (this.bodyWasNear == false) {
					this.bodyWasNear = true;

					this.active = !this.active;
					this.signalStore.setSignal(this.signalId, this.active);

					if (this.active) {
						this.animatedSprite.play("toggle_on");
						this.toggleSound.play();
					} else {
						this.animatedSprite.play("toggle_off");
						this.toggleSound.play();
					}
				}
			} else {
				this.bodyWasNear = false;
			}
		}

		{
			const ghostPosition = this.scene.tryFindChildByComponent(PlayerGhostControls)?.getComponent(Position);

			if (ghostPosition) {
				const dx = this.position.x + 6 - ghostPosition.x;
				const dy = this.position.y + 6 - ghostPosition.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance <= 10) {
					if (this.ghostWasNear == false) {
						this.ghostWasNear = true;

						this.active = !this.active;
						this.signalStore.setSignal(this.signalId, this.active);

						if (this.active) {
							this.animatedSprite.play("toggle_on");
							this.toggleSound.play();
						} else {
							this.animatedSprite.play("toggle_off");
							this.toggleSound.play();
						}
					}
				} else {
					this.ghostWasNear = false;
				}
			}
		}
	}
}
