declare namespace luastar {
	export function find(width: number, height: number, start: { x: number; y: number }, goal: { x: number; y: number }, positionIsOpenFn: (this: void, x: number, y: number) => boolean, useCache: boolean, excludeDiagonalMovement: boolean): { x: number; y: number }[] | false;
}
