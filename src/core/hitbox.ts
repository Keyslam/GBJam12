export class Hitbox {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public overlaps(x: number, y: number, width: number, height: number) {
		return x < this.x + this.width && this.x < x + width && y < this.y + this.height && this.y < y + height;
	}

	public overlapsWith(other: Hitbox) {
		return this.overlaps(other.x, other.y, other.width, other.height);
	}

	public draw(offsetX: number, offsetY: number): void {
		love.graphics.setColor(0, 0, 1, 0.5);
		love.graphics.rectangle("line", this.x + 0.5 + offsetX, this.y + 0.5 + offsetY, this.width - 1, this.height - 1);
	}
}
