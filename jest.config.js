/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',  // убирает .js для импортов в тестах (опционально)
    },
    // Тестовые файлы
    testMatch: ['**/__tests__/**/*.test.js'],
    // Генерация покрытия кода
    collectCoverage: false,
    coverageDirectory: 'coverage', // папка для отчётов
    coverageReporters: ['json', 'lcov', 'text', 'clover'],

    // Какие файлы включать в покрытие
    collectCoverageFrom: ['src/**/*.ts']
};
