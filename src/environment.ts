// @ts-ignore
const args: string[] = arg;

export const Environment = {
	IS_DEBUG: os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && (args[2] === "debug" || args[2] === "test"),
	IS_TEST: os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && args[2] === "test",
};
