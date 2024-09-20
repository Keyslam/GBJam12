import { Component } from "../../core/component";
import { Entity } from "../../core/entity";
import { Position } from "../common/position";
import { Sprite } from "./sprite";

export class SpriteRenderer extends Component {
	private position = this.inject(Position);

	private _sprite: Sprite | undefined;
	/* prettier-ignore */ public get sprite() { return this._sprite; }
	/* prettier-ignore */ public set sprite(sprite: Sprite | undefined) { this._sprite = sprite; }

	private _isFlipped: boolean;
	/* prettier-ignore */ public get isFlipped() { return this._isFlipped; }
	/* prettier-ignore */ public set isFlipped(isFlipped: boolean) { this._isFlipped = isFlipped; }

	constructor(entity: Entity, sprite: Sprite | undefined = undefined, isFlipped: boolean = false) {
		super(entity);

		this._sprite = sprite;
		this._isFlipped = isFlipped;
	}

	public override draw() {
		this.sprite?.draw(this.position.x, this.position.y, this.isFlipped);
	}
}
