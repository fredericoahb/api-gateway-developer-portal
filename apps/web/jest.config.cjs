module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/*.spec.(ts|tsx)"],
  transform: {
    "^.+\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }]
  }
};
