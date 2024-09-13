import { VersionInfo } from "versionInfo";
import { Runner } from "./runner";

export class Game implements Runner {
    public run(): void {
        love.window.setMode(1280, 720, {});

        const image = love.graphics.newImage("assets/image.png");

        love.draw = () => {
            love.graphics.draw(image, 150);
            love.graphics.print(`Version: ${VersionInfo.major}.${VersionInfo.minor}.${VersionInfo.patch}\nCommit: ${VersionInfo.commit}\nType: ${VersionInfo.type}`);
        };

    }
}

