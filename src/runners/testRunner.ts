import { report } from "lib/lester";
import { Runner } from "./runner";

export class TestRunner implements Runner {
    public run(): void {
        for (const filePath of this.collectTests()) {
            const requirePath = filePath.substring(1, filePath.length - 4).replace("/", ".");
            require(requirePath);
        }
    
        report();
        love.event.quit();
    };

    private collectTests(): string[] {
        const specFiles: string[] = [];
        const searchDirectory = (dir: string) => {
            const files = love.filesystem.getDirectoryItems(dir);
            for (const file of files) {
                const filePath = `${dir}/${file}`;
                if (love.filesystem.getInfo(filePath, "directory")) {
                    searchDirectory(filePath);
                } else if (string.match(file, "_spec%.lua$")[0] !== undefined) {
                    specFiles.push(filePath);
                }
            }
        };
        searchDirectory("");

        return specFiles;
    }
}