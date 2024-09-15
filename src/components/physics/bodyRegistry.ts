import { Body } from "./body";
import { BoundingBox } from "./boundingBox";

export class BodyRegistry {
	private bodies: Body[] = [];

	public registerBody(body: Body): void {
		this.bodies.push(body);
	}

	public query(boundingBox: BoundingBox, exclude: Body | undefined = undefined): Body[] {
		return this.bodies.filter((body) => {
			return body != exclude && boundingBox.left < body.right && body.left < boundingBox.right && boundingBox.top < body.bottom && body.top < boundingBox.bottom;
		});
	}
}
