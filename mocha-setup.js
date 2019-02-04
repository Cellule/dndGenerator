// Overwrite typescript compiler options for ts-node
process.env.TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}';
process.env.MOCHA = "true"
require("ts-node/register");
