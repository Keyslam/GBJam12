import { Entity } from "../../core/entity";
import { buildSplash } from "../entity/splash";

export function buildSplashScreen(entity: Entity) {
	entity.addChild(buildSplash);
}
