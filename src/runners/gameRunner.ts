import { Context } from "context";
import { Player } from "entities/player";
import { Tile } from "entities/tile";
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

		context.add(new Player(context));
		context.add(new Tile(context));

		love.update = (dt) => {
			context.update(dt);
		};

		love.draw = () => {
			context.draw();
		};
	}
}
