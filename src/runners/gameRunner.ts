import { Context } from "context";
import { Runner } from "./runner";

export class Game implements Runner {
	public run(): void {
		io.stdout.setvbuf("no");

		const [width, height] = love.window.getDesktopDimensions();
		const scaleFactor = Math.min(Math.floor(width / 160), Math.floor(height / 144)) - 2;

		love.window.setMode(scaleFactor * 160, scaleFactor * 144, {
			resizable: true,
		});

		love.graphics.setDefaultFilter("nearest", "nearest");

		const context = new Context();

		// for (let i = 0; i < 10; i++) {
		// 	context.spawnEntity((entity) => {
		// 		entity.addComponent(Position, new Position(entity, i * 12 + 6, 50));
		// 		entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
		// 		entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/tiles.png"), { x: 12, y: 0, width: 12, height: 12 }));
		// 	});
		// }

		// for (let i = 5; i < 15; i++) {
		// 	context.spawnEntity((entity) => {
		// 		entity.addComponent(Position, new Position(entity, i * 12 + 6, 130));
		// 		entity.addComponent(Solid, new Solid(entity, { top: 6, left: 6, bottom: 6, right: 6 }));
		// 		entity.addComponent(Sprite, new Sprite(entity, love.graphics.newImage("assets/tiles.png"), { x: 12, y: 0, width: 12, height: 12 }));
		// 	});
		// }

		love.update = (dt) => {
			context.update(dt);
		};

		love.draw = () => {
			context.draw();
		};

		love.mousepressed = (x, y) => {
			context.mousepressed(x, y);
		};
	}
}
