export class Vector2 {
	public readonly x: number;
	public readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public static add(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x + b.x, a.y + b.y);
	}

	public static addX(a: Vector2, x: number): Vector2 {
		return new Vector2(a.x + x, a.y);
	}

	public static addY(a: Vector2, y: number): Vector2 {
		return new Vector2(a.x, a.y + y);
	}

	public static sub(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x - b.x, a.y - b.y);
	}

	public static subX(a: Vector2, x: number): Vector2 {
		return new Vector2(a.x - x, a.y);
	}

	public static subY(a: Vector2, y: number): Vector2 {
		return new Vector2(a.x, a.y - y);
	}

	public static zero(): Vector2 {
		return new Vector2(0, 0);
	}

	public static x(x: number): Vector2 {
		return new Vector2(x, 0);
	}

	public static y(y: number): Vector2 {
		return new Vector2(0, y);
	}
}
