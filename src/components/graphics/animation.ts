import { Viewport } from "./sprite";

export interface Animation {
	frames: Viewport[];
	frameDuration: number;
}

export const createAnimation = (row: number, frameCount: number, rowWidth: number, rowHeight: number, duration: number): Animation => {
	let x = 0;
	const y = row * rowHeight;

	const frames: Viewport[] = [];
	for (let i = 0; i < frameCount; i++) {
		const frame: Viewport = {
			x: x,
			y: y,
			width: rowWidth,
			height: rowHeight,
		};

		frames.push(frame);

		x += rowWidth;
	}

	return {
		frames: frames,
		frameDuration: duration,
	};
};
