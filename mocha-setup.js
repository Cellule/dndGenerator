// Overwrite typescript compiler options for ts-node
process.env.TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}';
process.env.NODE_ENV = "test";
require("ts-node/register");
