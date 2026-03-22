import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
    { ignores: ['dist/', 'jest.config.js', '__tests__/__fixtures__/'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettier
    // {
    //     files: ['**/*.{js,ts}'],
    //     rules: {
    //         '@typescript-eslint/no-explicit-any': 'off'
    //     }
    // }
];
