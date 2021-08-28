/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "(/src/tests/.*|(\\.|/)(test|spec))\\.[jt]s?$",
  moduleFileExtensions: ["ts", "js"],
};
