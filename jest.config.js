/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    // Тестовые файлы
    testMatch: ['**/__tests__/**/*.test.ts'],
    // Генерация покрытия кода
    collectCoverage: false,
    coverageDirectory: 'coverage', // папка для отчётов
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
  
    // Какие файлы включать в покрытие
    collectCoverageFrom: [
      'src/**/*.js',
    ],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    // Поддержка ESM
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
  }