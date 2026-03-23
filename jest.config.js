export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  // Указываем, что тесты используют глобальный Jest
  injectGlobals: true,
  setupFiles: ['./jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}
