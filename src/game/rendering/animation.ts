import { Image } from "love.graphics";
import { Sprite } from "./sprite";

export interface Frame {
	sprite: Sprite;
	duration: number;
}

export interface Animation {
	frames: Frame[];
	playback: "loop" | "freeze";
}

export interface CreateAnimationProps {
	row: number;
	frameCount: number;
	cellWidth: number;
	cellHeight: number;
	playback: "loop" | "freeze";
	flipped: boolean;
	originX: number | undefined;
	originY: number | undefined;
	duration: number;
}

export function createAnimation(image: Image, props: CreateAnimationProps): Animation {
	const frames: Frame[] = [];

	for (let i = 0; i < props.frameCount; i++) {
		const frame: Frame = {
			sprite: new Sprite(
				image,
				{
					x: i * props.cellWidth,
					y: props.row * props.cellHeight,
					width: props.cellWidth,
					height: props.cellHeight,
					originX: props.originX,
					originY: props.originY,
				},
				props.flipped,
			),
			duration: props.duration,
		};

		frames.push(frame);
	}

	return {
		frames: frames,
		playback: props.playback,
	};
}
