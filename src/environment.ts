export const Environment = {
    // @ts-ignore
    IS_DEBUG = os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && (arg[2] === "debug" || arg[2] === "test"),
    // @ts-ignore
    IS_TEST = os.getenv("LOCAL_LUA_DEBUGGER_VSCODE") === "1" && arg[2] === "test",
}