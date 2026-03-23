module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  // Указываем, что тесты используют глобальный Jest
  injectGlobals: true,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}
