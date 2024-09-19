import { Viewport } from "./sprite";

export interface Animation {
	frames: Viewport[];
	frameDuration: number;
	offsetX: number | undefined;
	offsetY: number | undefined;
}

export const createAnimation = (row: number, frameCount: number, rowWidth: number, rowHeight: number, duration: number, offsetX: number | undefined = undefined, offsetY: number | undefined = undefined): Animation => {
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
		offsetX: offsetX,
		offsetY: offsetY,
	};
};
