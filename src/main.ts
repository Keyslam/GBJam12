import { Environment } from "environment";
import { Game } from "runners/gameRunner";
import { TestRunner } from "runners/testRunner";

_G.ldtk = require("lib/ldtk/ldtk");

if (Environment.IS_DEBUG) {
	require("lldebugger").start();
}

const runner = Environment.IS_TEST ? new TestRunner() : new Game();
runner.run();
