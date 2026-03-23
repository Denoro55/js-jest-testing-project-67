/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',

  // Поддержка TypeScript
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // ✅ Трансформация .ts файлов
  },

  // Расширения файлов
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'], // ✅

  // Тестовые файлы
  testMatch: ['**/__tests__/**/*.test.ts'],

  // Генерация покрытия кода
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // ✅ Исправлено .js -> .ts
  collectCoverageFrom: [
    'src//*.ts',
    '!src//*.d.ts',      // ✅ Исключить файлы деклараций
    '!src//*.test.ts',   // ✅ Исключить сами тесты
  ],
};