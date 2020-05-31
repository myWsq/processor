const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper:
    compilerOptions.paths && pathsToModuleNameMapper(compilerOptions.paths),
};
