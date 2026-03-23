module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  // Указываем, что тесты используют глобальный Jest
  injectGlobals: true,
  setupFiles: ['./jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^(\\.\\.?/.+)\\.js$': '$1',
  },
}
